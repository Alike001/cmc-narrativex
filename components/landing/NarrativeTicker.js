import { narrativeSequence } from "@/lib/mockData";

export default function NarrativeTicker() {
  const items = [...narrativeSequence, ...narrativeSequence];

  return (
    <div className="relative w-full overflow-hidden border-y border-white/5 bg-ink-850/80 py-3">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink-900 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink-900 to-transparent" />
      <div className="flex w-max animate-ticker gap-10 whitespace-nowrap">
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-pulse-500" />
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-mist-500">
              {item}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
