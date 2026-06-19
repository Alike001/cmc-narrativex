import WidgetCard from "@/components/dashboard/WidgetCard";
import RadialGauge from "@/components/ui/RadialGauge";
import { riskScore } from "@/lib/mockData";

const TONE_BAR = {
  amber: "bg-amber-500",
  pulse: "bg-pulse-500",
  danger: "bg-danger-500",
};

export default function RiskScoreWidget() {
  return (
    <WidgetCard eyebrow="Risk score" title={`${riskScore.label} risk`}>
      <div className="flex items-center gap-5">
        <RadialGauge score={riskScore.score} tone="amber" />
        <p className="text-sm leading-relaxed text-mist-500">{riskScore.description}</p>
      </div>

      <div className="mt-6 space-y-3">
        {riskScore.factors.map((factor) => (
          <div key={factor.name}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-mist-500">{factor.name}</span>
              <span className="font-mono text-mist-300">{factor.value}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-850">
              <div
                className={`h-full rounded-full ${TONE_BAR[factor.tone] ?? TONE_BAR.amber}`}
                style={{ width: `${factor.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
