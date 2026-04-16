# Architecture — AI Node Control SaaS

## 1. High-level overview

```
                     ┌────────────────────────────────────────┐
                     │              Users & Teams              │
                     └─────────────────┬──────────────────────┘
                                       │ HTTPS
                     ┌─────────────────▼──────────────────────┐
                     │          apps/web (Next.js 14)          │
                     │  · Dashboard · Agents · Chat · Billing  │
                     │  · shadcn/ui Pro Max · Tailwind · RSC   │
                     └─────────────────┬──────────────────────┘
                                       │ REST + WebSocket (Socket.IO) + SSE
                     ┌─────────────────▼──────────────────────┐
                     │           apps/api (NestJS)             │
                     │  Auth · Nodes · Agents · Chat · Billing │
                     │  Swagger · Rate-limit · RBAC · API keys │
                     └───┬──────────┬──────────┬───────────┬──┘
                         │          │          │           │
                ┌────────▼──┐  ┌────▼─────┐  ┌─▼─────┐  ┌──▼────────┐
                │ PostgreSQL│  │  Redis   │  │BullMQ │  │  AI nodes │
                │  (Prisma) │  │ pub/sub  │  │ queue │  │  runtime  │
                └───────────┘  └──────────┘  └───────┘  └───────────┘
```

The API is a modular NestJS monolith ready for extraction into microservices. Heavy or asynchronous work (node health checks, usage aggregation, webhooks, long LLM jobs) runs on **BullMQ** workers backed by Redis. Real-time updates flow over **Socket.IO** rooms scoped by `tenantId:resource`.

---

## 2. Domain model (bounded contexts)

| Context | Responsibility |
|---|---|
| **Identity** | Users, tenants, memberships, roles, API keys, sessions |
| **Billing** | Plans, subscriptions, quotas, Stripe webhooks, usage metering |
| **Infrastructure** | Nodes (IDs, endpoints, resources, status, tags, health) |
| **Agents** | Agents, prompts, models, tools, memory, node assignment |
| **Conversations** | Chats, messages, attachments, streaming tokens |
| **Integrations** | Public API, webhooks, OAuth apps |

Each context maps to a NestJS module with its own Prisma namespace, DTOs, service, controller, and (where applicable) gateway/worker.

---

## 3. Frontend (Next.js 14 · App Router)

Key principles:

- **RSC-first**: data fetching happens in server components; client components handle interactivity and streaming.
- **Design system**: `packages/ui` re-exports shadcn primitives with a premium theme (glassmorphism cards, gradient accents, radix motion).
- **Realtime**: a single `SocketProvider` subscribes to `tenant:{tenantId}` room; components subscribe to scoped events via a `useRealtime(resource)` hook.
- **State**: TanStack Query for server state, Zustand for UI state (sidebars, modals, chat selection).
- **Theming**: CSS variables via `next-themes`; dark by default.

### Page map

```
/login
/register
/onboarding

/(app)
  ├─ /dashboard              # Overview, usage, alerts
  ├─ /nodes                  # Grid + Table + filters
  │   └─ /[nodeId]           # Metrics, logs, assignments
  ├─ /agents                 # List + create modal
  │   └─ /[agentId]          # Config + playground
  ├─ /chat
  │   └─ /[conversationId]   # ChatGPT-style streaming UI
  ├─ /api-keys
  ├─ /billing                # Plan, invoices, usage
  ├─ /team                   # Members, roles, invites
  └─ /settings               # Profile, theme, webhooks

/admin                       # Platform operators only
```

---

## 4. Backend (NestJS)

```
apps/api/src
├── main.ts
├── worker.ts                # Separate entrypoint for BullMQ consumers
├── app.module.ts
├── common/
│   ├── guards/              # Jwt, ApiKey, Roles, Tenant
│   ├── interceptors/        # Logging, Tenant scoping, RateLimit
│   ├── decorators/          # @CurrentUser, @Tenant, @Public
│   └── filters/
├── modules/
│   ├── auth/                # JWT, refresh, API keys
│   ├── users/
│   ├── tenants/             # Multi-tenant orgs, memberships
│   ├── billing/             # Stripe, plans, quotas
│   ├── nodes/               # CRUD + health + metrics gateway
│   ├── agents/              # CRUD, prompt, tools config
│   ├── chat/                # Conversations, streaming, tools orchestration
│   ├── ai-provider/         # OpenAI / Anthropic / local adapter
│   ├── webhooks/            # Outgoing webhooks for integrations
│   └── integrations/        # OAuth, 3rd-party SaaS connectors
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
└── realtime/
    ├── realtime.gateway.ts  # Socket.IO auth + room mgmt
    └── events.ts
```

