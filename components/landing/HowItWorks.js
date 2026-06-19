import { howItWorks } from "@/lib/mockData";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="container-shell py-20 sm:py-28">
      <div className="max-w-xl">
        <span className="label-eyebrow text-signal-400">The pipeline</span>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-mist-100 sm:text-4xl">
          From raw market noise to a sized strategy
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-mist-500">
          Each step runs continuously, not on a schedule — by the time a narrative is visible on
          a chart, NarrativeX has usually already named it.
        </p>
      </div>

      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 sm:grid-cols-3">
        {howItWorks.map((item) => (
          <div key={item.step} className="bg-ink-850 p-7">
            <span className="font-mono text-sm text-signal-400">{item.step}</span>
            <h3 className="mt-4 font-display text-lg font-semibold text-mist-100">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-mist-500">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
