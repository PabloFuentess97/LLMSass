import { GlassCard, StatusDot } from "@ai-node/ui";

const agents = [
  {
    id: "ag_1",
    name: "Sales Copilot",
    role: "sales",
    model: "anthropic:claude-sonnet-4-6",
    node: "gpu-eu-01",
    temperature: 0.4,
    tools: ["web.search", "crm.lookup"],
    status: "ACTIVE" as const,
    convsToday: 48,
    tokensToday: 812_000,
  },
  {
    id: "ag_2",
    name: "Dev Helper",
    role: "programming",
    model: "openai:gpt-4.1",
    node: "gpu-eu-01",
    temperature: 0.2,
    tools: ["code.run", "git.diff"],
    status: "ACTIVE" as const,
    convsToday: 12,
    tokensToday: 204_000,
  },
  {
    id: "ag_3",
    name: "Support Agent",
    role: "support",
    model: "anthropic:claude-haiku-4-5",
    node: "cpu-us-01",
    temperature: 0.5,
    tools: ["zendesk.search"],
    status: "INACTIVE" as const,
    convsToday: 0,
    tokensToday: 0,
  },
];

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agents</h1>
          <p className="text-sm text-fg-muted">Configure roles, prompts, tools and limits.</p>
        </div>
        <button className="rounded-xl bg-accent-gradient px-4 py-2 text-sm font-medium text-white shadow-glass">
          + New agent
        </button>
      </header>

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        {agents.map((a) => (
          <GlassCard key={a.id} title={a.name} right={<StatusDot status={a.status} />}>
            <div className="grid grid-cols-2 gap-2 text-xs text-fg-muted">
              <span>Role · {a.role}</span>
              <span>Model · {a.model}</span>
              <span>Node · {a.node}</span>
              <span>Temp · {a.temperature}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1 text-xs">
              {a.tools.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-border bg-bg-subtle/60 px-2 py-0.5 font-mono"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-4 text-xs text-fg-muted">
              Today · {a.convsToday} convs · {a.tokensToday.toLocaleString()} tokens
            </div>
            <div className="mt-4 flex gap-2">
              <button className="rounded-lg border border-border px-3 py-1 text-xs">
                Edit
              </button>
              <button className="rounded-lg border border-border px-3 py-1 text-xs">
                {a.status === "ACTIVE" ? "Pause" : "Activate"}
              </button>
            </div>
          </GlassCard>
        ))}
      </section>
    </div>
  );
}
