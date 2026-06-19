import WidgetCard from "@/components/dashboard/WidgetCard";
import PulseLine from "@/components/ui/PulseLine";
import Badge from "@/components/ui/Badge";
import { currentNarrative } from "@/lib/mockData";

export default function CurrentNarrativeWidget() {
  return (
    <WidgetCard
      eyebrow="Current narrative"
      title={currentNarrative.title}
      headerRight={<Badge tone="pulse">{currentNarrative.momentum}</Badge>}
      className="lg:col-span-2"
    >
      <p className="text-xs text-mist-500">{currentNarrative.detectedAt}</p>

      <p className="mt-4 text-sm leading-relaxed text-mist-300">{currentNarrative.summary}</p>

      <div className="mt-6">
        <PulseLine tone="pulse" className="h-10 w-full" />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {currentNarrative.signals.map((signal) => (
          <div key={signal.label} className="rounded-xl border border-white/5 bg-ink-850 p-3.5">
            <p className="text-[11px] text-mist-500">{signal.label}</p>
            <p className="mt-1.5 font-mono text-base font-semibold text-pulse-400">
              {signal.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {currentNarrative.relatedAssets.map((asset) => (
          <Badge key={asset} tone="signal">
            {asset}
          </Badge>
        ))}
      </div>
    </WidgetCard>
  );
}
