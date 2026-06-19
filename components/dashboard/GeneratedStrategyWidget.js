import WidgetCard from "@/components/dashboard/WidgetCard";
import Badge from "@/components/ui/Badge";
import { generatedStrategy } from "@/lib/mockData";

const TILT_TONE = {
  Overweight: "pulse",
  Neutral: "neutral",
  Underweight: "amber",
};

export default function GeneratedStrategyWidget() {
  return (
    <WidgetCard
      eyebrow="Generated strategy"
      title="AI strategy read"
      headerRight={<Badge tone="pulse">{generatedStrategy.conviction} conviction</Badge>}
      className="lg:col-span-3"
    >
      <p className="text-xs text-mist-500">{generatedStrategy.timeframe}</p>
      <p className="mt-4 text-sm leading-relaxed text-mist-300">{generatedStrategy.thesis}</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="label-eyebrow">Suggested actions</p>
          <ul className="mt-3 space-y-2.5">
            {generatedStrategy.actions.map((action) => (
              <li key={action} className="flex gap-2.5 text-sm leading-relaxed text-mist-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal-500" />
                {action}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label-eyebrow">Allocation tilt</p>
          <div className="mt-3 space-y-2">
            {generatedStrategy.allocationTilt.map((item) => (
              <div
                key={item.sector}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-ink-850 px-3.5 py-2.5"
              >
                <span className="text-sm text-mist-300">{item.sector}</span>
                <Badge tone={TILT_TONE[item.tilt] ?? "neutral"}>{item.tilt}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 border-t border-white/5 pt-4 text-[11px] leading-relaxed text-mist-700">
        {generatedStrategy.disclaimer}
      </p>
    </WidgetCard>
  );
}
