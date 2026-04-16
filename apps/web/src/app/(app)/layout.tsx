import Link from "next/link";
import {
  LayoutDashboard,
  Server,
  Bot,
  MessagesSquare,
  KeyRound,
  CreditCard,
  Users,
  Settings,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/nodes", label: "Nodes", icon: Server },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/chat", label: "Chat", icon: MessagesSquare },
  { href: "/api-keys", label: "API Keys", icon: KeyRound },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr]">
      <aside className="border-r border-border bg-bg-subtle/60 backdrop-blur">
        <div className="flex h-16 items-center px-5 text-sm font-semibold tracking-tight">
          ◎ AI Node Control
        </div>
        <nav className="px-3 py-2">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-fg-muted transition hover:bg-bg-card hover:text-fg"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex min-h-screen flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border px-6">
          <input
            placeholder="⌘K  Search nodes, agents, conversations…"
            className="w-96 rounded-lg border border-border bg-bg-card px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-accent-via/60"
          />
          <div className="flex items-center gap-3 text-sm">
            <span className="rounded-md border border-border px-2 py-1 text-fg-muted">
              Acme
            </span>
            <div className="h-8 w-8 rounded-full bg-accent-gradient" />
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
