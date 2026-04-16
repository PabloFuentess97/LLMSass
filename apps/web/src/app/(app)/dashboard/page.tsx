import { GlassCard, StatPill } from "@ai-node/ui";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-fg-muted">Live activity across your AI infrastructure.</p>
        </div>
      </header>

      <section className="grid grid-cols-4 gap-4">
        <StatPill label="Nodes" value="12 / 20" trend="+2" />
        <StatPill label="Agents" value="7 active" trend="+1" />
        <StatPill label="Tokens today" value="1.2M" trend="+12%" />
        <StatPill label="P50 latency" value="142 ms" trend="-8 ms" />
      </section>

      <section className="grid grid-cols-2 gap-4">
        <GlassCard title="Tokens · last 7 days">
          <div className="h-56 rounded-lg border border-dashed border-border/60 bg-bg-subtle/40" />
        </GlassCard>
        <GlassCard title="Node status">
          <div className="h-56 rounded-lg border border-dashed border-border/60 bg-bg-subtle/40" />
        </GlassCard>
      </section>

      <GlassCard title="Live feed">
        <ul className="divide-y divide-border text-sm">
          <li className="flex justify-between py-2">
            <span>agent "Sales Copilot" completed conversation</span>
            <span className="text-fg-muted">14:22</span>
          </li>
          <li className="flex justify-between py-2">
            <span>node "gpu-eu-01" CPU 82% · auto-scaled</span>
            <span className="text-fg-muted">14:21</span>
          </li>
          <li className="flex justify-between py-2">
            <span>webhook delivered → hubspot.com</span>
            <span className="text-fg-muted">14:20</span>
          </li>
        </ul>
      </GlassCard>
    </div>
  );
}
