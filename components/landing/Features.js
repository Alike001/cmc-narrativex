import PulseLine from "@/components/ui/PulseLine";
import RadialGauge from "@/components/ui/RadialGauge";
import Badge from "@/components/ui/Badge";

const widgets = [
  {
    title: "Current Narrative",
    tone: "signal",
    description:
      "The dominant story moving capital right now, with the assets riding it and why it's gaining strength.",
    visual: <PulseLine tone="signal" className="h-10 w-full" />,
  },
  {
    title: "Previous Narrative",
    tone: "neutral",
    description:
      "What faded, when it lost share of voice, and how long it held the market's attention before rotating out.",
    visual: (
      <div className="flex items-center gap-2">
        <Badge tone="neutral">Faded</Badge>
        <Badge tone="neutral">11 days held</Badge>
      </div>
    ),
  },
  {
    title: "Confidence Score",
    tone: "pulse",
    description:
      "How strongly social, on-chain, and price data agree on the current read — so you know when to trust it.",
    visual: <RadialGauge score={78} tone="pulse" size={64} strokeWidth={6} />,
  },
  {
    title: "Market Regime",
    tone: "signal",
    description:
      "Risk-on, risk-off, or chopping sideways — the backdrop every narrative trades against.",
    visual: <Badge tone="signal">Risk-On Expansion</Badge>,
  },
  {
    title: "Risk Score",
    tone: "amber",
    description:
      "Leverage, liquidity depth, and correlation rolled into one number so position sizing isn't a guess.",
    visual: <RadialGauge score={42} tone="amber" size={64} strokeWidth={6} />,
  },
  {
    title: "Generated Strategy",
    tone: "pulse",
    description:
      "A concrete thesis, conviction level, and allocation tilt — generated from everything above.",
    visual: <Badge tone="pulse">Medium-High conviction</Badge>,
  },
];

export default function Features() {
  return (
    <section id="widgets" className="bg-ink-850/40 py-20 sm:py-28">
      <div className="container-shell">
        <div className="max-w-xl">
          <span className="label-eyebrow text-pulse-400">The dashboard</span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-mist-100 sm:text-4xl">
            Six widgets. One read on the market.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-mist-500">
            Every widget pulls from the same live pipeline, so the narrative, the risk, and the
            strategy never contradict each other.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {widgets.map((widget) => (
            <div key={widget.title} className="panel flex flex-col justify-between p-6">
              <div>
                <h3 className="font-display text-base font-semibold text-mist-100">
                  {widget.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mist-500">{widget.description}</p>
              </div>
              <div className="mt-6">{widget.visual}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
