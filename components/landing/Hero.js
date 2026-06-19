import Link from "next/link";
import PulseLine from "@/components/ui/PulseLine";
import Badge from "@/components/ui/Badge";
import { currentNarrative, confidenceScore, marketRegime } from "@/lib/mockData";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid-fade">
      <div className="container-shell grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
        {/* Left: thesis */}
        <div className="animate-rise">
          <span className="label-eyebrow text-signal-400">AI narrative intelligence</span>
          <h1 className="mt-5 font-display text-[40px] font-semibold leading-[1.08] tracking-tight text-mist-100 sm:text-[52px] lg:text-[58px]">
            Know which story the market
            <br />
            is trading{" "}
            <span className="bg-gradient-to-r from-signal-400 to-pulse-400 bg-clip-text text-transparent">
              before it&apos;s obvious.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-mist-500">
            CMC NarrativeX Agent reads social volume, on-chain activity, and price action together
            to name the dominant crypto narrative in real time - then scores its confidence, reads
            the market regime, and turns it into a strategy you can act on.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-full bg-signal-500 px-6 py-3 text-sm font-medium text-white shadow-glow transition hover:bg-signal-400"
            >
              Open the dashboard
            </Link>
            <a
              href="#how-it-works"
              className="rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-mist-300 transition hover:border-white/20 hover:text-mist-100"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Right: live read preview — the product's actual hero moment */}
        <div className="relative animate-rise [animation-delay:120ms]">
          <div className="panel p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <span className="label-eyebrow">Live narrative read</span>
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-pulse-400">
                <span className="h-1.5 w-1.5 animate-pulseLine rounded-full bg-pulse-500" />
                Live
              </span>
            </div>

            <h3 className="mt-4 font-display text-xl font-semibold text-mist-100">
              {currentNarrative.title}
            </h3>
            <p className="mt-1 text-sm text-mist-500">{currentNarrative.detectedAt}</p>

            <div className="mt-5">
              <PulseLine tone="pulse" className="h-9 w-full" />
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-ink-850 p-4">
              <div>
                <p className="label-eyebrow">Confidence</p>
                <p className="mt-2 font-display text-2xl font-semibold text-mist-100">
                  {confidenceScore.score}
                  <span className="text-sm font-normal text-mist-500">/100</span>
                </p>
              </div>
              <div className="h-10 w-px bg-white/5" />
              <div>
                <p className="label-eyebrow">Regime</p>
                <p className="mt-2 font-display text-base font-semibold text-pulse-400">
                  {marketRegime.regime}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {currentNarrative.relatedAssets.map((asset) => (
                <Badge key={asset} tone="signal">
                  {asset}
                </Badge>
              ))}
            </div>
          </div>

          {/* ambient glow */}
          <div className="absolute -right-10 -top-10 -z-10 h-56 w-56 rounded-full bg-signal-500/20 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 -z-10 h-56 w-56 rounded-full bg-pulse-500/15 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
