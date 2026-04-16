import { cn } from "../lib/cn";

export function GlassCard({
  title,
  right,
  className,
  children,
}: {
  title?: string;
  right?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-5 transition hover:border-accent-via/30",
        className,
      )}
    >
      {(title || right) && (
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h3 className="text-sm font-medium tracking-tight text-fg">{title}</h3>
          )}
          {right}
        </div>
      )}
      {children}
    </div>
  );
}
