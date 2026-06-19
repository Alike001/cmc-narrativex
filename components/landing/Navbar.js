import Link from "next/link";

export default function Navbar() {
  return (
    <header className="container-shell flex items-center justify-between py-6">
      <Link href="/" className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-500/15 ring-1 ring-signal-500/30">
          <span className="h-2.5 w-2.5 rounded-full bg-signal-400" />
        </span>
        <span className="font-display text-[15px] font-semibold tracking-tight text-mist-100">
          CMC NarrativeX Agent
        </span>
      </Link>

      <nav className="hidden items-center gap-8 md:flex">
        <a href="#how-it-works" className="text-sm text-mist-300 transition hover:text-mist-100">
          How it works
        </a>
        <a href="#widgets" className="text-sm text-mist-300 transition hover:text-mist-100">
          Dashboard
        </a>
        <a href="#faq" className="text-sm text-mist-300 transition hover:text-mist-100">
          FAQ
        </a>
      </nav>

      <Link
        href="/dashboard"
        className="rounded-full bg-signal-500 px-4 py-2 text-sm font-medium text-white shadow-glow transition hover:bg-signal-400"
      >
        Open dashboard
      </Link>
    </header>
  );
}
