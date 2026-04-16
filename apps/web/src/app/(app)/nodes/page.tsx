import { GlassCard, StatusDot, ResourceBar } from "@ai-node/ui";

const nodes = [
  {
    id: "nd_1",
    name: "gpu-eu-01",
    status: "ACTIVE" as const,
    tags: ["production", "eu"],
    cpu: 62,
    ram: 48,
    gpu: 81,
    latency: 98,
    tokens: 48300,
    agents: ["Sales Copilot", "Dev Helper"],
  },
  {
    id: "nd_2",
    name: "cpu-us-01",
    status: "BUSY" as const,
    tags: ["production", "us"],
    cpu: 91,
    ram: 70,
    gpu: null,
    latency: 142,
    tokens: 21800,
    agents: ["Support Agent"],
  },
  {
    id: "nd_3",
    name: "local-dev",
    status: "PAUSED" as const,
    tags: ["dev"],
    cpu: 0,
    ram: 0,
    gpu: null,
    latency: 0,
    tokens: 0,
    agents: [],
  },
];

export default function NodesPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Nodes</h1>
          <p className="text-sm text-fg-muted">Compute endpoints available to your agents.</p>
        </div>
        <button className="rounded-xl bg-accent-gradient px-4 py-2 text-sm font-medium text-white shadow-glass">
          + Add node
        </button>
      </header>

      <div className="flex gap-2 text-sm">
        <select className="rounded-lg border border-border bg-bg-card px-3 py-2">
          <option>All statuses</option>
          <option>Active</option>
          <option>Busy</option>
          <option>Paused</option>
        </select>
        <input
          placeholder="Search nodes…"
          className="flex-1 rounded-lg border border-border bg-bg-card px-3 py-2"
        />
      </div>

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        {nodes.map((n) => (
          <GlassCard key={n.id} title={n.name} right={<StatusDot status={n.status} />}>
            <div className="flex flex-wrap gap-1 text-xs text-fg-muted">
              {n.tags.map((t) => (
                <span key={t} className="rounded-md border border-border px-2 py-0.5">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <ResourceBar label="CPU" value={n.cpu} />
              <ResourceBar label="RAM" value={n.ram} />
              {n.gpu !== null && <ResourceBar label="GPU" value={n.gpu} />}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-fg-muted">
              <span>Latency · {n.latency} ms</span>
              <span>Tokens · {n.tokens.toLocaleString()}</span>
            </div>
            {n.agents.length > 0 && (
              <div className="mt-3 text-xs text-fg-muted">
                Assigned: {n.agents.join(", ")}
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <button className="rounded-lg border border-border px-3 py-1 text-xs">
                Restart
              </button>
              <button className="rounded-lg border border-border px-3 py-1 text-xs">
                Pause
              </button>
            </div>
          </GlassCard>
        ))}
      </section>
    </div>
  );
}
