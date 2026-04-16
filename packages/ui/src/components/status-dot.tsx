import { cn } from "../lib/cn";

type Status = "ACTIVE" | "BUSY" | "PAUSED" | "INACTIVE" | "ERROR";

const map: Record<Status, { color: string; label: string; pulse: boolean }> = {
  ACTIVE: { color: "bg-status-active", label: "Active", pulse: true },
  BUSY: { color: "bg-status-busy", label: "Busy", pulse: true },
  PAUSED: { color: "bg-status-paused", label: "Paused", pulse: false },
  INACTIVE: { color: "bg-status-inactive", label: "Inactive", pulse: false },
  ERROR: { color: "bg-status-error", label: "Error", pulse: true },
};

export function StatusDot({ status }: { status: Status }) {
  const s = map[status];
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border px-2 py-0.5 text-xs">
      <span className="relative inline-flex h-2 w-2">
        {s.pulse && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
              s.color,
            )}
          />
        )}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", s.color)} />
      </span>
      {s.label}
    </span>
  );
}