### Cross-cutting

- **AuthN**: `JwtStrategy` (Bearer access token) + `ApiKeyStrategy` (header `X-API-Key`, hashed lookup).
- **AuthZ**: `@Roles('admin' | 'owner' | 'member')` guard + tenant scoping interceptor (injects `tenantId` into every query).
- **Rate limiting**: `@nestjs/throttler` per-tenant + per-API-key; Redis store for distributed counts.
- **Validation**: `class-validator` + `ValidationPipe({ whitelist: true, transform: true })`.
- **Observability**: pino logger, OpenTelemetry traces, `/health` + `/metrics` (Prometheus).
- **Secrets**: loaded via `@nestjs/config`; schema-validated with Zod.

### AI provider adapter

```ts
interface AiProvider {
  chat(input: ChatInput): AsyncIterable<ChatChunk>;
  embed(input: EmbedInput): Promise<number[][]>;
  listModels(): Promise<Model[]>;
}
```

Implementations: `OpenAiProvider`, `AnthropicProvider`, `OllamaProvider`. The registry resolves a provider by `agent.modelId` (e.g. `openai:gpt-4.1`, `anthropic:claude-sonnet-4-6`, `local:llama3`). Streaming chunks are forwarded to the client via Socket.IO for in-app chat and SSE for the public `/chat` REST endpoint.

---

## 5. Nodes lifecycle

```
registered → provisioning → active ⇄ busy
                         ↓        ↑
                      paused     restart
                         ↓
                     inactive
```

- **Health checks**: the `nodes-health` BullMQ queue pings each registered endpoint every N seconds (configurable per plan). Results update `Node.status` and publish `node.metrics` events.
- **Metrics**: nodes POST metrics to `POST /nodes/:id/metrics` (authenticated with a node token). Recent values cached in Redis (sliding window), aggregates persisted hourly in `NodeMetric`.
- **Commands**: `restart` / `pause` are dispatched to the node runtime via signed webhooks to the node's `controlUrl`.

---

## 6. Chat pipeline

```
Client ──send──▶ /chat (REST or WS) ──▶ ChatService
                                              │
                                              ├─ load agent + memory
                                              ├─ apply quota check
                                              ├─ resolve provider
                                              ├─ stream tokens  ──▶ Socket.IO room
                                              ├─ persist message + token usage
                                              └─ publish metered usage event
```

- Token streaming uses incremental persistence (debounced flush every ~150ms) so reloads recover partial messages.
- Tool use follows the Anthropic/OpenAI function-calling contract; tools are registered per-agent.
- Memory: short-term (last N messages), long-term (vector store keyed by `agentId`).

---

## 7. Security

- Passwords: argon2id.
- API keys: stored only as hashes (`sha256`), last 4 chars shown for recognition.
- JWT: short access (15m) + rotating refresh (30d) stored httpOnly + `sameSite=lax`.
- CSRF: double-submit cookie for cookie-authed routes; bearer-only for API.
- Tenant isolation: a global Prisma middleware rejects queries without a `tenantId` filter on tenant-scoped models.
- Audit log: every sensitive mutation (`agent.updated`, `node.deleted`, `apikey.created`) persisted to `AuditEvent`.

---

## 8. Scalability

- Stateless API containers behind a load balancer; sticky sessions only for WebSockets (or Redis adapter for Socket.IO).
- Workers scale independently per queue.
- Postgres read-replicas for analytics views.
- Caching: provider model list, agent config, plan quotas (Redis, short TTL, invalidated on writes).
- Per-tenant rate limits prevent noisy-neighbor issues.

---

## 9. Deployment topology

```
[ Vercel / Cloud Run ] ── apps/web
[ Cloud Run / ECS    ] ── apps/api (autoscaled, 2..N)
[ Cloud Run / ECS    ] ── worker (autoscaled per queue depth)
[ RDS / Supabase     ] ── PostgreSQL 16
[ Upstash / Elasti.  ] ── Redis 7
[ Cloudflare R2 / S3 ] ── uploads
[ Stripe             ] ── billing
```

CI/CD via GitHub Actions: lint → typecheck → test → build → deploy (staging → prod on tag).
