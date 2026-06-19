import WidgetCard from "@/components/dashboard/WidgetCard";
import Badge from "@/components/ui/Badge";
import { marketRegime } from "@/lib/mockData";

const rows = [
  { label: "Volatility", key: "volatility" },
  { label: "Liquidity", key: "liquidity" },
  { label: "Breadth", key: "breadth" },
];

export default function MarketRegimeWidget() {
  return (
    <WidgetCard
      eyebrow="Market regime"
      title={marketRegime.regime}
      headerRight={<Badge tone="signal">{marketRegime.since}</Badge>}
    >
      <p className="text-sm leading-relaxed text-mist-300">{marketRegime.description}</p>

      <div className="mt-5 divide-y divide-white/5 rounded-xl border border-white/5 bg-ink-850">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-mist-500">{row.label}</span>
            <span className="text-sm font-medium text-mist-100">{marketRegime[row.key]}</span>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
