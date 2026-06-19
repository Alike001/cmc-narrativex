import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="container-shell flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-signal-500/15 ring-1 ring-signal-500/30">
            <span className="h-2 w-2 rounded-full bg-signal-400" />
          </span>
          <span className="font-display text-sm font-semibold text-mist-100">
            CMC NarrativeX Agent
          </span>
        </div>
        <p className="text-center text-xs text-mist-700 sm:text-left">
          Informational only — not financial advice. © {new Date().getFullYear()} CMC
          NarrativeX Agent.
        </p>
        <Link href="/dashboard" className="text-xs text-mist-500 transition hover:text-mist-100">
          Open dashboard →
        </Link>
      </div>
    </footer>
  );
}
