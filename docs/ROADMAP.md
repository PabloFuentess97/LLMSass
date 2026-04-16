# Roadmap — delivery phases

Ten-week plan to reach a commercial-ready v1. Each phase ends with a green CI, a staging deploy, and a short demo.

## Phase 0 — Foundations (week 1)
- Monorepo bootstrap (Turborepo, pnpm, shared tsconfig, eslint, prettier).
- Docker Compose: Postgres 16, Redis 7.
- Prisma schema v1 + initial migration.
- GitHub Actions: lint + typecheck + test on PR.
- Sentry + pino logging wired on API.
- **Exit criteria**: `pnpm dev` boots web + api + db locally; Swagger reachable.

## Phase 1 — Identity & multi-tenant (week 2)
- Auth: register / login / refresh / logout, argon2id.
- Tenants + memberships + roles (OWNER / ADMIN / MEMBER).
- API keys (hashed) with scopes.
- Tenant-scoping Prisma middleware + test coverage.
- Premium login, register, onboarding screens.
- **Exit criteria**: a user can sign up, create a tenant, invite a teammate, create an API key.

## Phase 2 — Nodes module (weeks 3-4)
- `Node` CRUD API + tags + capacity.
- Health-check worker (BullMQ) + metrics push endpoint.
- Redis live metrics cache + hourly rollup to `NodeMetric`.
- Realtime gateway (Socket.IO) — node status + metrics events.
- UI: Nodes grid + table views, filters, add/edit modal, restart/pause actions.
- **Exit criteria**: nodes list auto-updates live; a paused node stops receiving assignments.

## Phase 3 — Agents module (week 5)
- `Agent` CRUD + versioning (`AgentVersion`).
- Provider adapter (OpenAI + Anthropic + local/Ollama).
- Agent ↔ node assignment + limits enforcement.
- UI: agents grid, tabbed create/edit modal, playground tab.
- **Exit criteria**: an admin can create a production-ready agent bound to a node and run a test prompt.

## Phase 4 — Chat (weeks 6-7)
- `Conversation` + `Message` models, streaming via SSE + Socket.IO.
- Tool use contract (function calling) with allowlisted tools per agent.
- Attachments via S3-compatible storage.
- UI: ChatGPT-style layout, markdown + shiki, quick actions, conversation history.
- Short-term memory + optional long-term vector memory (pgvector).
- **Exit criteria**: end-to-end streamed conversation with tool use + file attachment.

## Phase 5 — Public API & webhooks (week 8)
- Stable `/v1` namespace + OpenAPI spec generated from decorators.
- Rate limiting per plan / per key (Redis).
- Webhooks (signed, retried, dashboard for delivery logs).
- Docs site (Nextra) with curl + TS examples per endpoint.
- **Exit criteria**: third-party SaaS can register, generate a key, call the API, and receive a webhook.

## Phase 6 — Billing & quotas (week 9)
- Stripe products + checkout + portal.
- Plans (Free / Pro / Enterprise) with per-plan quotas.
- `UsageEvent` metering (tokens / requests / node-hours).
- Quota enforcement middleware + warning thresholds (webhook + in-app banner).
- UI: billing page, invoices, usage charts.
- **Exit criteria**: a paid plan upgrade flips quotas in real time.

## Phase 7 — Polish, admin, and launch (week 10)
- Admin dashboard: global usage, incidents, feature flags.
- ⌘K command palette, keyboard shortcuts, accessibility audit (axe).
- Load test target: 500 concurrent chat streams, p95 < 400ms to first token.
- Playwright E2E smoke tests on staging.
- Public landing page + pricing page.
- **Exit criteria**: launch-ready; a paying customer can self-serve from landing → chat in under 5 minutes.

---

## Post-v1 backlog (prioritized)

1. **Marketplace of tools** — reusable tool packs (web search, SQL, Jira, etc.) installable per agent.
2. **Fine-tuning / distillation jobs** on user nodes.
3. **Multi-agent orchestration** (graphs, handoffs, parallel fan-out).
4. **On-prem deployment** (Helm chart + air-gapped license).
5. **Audit log exports** (SIEM-friendly CSV / Splunk HEC).
6. **SSO** (SAML + OIDC) for Enterprise.
7. **Mobile apps** (React Native) for chat and alerts.
