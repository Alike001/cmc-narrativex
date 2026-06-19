const faqs = [
  {
    q: "Is this financial advice?",
    a: "No. NarrativeX surfaces patterns in narrative, regime, and risk data and generates a strategy you can evaluate — every recommendation is informational, and sizing decisions are always yours.",
  },
  {
    q: "How fast does a new narrative get detected?",
    a: "Detection lag currently averages under 6 minutes from when a narrative starts gaining cross-source agreement in social, on-chain, and price-volume data.",
  },
  {
    q: "What happens when confidence is low?",
    a: "The current narrative widget will still show the leading candidate, but the confidence score and generated strategy will flag the lower conviction so you can wait it out instead of acting early.",
  },
  {
    q: "Can I connect my own watchlist?",
    a: "Yes — the dashboard is built to scope narrative and risk detection to a custom asset list once you connect a portfolio, in addition to the market-wide read.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="container-shell py-20 sm:py-28">
      <div className="max-w-xl">
        <span className="label-eyebrow text-signal-400">Questions</span>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-mist-100 sm:text-4xl">
          Before you open the dashboard
        </h2>
      </div>

      <div className="mt-12 divide-y divide-white/5 border-t border-white/5">
        {faqs.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-medium text-mist-100">
              {item.q}
              <span className="font-mono text-mist-500 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mist-500">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
