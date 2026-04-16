export function StatPill({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend?: string;
}) {
  const up = trend?.startsWith("+");
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-xs uppercase tracking-wide text-fg-muted">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
      {trend && (
        <div
          className={
            "mt-1 text-xs " + (up ? "text-status-active" : "text-fg-muted")
          }
        >
          {trend}
        </div>
      )}
    </div>
  );
}
