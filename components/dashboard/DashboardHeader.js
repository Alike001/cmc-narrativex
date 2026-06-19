import Link from "next/link";

export default function DashboardHeader() {
  return (
    <header className="border-b border-white/5 bg-ink-900/80 backdrop-blur">
      <div className="container-shell flex items-center justify-between py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-500/15 ring-1 ring-signal-500/30">
            <span className="h-2.5 w-2.5 rounded-full bg-signal-400" />
          </span>
          <span className="font-display text-[15px] font-semibold tracking-tight text-mist-100">
            CMC NarrativeX
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <span className="hidden items-center gap-1.5 font-mono text-[11px] text-pulse-400 sm:flex">
            <span className="h-1.5 w-1.5 animate-pulseLine rounded-full bg-pulse-500" />
            Mock API · MCP ready
          </span>
          <Link
            href="/"
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-mist-300 transition hover:border-white/20 hover:text-mist-100"
          >
            ← Back to site
          </Link>
        </div>
      </div>
    </header>
  );
}
