import { platformStats } from "@/lib/mockData";

export default function StatsBar() {
  return (
    <div className="container-shell -mt-2 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 sm:grid-cols-3">
      {platformStats.map((stat) => (
        <div key={stat.label} className="bg-ink-850 px-7 py-6 text-center sm:text-left">
          <p className="font-display text-2xl font-semibold text-mist-100">{stat.value}</p>
          <p className="mt-1 label-eyebrow">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
