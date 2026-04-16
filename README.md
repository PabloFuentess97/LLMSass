# AI Node Control SaaS

Premium SaaS platform for controlling and administering AI nodes and agents, with a ChatGPT-style chat, real-time node monitoring, multi-tenant billing, and a public REST API for third-party SaaS integrations.

> Visual inspiration: Stripe · OpenAI · Vercel · Linear · Notion.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui (Pro Max) · Framer Motion · TanStack Query · Zustand · Socket.IO client |
| Backend | NestJS · TypeScript · Prisma · PostgreSQL · Redis · BullMQ · Socket.IO · Swagger/OpenAPI |
| AI Layer | Provider-agnostic adapter (OpenAI, Anthropic, local/Ollama) · streaming (SSE) · tool use |
| Auth | JWT (access + refresh) · API keys (hashed) · RBAC (admin/user/team) |
| Billing | Stripe (subscriptions, metered usage, webhooks) |
| Infra | Docker Compose (dev) · Turborepo · GitHub Actions · horizontal-scale-ready |

---

## Monorepo layout

```
.
├── apps/
│   ├── web/                 # Next.js 14 frontend (App Router)
│   └── api/                 # NestJS backend + Prisma
├── packages/
│   ├── ui/                  # Shared design system (shadcn + Pro Max primitives)
│   ├── types/               # Shared TS contracts (DTOs, enums)
│   └── config/              # Shared tsconfig / eslint / tailwind presets
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DATABASE.md
│   ├── WIREFRAMES.md
│   └── ROADMAP.md
├── prisma/
│   └── schema.prisma
├── docker-compose.yml
├── turbo.json
└── package.json
```

---

## Quick start (dev)

```bash
pnpm install
cp .env.example .env
docker compose up -d postgres redis
pnpm --filter api prisma migrate dev
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:4000
- Swagger: http://localhost:4000/docs

---

## Modules

1. **Nodes** — register, edit, delete, restart, pause AI compute nodes; live metrics (CPU / RAM / GPU / latency / tokens) over WebSockets.
2. **Agents** — create and configure AI agents (role, prompt, model, tools, memory, temperature, assigned node, limits).
3. **Chat** — ChatGPT-style UI with streaming, conversation history, agent/model selector, file uploads, markdown + code.
4. **API** — REST + Swagger for third-party SaaS integration (auth, nodes, agents, chat, webhooks).
5. **Billing & multi-tenant** — plans, quotas, team roles, Stripe integration.
6. **Admin** — platform operators dashboard (users, usage, incidents).

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for full details.
