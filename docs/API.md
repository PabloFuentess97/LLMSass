# Public REST API

Base URL: `https://api.ai-node-control.app/v1`
Swagger UI: `/docs` · OpenAPI JSON: `/docs-json`

## Authentication

Two mechanisms, mutually exclusive per request:

| Method | Header | Usage |
|---|---|---|
| **JWT** (user sessions) | `Authorization: Bearer <access_token>` | First-party web app |
| **API Key** (server-to-server) | `X-API-Key: sk_live_…` | External SaaS integrations |

All endpoints are tenant-scoped by the authenticated principal; cross-tenant access returns `404`.

### Auth endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Create tenant + owner account |
| POST | `/auth/login` | Exchange credentials for access + refresh |
| POST | `/auth/refresh` | Rotate tokens |
| POST | `/auth/logout` | Invalidate refresh token |
| GET  | `/auth/me` | Current user + tenant |
| POST | `/auth/api-keys` | Create API key (returns plaintext once) |
| GET  | `/auth/api-keys` | List keys (hash prefixes only) |
| DELETE | `/auth/api-keys/:id` | Revoke key |

### Nodes

| Method | Path | Description |
|---|---|---|
| POST   | `/nodes` | Register a node |
| GET    | `/nodes` | List (filters: `status`, `tag`, `q`) |
| GET    | `/nodes/:id` | Detail + last metrics |
| PUT    | `/nodes/:id` | Update name / endpoint / tags |
| DELETE | `/nodes/:id` | Remove node |
| POST   | `/nodes/:id/restart` | Send restart command |
| POST   | `/nodes/:id/pause` | Pause scheduling |
| POST   | `/nodes/:id/resume` | Resume scheduling |
| POST   | `/nodes/:id/metrics` | Node-authenticated metric push |
| GET    | `/nodes/:id/metrics` | Time-series metrics (range, step) |

Example `POST /nodes`:

```json
{
  "name": "gpu-eu-01",
  "endpoint": "https://gpu-eu-01.example.com",
  "controlUrl": "https://gpu-eu-01.example.com/control",
  "capacity": { "cpu": 32, "ramGb": 128, "gpu": "A100x2" },
  "tags": ["production", "eu"]
}
```

### Agents

| Method | Path | Description |
|---|---|---|
| POST   | `/agents` | Create agent |
| GET    | `/agents` | List (filters: `status`, `role`, `nodeId`) |
| GET    | `/agents/:id` | Detail |
| PUT    | `/agents/:id` | Update config |
| DELETE | `/agents/:id` | Delete |
| POST   | `/agents/:id/activate` | Enable |
| POST   | `/agents/:id/deactivate` | Disable |
| POST   | `/agents/:id/assign-node` | Assign/reassign a node |

Agent body:

```json
{
  "name": "Sales Copilot",
  "role": "sales",
  "systemPrompt": "You are a B2B sales assistant…",
  "model": "anthropic:claude-sonnet-4-6",
  "nodeId": "nd_01HXYZ…",
  "temperature": 0.4,
  "tools": ["web.search", "crm.lookup"],
  "memory": { "type": "vector", "topK": 8 },
  "limits": { "maxTokensPerDay": 200000, "maxRequestsPerMin": 30 }
}
```

### Chat

| Method | Path | Description |
|---|---|---|
| POST | `/chat` | Single-turn or resume turn (supports `stream=true` → SSE) |
| GET  | `/conversations` | List conversations |
| POST | `/conversations` | Create conversation |
| GET  | `/conversations/:id` | Messages |
| DELETE | `/conversations/:id` | Remove conversation |
| POST | `/conversations/:id/messages` | Append user message and stream reply |

`POST /chat` request:

```json
{
  "agentId": "ag_01…",
  "conversationId": "cv_01…",
  "message": "Resume the last Q3 analysis.",
  "attachments": ["att_01…"],
  "stream": true
}
```

SSE stream (`text/event-stream`):

```
event: token
data: {"delta":"Hello"}

event: tool_call
data: {"name":"web.search","args":{…}}

event: done
data: {"usage":{"inputTokens":432,"outputTokens":821}}
```

### Webhooks

Outbound events a tenant can subscribe to:

| Event | Payload |
|---|---|
| `node.status_changed` | `{ nodeId, from, to, at }` |
| `agent.updated` | `{ agentId, changes }` |
| `conversation.completed` | `{ conversationId, usage }` |
| `billing.quota_warning` | `{ metric, used, limit, period }` |

Webhooks are signed with `X-Signature: t=…, v1=…` (HMAC-SHA256).

### Rate limits

Global default (overridable per plan):

- REST: 600 req / 5min / principal
- Chat streaming: 30 concurrent streams / tenant
- Webhook deliveries: retried with exponential backoff up to 24h

### Errors

Standard envelope:

```json
{
  "error": {
    "code": "agent_not_found",
    "message": "Agent ag_01… does not exist.",
    "requestId": "req_01…"
  }
}
```

Documented codes: `unauthorized`, `forbidden`, `not_found`, `validation_error`, `quota_exceeded`, `rate_limited`, `provider_unavailable`, `internal_error`.

### Pagination

All list endpoints use cursor pagination: `?cursor=…&limit=50` → `{ data, nextCursor }`.
