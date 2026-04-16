# UI Wireframes — premium SaaS

Visual direction: dark by default · glassmorphism cards · 1px hairline borders `rgba(255,255,255,0.06)` · gradient accents (indigo → violet → fuchsia) · Inter + JetBrains Mono · radix motion for micro-interactions.

---

## Global shell

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ◎ AI Node Control      ⌘K search            🔔   ◐ theme   ●Acme ▾   avatar │
├─────────────┬──────────────────────────────────────────────────────────────┤
│ Dashboard   │                                                              │
│ Nodes       │                  main content area (RSC)                     │
│ Agents      │                                                              │
│ Chat        │                                                              │
│ API Keys    │                                                              │
│ Billing     │                                                              │
│ Team        │                                                              │
│ Settings    │                                                              │
│─────────────│                                                              │
│ ⓘ Status ●  │                                                              │
└─────────────┴──────────────────────────────────────────────────────────────┘
```

---

## 1. Dashboard

```
┌─────────────── Overview ──────────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐              │
│  │ Nodes    │  │ Agents   │  │ Tokens   │  │ P50 latency  │   glass KPI  │
│  │ 12 / 20  │  │ 7 active │  │ 1.2M/day │  │ 142 ms       │   cards      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘              │
│                                                                           │
│  ┌──── Tokens last 7d ────────────┐  ┌──── Node status ─────────────────┐│
│  │     gradient area chart         │  │   donut · ACTIVE 8 · BUSY 3     ││
│  │                                 │  │            PAUSED 1             ││
│  └─────────────────────────────────┘  └──────────────────────────────────┘│
│                                                                           │
│  ┌──── Live feed ────────────────────────────────────────────────────┐    │
│  │ 14:22  agent "Sales Copilot" completed conv · 812 out tokens      │    │
│  │ 14:21  node "gpu-eu-01" CPU 82% · auto-scaled                     │    │
│  │ 14:20  webhook delivered → hubspot.com                            │    │
│  └───────────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Nodes — grid view

```
[ Filters: status ▾  tag ▾  region ▾   q: ______ ]    [ + Add node ]   [⇅ Table]

┌──────────────────────── gpu-eu-01 ──────────────────────────┐
│ ●ACTIVE        tags: production · eu                       │
│ CPU  ▓▓▓▓▓▓░░ 62%     RAM ▓▓▓▓░░░░ 48%                     │
│ GPU  ▓▓▓▓▓▓▓░ 81%     Latency 98ms  Tokens 48.3k           │
│ Assigned: Sales Copilot, Dev Helper                        │
│ [ Restart ] [ Pause ] [ … ]                                │
└────────────────────────────────────────────────────────────┘
┌──────────────────────── cpu-us-01 ──────────────────────────┐
│ ●BUSY                                                      │
│ …                                                          │
└────────────────────────────────────────────────────────────┘
```

### Nodes — table view

```
┌──────┬──────────────┬────────┬────────┬──────┬──────┬────────┬────────┐
│      │ Name         │ Status │ Endpoint…   │ CPU  │ RAM  │ GPU  │ Tags │
├──────┼──────────────┼────────┼─────────────┼──────┼──────┼──────┼──────┤
│ ●    │ gpu-eu-01    │ ACTIVE │ https://…   │ 62%  │ 48%  │ 81%  │ prod │
│ ●    │ cpu-us-01    │ BUSY   │ https://…   │ 91%  │ 70%  │  —   │ prod │
└──────┴──────────────┴────────┴─────────────┴──────┴──────┴──────┴──────┘
```

### Add / Edit node modal (premium)

```
 ┌─ Add node ────────────────────────────────────────────── ✕ ┐
 │  Name          ▢ gpu-eu-01                                │
 │  Endpoint URL  ▢ https://…                                │
 │  Control URL   ▢ https://…/control                        │
 │  Capacity      CPU [32]  RAM [128GB]  GPU [A100x2]        │
 │  Tags          [production] [eu] [+]                      │
 │                                                           │
 │  ┌─ Health check ────────────────────────────────────┐    │
 │  │ Interval 30s   Timeout 5s   Retries 3             │    │
 │  └───────────────────────────────────────────────────┘    │
 │                                                           │
 │                          [ Cancel ]   [ Create node →]    │
 └───────────────────────────────────────────────────────────┘
```

---

## 3. Agents

```
[ Search _____  Role ▾  Status ▾ ]                     [ + New agent ]

┌─ Sales Copilot ─────────────────────────────┐  ┌─ Dev Helper ─────────────┐
│ Role · sales       Model · claude-sonnet-4-6│  │ Role · programming       │
│ Node · gpu-eu-01   Temp · 0.4               │  │ Model · gpt-4.1          │
│ Tools: web.search, crm.lookup               │  │ Tools: code.run, git.diff│
│ Today: 48 convs · 812k tokens               │  │ Today: 12 convs          │
│                ●ACTIVE   [Edit] [Pause] [⋯] │  │                          │
└─────────────────────────────────────────────┘  └──────────────────────────┘
```

