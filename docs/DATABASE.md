# Database schema

PostgreSQL 16 via Prisma. All primary keys are ULID-like `cuid2` strings prefixed by type for readability in logs (`ag_…`, `nd_…`, `cv_…`). Every tenant-scoped model includes `tenantId` and is indexed `@@index([tenantId, …])`.

## ER diagram (logical)

```
Tenant 1──* Membership *──1 User
Tenant 1──* ApiKey
Tenant 1──* Node
Tenant 1──* Agent ──? Node                (agent may be assigned to a node)
Tenant 1──* Conversation *──1 Agent
Conversation 1──* Message
Message 1──* Attachment
Tenant 1──1 Subscription ──1 Plan
Tenant 1──* UsageEvent
Tenant 1──* Webhook
Tenant 1──* AuditEvent
Node 1──* NodeMetric
```

## Core tables (see `prisma/schema.prisma` for the full source of truth)

### Identity

- `User(id, email unique, passwordHash, name, avatarUrl, createdAt)`
- `Tenant(id, name, slug unique, createdAt)`
- `Membership(id, tenantId, userId, role[OWNER|ADMIN|MEMBER], createdAt)` — unique `(tenantId, userId)`
- `ApiKey(id, tenantId, userId, name, hash unique, lastFour, scopes[], lastUsedAt, revokedAt)`
- `Session(id, userId, refreshTokenHash, userAgent, ip, expiresAt)`

### Billing

- `Plan(id, code unique, name, priceCents, interval, limits jsonb)`
- `Subscription(id, tenantId unique, planId, status, currentPeriodEnd, stripeCustomerId, stripeSubId)`
- `UsageEvent(id, tenantId, metric[tokens|requests|nodeHours], value, agentId?, nodeId?, occurredAt)` — partitioned monthly

### Infrastructure

- `Node(id, tenantId, name, endpoint, controlUrl?, status[REGISTERED|ACTIVE|BUSY|PAUSED|INACTIVE|ERROR], capacity jsonb, tags string[], lastSeenAt, createdAt, updatedAt)`
- `NodeMetric(id, nodeId, cpuPct, ramPct, gpuPct?, latencyMs, tokensProcessed, at)` — hypertable candidate (TimescaleDB) or hourly rollup

### Agents

- `Agent(id, tenantId, name, role, systemPrompt, model, nodeId?, temperature float, tools string[], memory jsonb, limits jsonb, status[ACTIVE|INACTIVE], createdAt, updatedAt)`
- `AgentVersion(id, agentId, config jsonb, createdBy, createdAt)` — immutable history

### Conversations

- `Conversation(id, tenantId, agentId, title, createdBy, updatedAt)`
- `Message(id, conversationId, role[SYSTEM|USER|ASSISTANT|TOOL], content text, tokensIn int, tokensOut int, toolCall jsonb?, createdAt)`
- `Attachment(id, messageId, kind[IMAGE|FILE], url, sizeBytes, mime)`

### Integrations

- `Webhook(id, tenantId, url, events string[], secret, active, lastDeliveryAt)`
- `WebhookDelivery(id, webhookId, event, payload jsonb, status, attempts, nextAttemptAt, responseCode, responseBody)`

### Governance

- `AuditEvent(id, tenantId, actorId, action, resourceType, resourceId, metadata jsonb, at)`

## Indexing highlights

- `Node`: `(tenantId, status)`, `(tenantId, tags)` with GIN.
- `NodeMetric`: BRIN on `at` + btree on `(nodeId, at DESC)`.
- `Message`: `(conversationId, createdAt)`.
- `UsageEvent`: `(tenantId, metric, occurredAt)` + monthly partitions.
- `ApiKey.hash`: unique btree, lookup is O(1) on each request.

## Seed data (dev)

- 1 tenant `Acme`, 1 owner, 1 member.
- 3 nodes (`gpu-eu-01`, `cpu-us-01`, `local-dev`).
- 5 agents with distinct roles (marketing, dev, support, sales, analyst).
- 1 demo conversation per agent.
- Free / Pro / Enterprise plans.
