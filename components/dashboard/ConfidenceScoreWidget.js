import WidgetCard from "@/components/dashboard/WidgetCard";
import RadialGauge from "@/components/ui/RadialGauge";
import { confidenceScore } from "@/lib/mockData";

export default function ConfidenceScoreWidget() {
  return (
    <WidgetCard eyebrow="Confidence score" title={confidenceScore.label}>
      <div className="flex items-center gap-5">
        <RadialGauge score={confidenceScore.score} tone="pulse" />
        <p className="text-sm leading-relaxed text-mist-500">{confidenceScore.description}</p>
      </div>

      <div className="mt-6 space-y-3">
        {confidenceScore.factors.map((factor) => (
          <div key={factor.name}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-mist-500">{factor.name}</span>
              <span className="font-mono text-mist-300">{factor.weight}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-850">
              <div
                className="h-full rounded-full bg-pulse-500"
                style={{ width: `${factor.weight}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
