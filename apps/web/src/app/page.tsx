import Link from "next/link";

export default function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-50 [background:radial-gradient(60%_60%_at_50%_10%,hsl(275_75%_62%/0.25),transparent)]" />
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-lg font-semibold tracking-tight">◎ AI Node Control</span>
        <nav className="flex items-center gap-4 text-sm text-fg-muted">
          <Link href="/login">Sign in</Link>
          <Link
            href="/register"
            className="rounded-lg bg-accent-gradient px-4 py-2 font-medium text-white shadow-glass"
          >
            Get started
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-28 text-center">
        <h1 className="bg-accent-gradient bg-clip-text text-6xl font-semibold tracking-tight text-transparent">
          Control every AI node.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-fg-muted">
          Register compute nodes, configure agents, and run streaming conversations — all from
          a single premium control plane built for teams.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-xl bg-accent-gradient px-6 py-3 font-medium text-white shadow-glass"
          >
            Open dashboard →
          </Link>
          <Link
            href="/chat"
            className="rounded-xl border border-border px-6 py-3 font-medium glass"
          >
            Try the chat
          </Link>
        </div>
      </section>
    </main>
  );
}