### Create/Edit agent modal (tabbed)

```
 ┌─ New agent ─────────────────────────────────────────────── ✕ ┐
 │ ▸ Basics   Prompt   Model   Tools   Limits   Memory          │
 │ ────────────────────────────────────────────────────────     │
 │  Name      ▢ Sales Copilot                                   │
 │  Role      ▢ sales ▾                                         │
 │  Node      ▢ gpu-eu-01 ▾                                     │
 │  Status    ●Active                                           │
 │                                                              │
 │  ↳ System prompt (markdown)                                  │
 │   ┌────────────────────────────────────────────────────┐     │
 │   │ You are a B2B sales assistant…                     │     │
 │   └────────────────────────────────────────────────────┘     │
 │                                                              │
 │                           [ Cancel ]  [ Save agent → ]       │
 └──────────────────────────────────────────────────────────────┘
```

---

## 4. Chat (ChatGPT + Notion vibe)

```
┌───────────────┬────────────────────────────────────────────────────────┐
│ + New chat    │  Sales Copilot  ·  claude-sonnet-4-6  ·  temp 0.4  ⚙  │
│───────────────│───────────────────────────────────────────────────────│
│ Today         │                                                        │
│ ▸ Q3 recap    │    ╭─ user ─────────────────────────────────╮          │
│   Lead review │    │ Resume the last Q3 analysis.           │          │
│               │    ╰────────────────────────────────────────╯          │
│ Yesterday     │                                                        │
│ ▸ Deal notes  │    ╭─ assistant (streaming…) ───────────────╮          │
│               │    │ Sure — here are the highlights:        │          │
│ Older         │    │                                        │          │
│ ▸ Onboarding  │    │ ```ts                                  │          │
│               │    │ const growth = …                       │          │
│               │    │ ```                                    │          │
│               │    ╰────────────────────────────────────────╯          │
│               │                                                        │
│               │  ┌─────────────────────────────────────────────────┐  │
│               │  │ 📎  Message Sales Copilot…             ⌘↵ send  │  │
│               │  └─────────────────────────────────────────────────┘  │
│               │  Quick:  ⎔ summarize · ⎔ action items · ⎔ translate  │
└───────────────┴────────────────────────────────────────────────────────┘
```

Details:

- Streaming cursor animated via `motion.span`.
- Code blocks: shiki server-side highlighting + copy button.
- Markdown: `react-markdown` + `remark-gfm`.
- Attachments: drag-and-drop anywhere on chat pane; preview thumbnails above composer.

---

## 5. Billing

```
┌─ Current plan ─────────────────────────────────────────────┐
│ Pro · $99/month · renews May 14                            │
│ Seats 5/10 · Agents 7/25 · Nodes 12/20 · Tokens 1.2M/5M    │
│                                       [ Manage · Upgrade ] │
└────────────────────────────────────────────────────────────┘

┌─ Usage this period ──────────────┐  ┌─ Invoices ───────────┐
│ stacked bars by metric            │  │ 2026-03  $99  Paid   │
│                                   │  │ 2026-02  $99  Paid   │
└──────────────────────────────────┘  └──────────────────────┘
```

---

## 6. API keys

```
[ + Create key ]

┌─ Name ────────────┬─ Prefix ──┬─ Scopes ──────────┬─ Last used ─┬────────┐
│ Hubspot sync      │ sk_live_… │ read:chat,write:  │ 2m ago      │ ⋯      │
│ Internal worker   │ sk_live_… │ *                 │ 14m ago     │ ⋯      │
└───────────────────┴───────────┴───────────────────┴─────────────┴────────┘
```

Key-creation modal shows the plaintext **once** with a copy button and a permanent warning banner.

---

## Component library (packages/ui)

- `<GlassCard>` — glassmorphism container with gradient ring on hover.
- `<StatPill>` — KPI tile with trend.
- `<StatusDot status="ACTIVE | BUSY | PAUSED | INACTIVE | ERROR">` — animated pulse.
- `<ResourceBar label cpu ram gpu />`
- `<DataTable>` — TanStack Table wrapper with column visibility + CSV export.
- `<Modal>`, `<Drawer>`, `<CommandPalette>` (⌘K), `<Toast>`, `<Skeleton>`.
- `<ChatBubble role="user|assistant">`, `<Composer>`, `<StreamingCursor>`.
- `<ChartArea>`, `<ChartDonut>`, `<ChartBar>` — Recharts with dark premium preset.
