import WidgetCard from "@/components/dashboard/WidgetCard";
import Badge from "@/components/ui/Badge";
import { previousNarrative } from "@/lib/mockData";

export default function PreviousNarrativeWidget() {
  return (
    <WidgetCard
      eyebrow="Previous narrative"
      title={previousNarrative.title}
      headerRight={<Badge tone="neutral">Faded</Badge>}
    >
      <p className="text-xs text-mist-500">{previousNarrative.fadedAt}</p>

      <p className="mt-4 text-sm leading-relaxed text-mist-300">{previousNarrative.summary}</p>

      <div className="mt-5 flex items-center justify-between rounded-xl border border-white/5 bg-ink-850 p-3.5">
        <div>
          <p className="text-[11px] text-mist-500">Duration</p>
          <p className="mt-1 text-sm font-medium text-mist-100">{previousNarrative.duration}</p>
        </div>
        <div className="h-8 w-px bg-white/5" />
        <div>
          <p className="text-[11px] text-mist-500">Peak confidence</p>
          <p className="mt-1 font-mono text-sm font-medium text-mist-100">
            {previousNarrative.peakConfidence}/100
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {previousNarrative.relatedAssets.map((asset) => (
          <Badge key={asset} tone="neutral">
            {asset}
          </Badge>
        ))}
      </div>
    </WidgetCard>
  );
}
