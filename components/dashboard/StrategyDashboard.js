"use client";

import { useEffect, useRef, useState } from "react";
import WidgetCard from "@/components/dashboard/WidgetCard";
import Badge from "@/components/ui/Badge";
import PulseLine from "@/components/ui/PulseLine";
import RadialGauge from "@/components/ui/RadialGauge";
import { formatDashboardTimestamp } from "@/lib/cmc";
import { loadStrategyPlatformSnapshot } from "@/lib/strategy-platform";
import { buildNarrativeRotationAgent } from "@/lib/narrative-agent";

const REGIME_TONES = {
  Bull: "signal",
  Bear: "danger",
  Sideways: "neutral",
  Panic: "danger",
  Euphoria: "pulse",
};

const LIFECYCLE_TONES = {
  Emerging: "amber",
  Building: "signal",
  Dominant: "pulse",
  Peak: "amber",
  Exhausting: "danger",
};

const ARCHITECTURE_STEPS = [
  {
    title: "CoinMarketCap Data",
    description: "Provides category, market, and narrative inputs.",
  },
  {
    title: "Narrative Detection Engine",
    description: "Identifies leading and emerging market narratives.",
  },
  {
    title: "Narrative Rotation Scoring",
    description: "Measures momentum, volume expansion, and capital rotation.",
  },
  {
    title: "Market Regime Analysis",
    description: "Classifies Bull, Bear, Sideways, Panic, or Euphoria conditions.",
  },
  {
    title: "Risk Engine",
    description: "Calculates portfolio risk and confidence levels.",
  },
  {
    title: "Narrative Rotation Agent",
    description: "Combines all signals into a portfolio decision.",
  },
  {
    title: "Portfolio Allocation Engine",
    description: "Determines recommended allocations.",
  },
  {
    title: "Actionable Recommendations",
    description: "Generates watchlists, entries, exits, and risk notes.",
  },
];

function getSourceTone(source) {
  if (source === "CoinMarketCap Data") {
    return "signal";
  }

  if (source === "Development Mock") {
    return "neutral";
  }

  return "amber";
}

function getConnectionTone(status) {
  if (status === "CoinMarketCap Connected") {
    return "pulse";
  }

  if (status === "Development Mode") {
    return "neutral";
  }

  return "amber";
}

function getModeBadgeLabel(source) {
  if (source === "CoinMarketCap Data") {
    return "Live Market Data";
  }

  if (source === "Development Mock") {
    return "Development Mode";
  }

  return "Fallback Mode";
}

function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-xl bg-white/5 ${className}`} />;
}

function LoadingState() {
  return (
    <div className="grid gap-5 lg:grid-cols-4">
      <SkeletonBlock className="h-96 lg:col-span-4" />
      <SkeletonBlock className="h-56 lg:col-span-2" />
      <SkeletonBlock className="h-56 lg:col-span-2" />
      <SkeletonBlock className="h-72 lg:col-span-2" />
      <SkeletonBlock className="h-72 lg:col-span-2" />
      <SkeletonBlock className="h-64 lg:col-span-4" />
    </div>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="rounded-[28px] border border-danger-500/20 bg-danger-900/20 p-6">
      <p className="label-eyebrow text-danger-400">Integration error</p>
      <h2 className="mt-3 font-display text-2xl font-semibold text-mist-100">
        Could not load the strategy snapshot
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mist-300">{error}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 rounded-full bg-danger-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-danger-400"
      >
        Retry
      </button>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-white/5 bg-ink-850/80 p-3">
      <p className="text-[11px] uppercase tracking-[0.16em] text-mist-500">{label}</p>
      <p className="mt-1.5 font-mono text-sm font-semibold text-mist-100">{value}</p>
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block space-y-2">
      <span className="text-[11px] uppercase tracking-[0.16em] text-mist-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/5 bg-ink-850/80 px-3 py-2.5 text-sm text-mist-100 outline-none transition focus:border-signal-400"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function NumberField({ label, value, onChange, min = 0, step = 1 }) {
  return (
    <label className="block space-y-2">
      <span className="text-[11px] uppercase tracking-[0.16em] text-mist-500">{label}</span>
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/5 bg-ink-850/80 px-3 py-2.5 font-mono text-sm text-mist-100 outline-none transition focus:border-signal-400"
      />
    </label>
  );
}

function buildNarrativeRotationReportMarkdown({ snapshot, agent, generatedAt }) {
  const lines = [];
  const timestamp = formatDashboardTimestamp(generatedAt);
  const risk = snapshot?.risk ?? {};
  const allocations = Array.isArray(agent?.recommendedAllocation) ? agent.recommendedAllocation : [];
  const watchlist = Array.isArray(agent?.prioritizedWatchlist) ? agent.prioritizedWatchlist : [];

  lines.push("# Narrative Rotation Report");
  lines.push("");
  lines.push(`**Generated:** ${timestamp}`);
  lines.push(`**Dominant Narrative:** ${agent?.dominantNarrative ?? "N/A"}`);
  lines.push(`**Confidence Score:** ${agent?.confidenceScore ?? 0}/100`);
  lines.push(`**Market Regime:** ${snapshot?.regime?.active ?? "N/A"}`);
  lines.push(`**Risk Score:** ${risk.score ?? 0}/100 (${risk.label ?? "N/A"})`);
  lines.push("");
  lines.push("## Recommended Allocation");
  allocations.forEach((item) => {
    lines.push(`- ${item.name}: ${item.percent}%`);
  });
  lines.push("");
  lines.push("## Watchlist");
  watchlist.forEach((item) => {
    lines.push(`- #${item.rank} ${item.name} (${item.momentum})`);
  });
  lines.push("");
  lines.push("## Entry Strategy");
  lines.push(agent?.entryStrategy ?? "N/A");
  lines.push("");
  lines.push("## Exit Strategy");
  lines.push(agent?.exitStrategy ?? "N/A");
  lines.push("");
  lines.push("## Allocation Summary");
  lines.push(agent?.reasoningSummary ?? "N/A");
  lines.push("");
  lines.push("## Timestamp");
  lines.push(timestamp);

  return `${lines.join("\n")}\n`;
}

function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function NarrativeXArchitectureModal({ open, onClose }) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 px-4 py-6 backdrop-blur-md">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="architecture-title"
        className="relative z-10 w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(5,10,18,0.96))] shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="signal">CoinMarketCap Powered</Badge>
              <span className="text-[11px] uppercase tracking-[0.18em] text-mist-500">NarrativeX Agent Architecture</span>
            </div>
            <h2 id="architecture-title" className="mt-3 font-display text-2xl font-semibold text-mist-100 sm:text-3xl">
              NarrativeX Agent Architecture
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-mist-200 transition hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="max-h-[calc(100vh-9rem)] overflow-y-auto px-5 py-5 sm:px-6">
          <div className="rounded-[28px] border border-white/5 bg-white/[0.03] p-5">
            <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:gap-2">
              {ARCHITECTURE_STEPS.map((step, index) => (
                <div key={step.title} className="flex flex-1 flex-col items-stretch">
                  <div className="group rounded-2xl border border-white/5 bg-ink-850/80 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-signal-400/30 hover:bg-ink-800/90">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse" />
                    </div>
                    <h3 className="mt-3 font-display text-base font-semibold text-mist-100">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-mist-400">{step.description}</p>
                  </div>
                  {index < ARCHITECTURE_STEPS.length - 1 ? (
                    <div className="flex items-center justify-center py-2 lg:flex-col lg:px-2 lg:py-0">
                      <div className="flex items-center gap-2 text-signal-400/90">
                        <span className="hidden lg:block animate-pulse">↓</span>
                        <span className="lg:hidden animate-pulse">→</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/5 bg-black/30 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-mist-300">
              Built for the CoinMarketCap Agent &amp; BNB Agent Ecosystem.
            </p>
            <Badge tone="pulse">Modern AI agent flow</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

function NarrativeRotationAgentPanel({
  snapshot,
  agent,
  riskProfile,
  holdingPeriod,
  capitalAmount,
  setRiskProfile,
  setHoldingPeriod,
  setCapitalAmount,
  onGenerateReport,
}) {
  const dominantAllocation = agent.recommendedAllocation[0];
  const secondaryAllocation = agent.recommendedAllocation[1];
  const tertiaryAllocation = agent.recommendedAllocation[2];
  const cashAllocation = agent.recommendedAllocation[3];

  return (
    <WidgetCard
      eyebrow="Narrative rotation agent"
      title="AI Narrative Rotation Agent"
      headerRight={
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="pulse">{agent.confidenceScore}/100 confidence</Badge>
          <Badge tone="signal">{riskProfile}</Badge>
          <Badge tone="neutral">{holdingPeriod}</Badge>
          <button
            type="button"
            onClick={onGenerateReport}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium tracking-[0.16em] text-mist-200 transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            Generate Report
          </button>
        </div>
      }
      className="lg:col-span-4"
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
            <p className="label-eyebrow text-signal-400">Decision engine</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-mist-100 sm:text-[28px]">
              {agent.dominantNarrative}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-mist-300">
              The agent converts live narrative strength, market regime, risk, and category momentum
              into a portfolio decision set for the selected risk profile and holding period.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <SelectField
              label="Risk Profile"
              value={riskProfile}
              onChange={setRiskProfile}
              options={["Conservative", "Moderate", "Aggressive"]}
            />
            <SelectField
              label="Holding Period"
              value={holdingPeriod}
              onChange={setHoldingPeriod}
              options={["1 Week", "2 Weeks", "1 Month", "3 Months"]}
            />
            <NumberField
              label="Capital Amount (USD)"
              value={capitalAmount}
              onChange={(value) => setCapitalAmount(Math.max(0, Number(value) || 0))}
              min={0}
              step={1000}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Metric label="Dominant Narrative" value={agent.dominantNarrative} />
            <Metric label="Confidence Score" value={`${agent.confidenceScore}/100`} />
            <Metric label="Capital" value={capitalAmount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} />
            <Metric label="Regime" value={snapshot.regime.active} />
          </div>

          <div className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="label-eyebrow">Confidence meter</p>
                <p className="mt-2 text-sm text-mist-300">
                  Confidence reflects narrative strength, market regime, risk score, and the current
                  signal gap between the top categories.
                </p>
              </div>
              <Badge tone={agent.confidenceScore >= 80 ? "pulse" : agent.confidenceScore >= 60 ? "signal" : "amber"}>
                {snapshot.risk.label} risk
              </Badge>
            </div>
            <div className="mt-4 flex items-center gap-5">
              <RadialGauge
                score={agent.confidenceScore}
                tone={agent.confidenceScore >= 80 ? "pulse" : agent.confidenceScore >= 60 ? "signal" : "amber"}
                size={128}
                strokeWidth={10}
              />
              <div className="space-y-2">
                <p className="font-display text-2xl font-semibold text-mist-100">
                  {agent.dominantNarrative}
                </p>
                <p className="text-sm leading-relaxed text-mist-300">
              {snapshot.narratives.narrativeExplanation?.summary}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Badge tone="signal">{snapshot.regime.active}</Badge>
                  <Badge tone="neutral">{snapshot.narratives.narrativeLifecycle?.state}</Badge>
                  <Badge tone="pulse">{snapshot.narratives.narrativeRotationScore?.score}/100 rotation</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
            <p className="label-eyebrow">Reasoning Summary</p>
            <p className="mt-2 text-sm leading-relaxed text-mist-300">{agent.reasoningSummary}</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="label-eyebrow">Recommended Allocation</p>
              <Badge tone="signal">{agent.profileLabel} / {agent.holdingLabel}</Badge>
            </div>
            <div className="mt-4 space-y-4">
              {agent.recommendedAllocation.map((item, index) => {
                const isCash = item.name === "Cash";
                const tone =
                  index === 0 ? "pulse" : isCash ? "neutral" : index === 1 ? "signal" : "amber";
                const amount = capitalAmount > 0 ? item.amount : 0;

                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-mist-400">{item.name}</span>
                      <span className="font-mono text-mist-100">
                        {item.percent}%{capitalAmount > 0 ? ` · ${amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}` : ""}
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-800">
                      <div
                        className={`h-full rounded-full ${
                          tone === "pulse"
                            ? "bg-pulse-500"
                            : tone === "signal"
                              ? "bg-signal-500"
                              : tone === "amber"
                                ? "bg-amber-500"
                                : "bg-mist-500"
                        }`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Metric label="Top Allocation" value={`${dominantAllocation?.name ?? "Cash"} ${dominantAllocation?.percent ?? 0}%`} />
              <Metric label="Cash Reserve" value={`${cashAllocation?.percent ?? 0}%`} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
              <p className="label-eyebrow">Entry Strategy</p>
              <p className="mt-2 text-sm leading-relaxed text-mist-300">{agent.entryStrategy}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
              <p className="label-eyebrow">Exit Strategy</p>
              <p className="mt-2 text-sm leading-relaxed text-mist-300">{agent.exitStrategy}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
            <p className="label-eyebrow">Suggested Watchlist</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {(agent.prioritizedWatchlist ?? agent.suggestedWatchlist.map((asset, index) => ({
                rank: index + 1,
                name: asset,
                priority: 0,
                tone: index === 0 ? "pulse" : "signal",
                note: "",
              }))).map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-ink-850 p-3"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-mist-500">
                      #{item.rank} priority
                    </p>
                    <p className="mt-1 truncate font-display text-sm font-semibold text-mist-100">
                      {item.name}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <Badge tone={item.tone ?? "signal"}>{item.note || `${item.priority} prio`}</Badge>
                    <span className="font-mono text-[11px] text-mist-500">
                      {item.momentum === "rising" ? "rising" : item.momentum === "cooling" ? "cooling" : "steady"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Metric label="Secondary" value={secondaryAllocation ? `${secondaryAllocation.name} ${secondaryAllocation.percent}%` : "N/A"} />
              <Metric label="Tertiary" value={tertiaryAllocation ? `${tertiaryAllocation.name} ${tertiaryAllocation.percent}%` : "N/A"} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
            <p className="label-eyebrow">Risk Notes</p>
            <ul className="mt-3 space-y-3">
              {agent.riskNotes.map((note) => (
                <li key={note} className="flex gap-2 text-sm leading-relaxed text-mist-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pulse-500" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}

function buildAllocationReasoning(snapshot, agent) {
  const dominantNarrative = snapshot?.narratives?.dominantNarrative?.name ?? agent?.dominantNarrative ?? "the current leader";
  const narrativeStrength = snapshot?.narratives?.narrativeStrength?.score ?? 0;
  const marketRegime = snapshot?.regime?.active ?? "Sideways";
  const riskScore = snapshot?.risk?.score ?? 0;
  const heatmap = Array.isArray(snapshot?.narrativeHeatmap) ? snapshot.narrativeHeatmap : [];
  const topSignals = heatmap.slice(0, 3).map((item) => ({
    name: item.name,
    price: item.avgPriceChange,
    volume: item.volumeChange,
    marketCap: item.marketCapChange,
  }));

  const topSignal = topSignals[0];
  const strengthTone = narrativeStrength >= 80 ? "text-pulse-400" : narrativeStrength >= 60 ? "text-signal-400" : "text-amber-400";
  const regimeTone = marketRegime === "Bull" || marketRegime === "Euphoria" ? "text-pulse-400" : "text-signal-400";
  const riskTone = riskScore >= 65 ? "text-danger-400" : "text-signal-400";

  const explanation = [
    `The agent selected ${dominantNarrative} because it has the strongest narrative strength read (${narrativeStrength}/100) and the leading momentum profile in the current basket.`,
    topSignal
      ? `Its top signal set is led by ${topSignal.name}, where ${topSignal.volume} volume change, ${topSignal.marketCap} market-cap change, and ${topSignal.price} average price change confirm capital rotation.`
      : "Its top momentum signals remain aligned across price, volume, and market-cap change.",
    `${marketRegime} regime conditions support the allocation, while the ${riskScore}/100 risk score argues for sizing with either cash reserve or tighter discipline depending on profile.`,
  ].join(" ");

  return {
    dominantNarrative,
    narrativeStrength,
    marketRegime,
    riskScore,
    topSignals,
    explanation,
    strengthTone,
    regimeTone,
    riskTone,
  };
}

function WhyThisAllocationPanel({ snapshot, agent }) {
  const reasoning = buildAllocationReasoning(snapshot, agent);
  const indicators = [
    { label: "Dominant Narrative", value: reasoning.dominantNarrative, tone: "text-pulse-400" },
    { label: "Narrative Strength", value: `${reasoning.narrativeStrength}/100`, tone: reasoning.strengthTone },
    { label: "Market Regime", value: reasoning.marketRegime, tone: reasoning.regimeTone },
    { label: "Risk Score", value: `${reasoning.riskScore}/100`, tone: reasoning.riskTone },
  ];

  return (
    <div className="rounded-2xl border border-emerald-500/15 bg-ink-900/90 p-4 shadow-[0_0_0_1px_rgba(16,185,129,0.08)]">
      <div className="flex items-center justify-between gap-3 border-b border-emerald-500/10 pb-3">
        <div>
          <p className="label-eyebrow text-emerald-400">Why this allocation?</p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-mist-500">Terminal reasoning</p>
        </div>
        <Badge tone="signal">Live rationale</Badge>
      </div>

      <div className="mt-4 space-y-4 font-mono text-sm text-mist-200">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {indicators.map((item) => (
            <div key={item.label} className="rounded-xl border border-white/5 bg-ink-850/80 p-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-mist-500">{item.label}</p>
              <p className={`mt-1.5 font-semibold ${item.tone}`}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-white/5 bg-black/30 p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-mist-500">Explanation</p>
          <p className="mt-2 leading-relaxed text-mist-200">{reasoning.explanation}</p>
        </div>

        <div className="rounded-xl border border-white/5 bg-black/30 p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-mist-500">Top momentum signals</p>
          <div className="mt-3 space-y-2">
            {reasoning.topSignals.map((signal) => (
              <div key={signal.name} className="flex items-center justify-between gap-3">
                <span className="text-emerald-400">● {signal.name}</span>
                <span className="text-right text-mist-300">
                  {signal.volume} vol · {signal.marketCap} mcap · {signal.price} price
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
            Green = constructive signal
          </span>
          <span className="rounded-full border border-danger-500/20 bg-danger-500/10 px-3 py-1 text-xs text-danger-300">
            Red = risk warning
          </span>
        </div>
      </div>
    </div>
  );
}

function buildDecisionSummary(agent) {
  const dominantAllocation = agent?.recommendedAllocation?.[0];
  const cashAllocation = agent?.recommendedAllocation?.[3];

  if (!dominantAllocation) {
    return "No allocation summary available.";
  }

  return `${dominantAllocation.name} ${dominantAllocation.percent}%${cashAllocation ? ` · cash ${cashAllocation.percent}%` : ""}`;
}

function buildAllocationBreakdown(agent) {
  return Array.isArray(agent?.recommendedAllocation)
    ? agent.recommendedAllocation.map((item) => ({
        name: item.name,
        percent: item.percent,
      }))
    : [];
}

function formatAllocationDelta(value) {
  const signed = value > 0 ? `+${value}` : `${value}`;
  return `${signed}%`;
}

function NarrativeRotationChangesPanel({ decisions, snapshot }) {
  const current = decisions[0];
  const previous = decisions[1];
  const currentLeader = current?.dominantNarrative ?? snapshot?.narratives?.dominantNarrative?.name ?? "N/A";
  const previousLeader = previous?.dominantNarrative ?? snapshot?.narratives?.previousNarrative?.name ?? "N/A";
  const currentConfidence = current?.confidence ?? snapshot?.narratives?.narrativeStrength?.score ?? 0;
  const previousConfidence = previous?.confidence ?? snapshot?.narratives?.previousNarrative?.peakConfidence ?? currentConfidence;
  const currentRisk = current?.riskLabel ?? snapshot?.risk?.label ?? "Unknown";
  const previousRisk = previous?.riskLabel ?? snapshot?.risk?.label ?? "Unknown";
  const currentAllocations = current?.allocations ?? [];
  const previousAllocations = previous?.allocations ?? [];

  const allNames = new Set([...currentAllocations.map((item) => item.name), ...previousAllocations.map((item) => item.name)]);
  const allocationChanges = Array.from(allNames)
    .map((name) => {
      const currentPercent = currentAllocations.find((item) => item.name === name)?.percent ?? 0;
      const previousPercent = previousAllocations.find((item) => item.name === name)?.percent ?? 0;
      return {
        name,
        delta: currentPercent - previousPercent,
      };
    })
    .filter((item) => item.delta !== 0)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  const summary =
    current && previous
      ? `${previousLeader} rotated out as ${currentLeader} took leadership, with confidence moving from ${previousConfidence}/100 to ${currentConfidence}/100 and risk shifting from ${previousRisk} to ${currentRisk}.`
      : `Waiting for a second decision to calculate rotation deltas for ${currentLeader}.`;

  return (
    <WidgetCard eyebrow="Narrative rotation changes" title="Narrative Rotation Changes" className="lg:col-span-4">
      <div className="rounded-2xl border border-white/5 bg-black/40 p-4 font-mono">
        <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-mist-500">AI terminal diff</p>
            <p className="mt-1 text-sm text-mist-300">Compares the latest decision against the previous logged state.</p>
          </div>
          <Badge tone="signal">{decisions.length > 1 ? "Delta ready" : "Waiting for prior decision"}</Badge>
        </div>

        <div className="mt-4 rounded-xl border border-white/5 bg-ink-850/80 p-4 text-sm leading-relaxed text-mist-200">
          {summary}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-white/5 bg-ink-850/80 p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-mist-500">Previous Leader</p>
            <p className="mt-1.5 text-sm text-mist-200">{previousLeader}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-ink-850/80 p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-mist-500">Current Leader</p>
            <p className="mt-1.5 text-sm text-emerald-400">{currentLeader}</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-ink-850/80 p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-mist-500">Confidence</p>
            <p className="mt-1.5 text-sm text-signal-400">
              {previousConfidence} → {currentConfidence}
            </p>
          </div>
          <div className="rounded-xl border border-white/5 bg-ink-850/80 p-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-mist-500">Risk</p>
            <p className="mt-1.5 text-sm text-mist-200">
              {previousRisk} → <span className="text-emerald-400">{currentRisk}</span>
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-white/5 bg-ink-850/80 p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-mist-500">Allocation Change</p>
          <div className="mt-3 space-y-2">
            {allocationChanges.length > 0 ? (
              allocationChanges.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-3">
                  <span className={item.delta > 0 ? "text-emerald-400" : "text-danger-400"}>
                    {item.name}
                  </span>
                  <span className={item.delta > 0 ? "text-emerald-400" : "text-danger-400"}>
                    {formatAllocationDelta(item.delta)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-mist-500">No prior allocation change recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}

function AgentDecisionLogPanel({ decisions }) {
  const entries = decisions.slice(0, 5);

  return (
    <WidgetCard
      eyebrow="AI terminal log"
      title="Agent Decision Log"
      className="lg:col-span-4"
      headerRight={<Badge tone="signal">{entries.length} latest</Badge>}
    >
      <div className="rounded-2xl border border-emerald-500/10 bg-black/40 p-4 font-mono">
        <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3 text-[11px] uppercase tracking-[0.18em] text-mist-500">
          <span>Newest first</span>
          <span>scroll to inspect history</span>
        </div>

        <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
          {entries.length > 0 ? (
            entries.map((entry) => (
              <div key={entry.id} className="rounded-xl border border-white/5 bg-ink-850/80 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-mist-500">
                    {formatDashboardTimestamp(entry.timestamp)}
                  </span>
                  <Badge tone={entry.confidence >= 80 ? "pulse" : entry.confidence >= 60 ? "signal" : "amber"}>
                    {entry.confidence}/100
                  </Badge>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-mist-200 md:grid-cols-[180px_120px_1fr]">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-mist-500">Dominant Narrative</p>
                    <p className="mt-1 text-emerald-400">{entry.dominantNarrative}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-mist-500">Confidence</p>
                    <p className="mt-1 text-signal-400">{entry.confidence}/100</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-mist-500">Allocation Summary</p>
                    <p className="mt-1 text-mist-200">{entry.allocationSummary}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 bg-ink-850/60 p-4 text-sm text-mist-500">
              No decisions logged yet.
            </div>
          )}
        </div>
      </div>
    </WidgetCard>
  );
}

function NarrativeAnalysisPanel({ narratives, watchlist }) {
  const dominant = narratives.dominantNarrative;
  const previous = narratives.previousNarrative;
  const strength = narratives.narrativeStrength;

  return (
    <WidgetCard
      eyebrow="Narrative analysis"
      title={dominant.name}
      headerRight={<Badge tone="pulse">{dominant.momentum}</Badge>}
      className="lg:col-span-2"
    >
      <div className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs text-mist-500">{dominant.detectedAt}</p>
            <p className="mt-4 text-sm leading-relaxed text-mist-300">{dominant.summary}</p>
            <div className="mt-5">
              <PulseLine tone="pulse" className="h-8 w-full" />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {dominant.assets.map((asset) => (
                <Badge key={asset} tone="signal">
                  {asset}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-ink-850/80 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="label-eyebrow">Narrative strength</p>
                <p className="mt-2 font-display text-3xl font-semibold text-mist-100">
                  {strength.score}
                  <span className="ml-1 text-sm font-normal text-mist-500">/100</span>
                </p>
              </div>
              <Badge tone={strength.score >= 80 ? "pulse" : "neutral"}>{strength.label}</Badge>
            </div>

            <div className="mt-4 space-y-3">
              {[
                { label: "Social", value: strength.socialAgreement },
                { label: "On-chain", value: strength.onchainConfirmation },
                { label: "Price", value: strength.priceConfirmation },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-mist-500">{item.label}</span>
                    <span className="font-mono text-mist-300">{item.value}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-800">
                    <div
                      className="h-full rounded-full bg-pulse-500"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="label-eyebrow">Previous narrative</p>
              <h4 className="mt-2 font-display text-lg font-semibold text-mist-100">
                {previous.name}
              </h4>
            </div>
            <Badge tone="neutral">{previous.status}</Badge>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-mist-300">{previous.summary}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Metric label="Faded" value={previous.fadedAt} />
            <Metric label="Held" value={previous.duration} />
            <Metric label="Peak" value={`${previous.peakConfidence}/100`} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-5">
          <span className="label-eyebrow">Watchlist</span>
          {watchlist.map((item) => (
            <Badge key={item.name} tone={item.momentum === "rising" ? "pulse" : "neutral"}>
              {item.rank}. {item.name}
            </Badge>
          ))}
        </div>
      </div>
    </WidgetCard>
  );
}

function NarrativeRotationPanel({ narratives }) {
  const dominant = narratives.dominantNarrative;
  const rotation = narratives.narrativeRotationScore ?? {
    score: narratives.narrativeStrength.score,
    label: narratives.narrativeStrength.label,
    drivers: [],
  };
  const lifecycle = narratives.narrativeLifecycle ?? {
    state: "Accelerating",
    description: "Live category data is still confirming the trend.",
    nextState: "Dominant",
  };

  return (
    <WidgetCard
      eyebrow="Narrative rotation"
      title="Rotation score"
      headerRight={<Badge tone={LIFECYCLE_TONES[lifecycle.state] ?? "neutral"}>{lifecycle.state}</Badge>}
      className="lg:col-span-2"
    >
      <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="flex justify-center">
          <RadialGauge
            score={rotation.score}
            tone={rotation.score >= 80 ? "pulse" : rotation.score >= 60 ? "signal" : "amber"}
            size={120}
            strokeWidth={10}
          />
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={rotation.score >= 80 ? "pulse" : rotation.score >= 60 ? "signal" : "amber"}>
              {rotation.score}/100
            </Badge>
            <Badge tone="neutral">{rotation.label}</Badge>
          </div>
          <p className="text-sm leading-relaxed text-mist-300">{lifecycle.description}</p>
          <div className="space-y-3">
            {rotation.drivers.map((driver) => (
              <div key={driver.label} className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-mist-500">{driver.label}</span>
                  <span className="font-mono text-mist-300">{driver.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-white/5 bg-ink-850/70 p-4">
        <p className="label-eyebrow">Current narrative</p>
        <p className="mt-2 text-sm leading-relaxed text-mist-300">{dominant.summary}</p>
      </div>
    </WidgetCard>
  );
}

function NarrativeHeatmapPanel({ heatmap }) {
  const lead = heatmap[0];

  return (
    <WidgetCard
      eyebrow="Narrative heatmap"
      title="Top 10 categories"
      headerRight={
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="signal">{heatmap.length} categories</Badge>
          {lead ? <Badge tone="pulse">#1 {lead.name}</Badge> : null}
        </div>
      }
      className="lg:col-span-4"
    >
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-ink-850/60">
        <div className="hidden items-center gap-3 border-b border-white/5 px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-mist-500 md:grid md:grid-cols-[44px_minmax(0,2fr)_84px_120px_96px_96px_96px]">
          <span>Rank</span>
          <span>Narrative</span>
          <span>Score</span>
          <span>Lifecycle</span>
          <span>24h price</span>
          <span>Volume</span>
          <span>Market cap</span>
        </div>
        <div className="divide-y divide-white/5">
          {heatmap.slice(0, 10).map((item) => (
          <div
            key={item.name}
            className={`grid gap-3 px-4 py-4 md:grid-cols-[44px_minmax(0,2fr)_84px_120px_96px_96px_96px] md:items-center ${
              item.rank === 1 ? "bg-pulse-500/6" : "bg-transparent"
            }`}
          >
            <div className="flex items-center gap-3 md:block">
              <span className="text-[11px] uppercase tracking-[0.16em] text-mist-500 md:hidden">Rank</span>
              <span className="font-mono text-sm font-semibold text-mist-100">#{item.rank}</span>
            </div>

            <div className="min-w-0">
              <span className="text-[11px] uppercase tracking-[0.16em] text-mist-500 md:hidden">Narrative</span>
              <div className="mt-1 flex items-center gap-2 md:mt-0">
                <p className="truncate font-display text-sm font-semibold text-mist-100">{item.name}</p>
                {item.rank === 1 ? <Badge tone="pulse">Lead</Badge> : null}
              </div>
            </div>

            <div className="flex items-center justify-between md:block">
              <span className="text-[11px] uppercase tracking-[0.16em] text-mist-500 md:hidden">Score</span>
              <div className="flex items-center gap-3 md:justify-start">
                <span className="font-mono text-sm font-semibold text-mist-100">{item.score}</span>
                <div className="h-1.5 w-28 overflow-hidden rounded-full bg-ink-800">
                  <div
                    className={`h-full rounded-full ${
                      item.rank === 1
                        ? "bg-pulse-500"
                        : item.lifecycle === "Exhausting"
                          ? "bg-danger-500"
                          : item.lifecycle === "Peak"
                            ? "bg-amber-500"
                            : "bg-signal-500"
                    }`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:block">
              <span className="text-[11px] uppercase tracking-[0.16em] text-mist-500 md:hidden">Lifecycle</span>
                <Badge
                  tone={
                    item.lifecycle === "Exhausting"
                      ? "danger"
                      : item.lifecycle === "Peak"
                        ? "amber"
                        : item.lifecycle === "Dominant"
                          ? "pulse"
                          : item.lifecycle === "Building"
                            ? "signal"
                            : "neutral"
                  }
                >
                  {item.lifecycle}
              </Badge>
            </div>

            <div className="flex items-center justify-between md:block">
              <span className="text-[11px] uppercase tracking-[0.16em] text-mist-500 md:hidden">24h price</span>
              <span className="font-mono text-sm text-mist-300">{item.avgPriceChange}</span>
            </div>

            <div className="flex items-center justify-between md:block">
              <span className="text-[11px] uppercase tracking-[0.16em] text-mist-500 md:hidden">Volume</span>
              <span className="font-mono text-sm text-mist-300">{item.volumeChange}</span>
            </div>

            <div className="flex items-center justify-between md:block">
              <span className="text-[11px] uppercase tracking-[0.16em] text-mist-500 md:hidden">Market cap</span>
              <span className="font-mono text-sm text-mist-300">{item.marketCapChange}</span>
            </div>
          </div>
          ))}
        </div>
      </div>
    </WidgetCard>
  );
}

function NarrativeTimelinePanel({ timeline }) {
  return (
    <WidgetCard
      eyebrow="Narrative timeline"
      title="Lifecycle path"
      headerRight={<Badge tone="neutral">Dynamic</Badge>}
      className="lg:col-span-2"
    >
      <div className="space-y-3">
        {timeline.map((step, index) => (
          <div key={step.stage} className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-mist-500">
                  {String(index + 1).padStart(2, "0")} {step.title}
                </p>
                <p className="mt-2 text-sm font-medium text-mist-100">{step.value}</p>
              </div>
              <Badge
                tone={
                  step.stage === "peak"
                    ? "pulse"
                    : step.stage === "strengthening"
                      ? "signal"
                      : step.stage === "fading"
                        ? "amber"
                        : "neutral"
                }
              >
                {step.stage}
              </Badge>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-mist-300">{step.detail}</p>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}

function NarrativeExplanationPanel({ explanation }) {
  const bullets = explanation?.bullets ?? [];

  return (
    <WidgetCard
      eyebrow="AI explanation"
      title={explanation?.title ?? "Why this narrative matters"}
      headerRight={<Badge tone="pulse">Institutional read</Badge>}
      className="lg:col-span-4"
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
          <p className="text-sm leading-relaxed text-mist-300">{explanation?.summary}</p>
          <ul className="space-y-3">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2 text-sm leading-relaxed text-mist-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pulse-500" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
          <p className="label-eyebrow">Interpretation</p>
          <p className="mt-2 text-sm leading-relaxed text-mist-300">
            Live category data is weighted into a single rotation read so the same score drives the rank,
            the lifecycle stage, and the timeline that explains why the narrative reached that state.
          </p>
        </div>
      </div>
    </WidgetCard>
  );
}

function MarketRegimePanel({ regime }) {
  return (
    <WidgetCard
      eyebrow="Market regime"
      title={regime.active}
      headerRight={<Badge tone={REGIME_TONES[regime.active] ?? "neutral"}>Live</Badge>}
      className="lg:col-span-2"
    >
      <div className="space-y-5">
        <p className="text-sm leading-relaxed text-mist-300">{regime.summary}</p>
        <div className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
          <p className="label-eyebrow">Current read</p>
          <p className="mt-2 text-sm text-mist-300">{regime.catalyst}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {regime.supportLevels.map((support) => (
              <Badge key={support} tone="signal">
                {support}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {regime.states.map((state) => (
            <div key={state.name} className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-display text-base font-semibold text-mist-100">{state.name}</p>
                  <p className="mt-1 text-xs text-mist-500">{state.note}</p>
                </div>
                <Badge tone={REGIME_TONES[state.name] ?? "neutral"}>{state.score}%</Badge>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-800">
                <div
                  className={`h-full rounded-full ${
                    state.tone === "signal"
                      ? "bg-signal-500"
                      : state.tone === "pulse"
                        ? "bg-pulse-500"
                        : state.tone === "danger"
                          ? "bg-danger-500"
                          : "bg-mist-500"
                  }`}
                  style={{ width: `${state.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </WidgetCard>
  );
}

function RiskScorePanel({ risk }) {
  const factors = Array.isArray(risk?.factors) ? risk.factors : [];

  return (
    <WidgetCard
      eyebrow="Risk score"
      title={`${risk.label} risk`}
      headerRight={<Badge tone={risk.label === "Low" ? "pulse" : risk.label === "High" ? "danger" : "amber"}>{risk.score}/100</Badge>}
      className="lg:col-span-2"
    >
      <div className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="flex justify-center">
            <RadialGauge
              score={risk.score}
              tone={risk.label === "High" ? "danger" : "amber"}
              size={120}
              strokeWidth={10}
            />
          </div>
          <div>
            <p className="text-sm leading-relaxed text-mist-300">{risk.interpretation}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone={risk.label === "Low" ? "pulse" : risk.label === "High" ? "danger" : "amber"}>
                {risk.label}
              </Badge>
              <Badge tone="neutral">0-100 scale</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {factors.map((factor) => (
            <div key={factor.name} className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-mist-500">{factor.name}</span>
                <span className="font-mono text-mist-300">{factor.value}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-800">
                <div
                  className={`h-full rounded-full ${
                    factor.tone === "pulse"
                      ? "bg-pulse-500"
                      : factor.tone === "danger"
                        ? "bg-danger-500"
                        : "bg-amber-500"
                  }`}
                  style={{ width: `${factor.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </WidgetCard>
  );
}

function StrategyOutputPanel({ agent }) {
  return (
    <WidgetCard
      eyebrow="Strategy output"
      title="Execution plan"
      headerRight={<Badge tone="pulse">{agent.confidenceScore}/100 confidence</Badge>}
      className="lg:col-span-2"
    >
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Metric label="Confidence score" value={`${agent.confidenceScore}/100`} />
          <Metric label="Position sizing" value={agent.profileLabel} />
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
            <p className="label-eyebrow">Entry recommendation</p>
            <p className="mt-2 text-sm leading-relaxed text-mist-300">{agent.entryStrategy}</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
            <p className="label-eyebrow">Exit recommendation</p>
            <p className="mt-2 text-sm leading-relaxed text-mist-300">{agent.exitStrategy}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
          <p className="label-eyebrow">Thesis</p>
          <p className="mt-2 text-sm leading-relaxed text-mist-300">{agent.reasoningSummary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(agent.prioritizedWatchlist ?? []).map((item) => (
              <Badge key={item.name} tone={item.tone ?? "signal"}>
                #{item.rank} {item.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}

function AiStrategyOutputPanel({ snapshot, agent }) {
  const dominantNarrative = snapshot.narratives.dominantNarrative.name;
  const marketRegime = snapshot.regime.active;
  const riskScore = snapshot.risk.score;
  const riskLabel = snapshot.risk.label;
  const confidenceScore = agent.confidenceScore;
  const reasons = [
    agent.reasoningSummary,
    agent.entryStrategy,
    agent.exitStrategy,
    agent.riskNotes[0],
  ].filter(Boolean);

  return (
    <WidgetCard
      eyebrow="AI strategy output"
      title="CMC strategy synthesis"
      headerRight={<Badge tone="pulse">{confidenceScore}/100 confidence</Badge>}
      className="lg:col-span-4"
    >
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Dominant Narrative" value={dominantNarrative} />
            <Metric label="Market Regime" value={marketRegime} />
            <Metric label="Risk Score" value={`${riskScore}/100 (${riskLabel})`} />
            <Metric label="Confidence Score" value={`${confidenceScore}/100`} />
          </div>

          <div className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
            <p className="label-eyebrow">Recommended Strategy</p>
            <p className="mt-2 text-sm leading-relaxed text-mist-300">{agent.reasoningSummary}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/5 bg-ink-850 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-mist-500">Entry</p>
                <p className="mt-1.5 text-sm leading-relaxed text-mist-100">
                  {agent.entryStrategy}
                </p>
              </div>
              <div className="rounded-xl border border-white/5 bg-ink-850 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-mist-500">Exit</p>
                <p className="mt-1.5 text-sm leading-relaxed text-mist-100">
                  {agent.exitStrategy}
                </p>
              </div>
              <div className="rounded-xl border border-white/5 bg-ink-850 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-mist-500">Sizing</p>
                <p className="mt-1.5 text-sm leading-relaxed text-mist-100">
                  {agent.profileLabel} / {agent.holdingLabel}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
            <p className="label-eyebrow">Why this strategy?</p>
            <ul className="mt-3 space-y-3">
              {reasons.map((reason) => (
                <li key={reason} className="flex gap-2 text-sm leading-relaxed text-mist-300">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pulse-500" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

          <div className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="label-eyebrow">Service layer snapshot</p>
                <h3 className="mt-2 font-display text-lg font-semibold text-mist-100">
                  {snapshot.source}
                </h3>
              </div>
              <Badge tone={getConnectionTone(snapshot.connectionStatus)}>
                {snapshot.connectionStatus}
              </Badge>
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-white/5 bg-ink-850 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-mist-500">
                  Dominant Narrative
                </p>
                <p className="mt-1.5 text-sm font-medium text-mist-100">
                  {snapshot.narratives.dominantNarrative.summary}
                </p>
              </div>
              <div className="rounded-xl border border-white/5 bg-ink-850 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-mist-500">
                  Market Regime
                </p>
                <p className="mt-1.5 text-sm font-medium text-mist-100">
                  {snapshot.regime.summary}
                </p>
              </div>
              <div className="rounded-xl border border-white/5 bg-ink-850 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-mist-500">
                  Risk Score
                </p>
                <p className="mt-1.5 text-sm font-medium text-mist-100">
                  {snapshot.risk.description}
                </p>
              </div>
            </div>
        </div>
      </div>
    </WidgetCard>
  );
}

export default function StrategyDashboard() {
  const [snapshot, setSnapshot] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [refreshToken, setRefreshToken] = useState(0);
  const [riskProfile, setRiskProfile] = useState("Moderate");
  const [holdingPeriod, setHoldingPeriod] = useState("1 Week");
  const [capitalAmount, setCapitalAmount] = useState(50000);
  const [decisionLog, setDecisionLog] = useState([]);
  const lastDecisionSignatureRef = useRef("");
  const [architectureOpen, setArchitectureOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    setStatus("loading");
    setError("");

    loadStrategyPlatformSnapshot({ signal: controller.signal })
      .then((data) => {
        setSnapshot(data);
        setStatus("ready");
      })
      .catch((nextError) => {
        if (controller.signal.aborted) {
          return;
        }

        setError(nextError instanceof Error ? nextError.message : "Unknown error");
        setStatus("error");
      });

    return () => controller.abort();
  }, [refreshToken]);

  const updatedAt = formatDashboardTimestamp(snapshot?.updatedAt);
  const agent = snapshot
    ? buildNarrativeRotationAgent(snapshot, {
        riskProfile,
        holdingPeriod,
        capitalAmount,
      })
    : null;
  const handleGenerateReport = () => {
    if (!snapshot || !agent) {
      return;
    }

    const generatedAt = new Date().toISOString();
    const report = buildNarrativeRotationReportMarkdown({ snapshot, agent, generatedAt });
    const datePart = generatedAt.slice(0, 10);
    downloadTextFile(`narrativex-agent-report-${datePart}.md`, report);
  };

  useEffect(() => {
    if (!snapshot || !agent) {
      return;
    }

    const signature = `${riskProfile}|${holdingPeriod}|${capitalAmount}`;
    if (lastDecisionSignatureRef.current === signature) {
      return;
    }

    lastDecisionSignatureRef.current = signature;
    setDecisionLog((current) => [
      {
        id: `${signature}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        dominantNarrative: agent.dominantNarrative,
        confidence: agent.confidenceScore,
        allocationSummary: buildDecisionSummary(agent),
        riskLabel: snapshot.risk?.label ?? "Unknown",
        allocations: buildAllocationBreakdown(agent),
      },
      ...current,
    ].slice(0, 5));
  }, [snapshot, agent, riskProfile, holdingPeriod, capitalAmount]);

  if (status === "loading") {
    return (
      <div className="space-y-5">
        <div className="rounded-[28px] border border-white/5 bg-white/[0.03] p-6">
          <div className="h-4 w-44 rounded-full bg-white/10" />
          <div className="mt-4 h-9 w-80 rounded-full bg-white/10" />
          <div className="mt-4 h-4 w-full max-w-3xl rounded-full bg-white/10" />
        </div>
        <LoadingState />
      </div>
    );
  }

  if (status === "error") {
    return <ErrorState error={error} onRetry={() => setRefreshToken((value) => value + 1)} />;
  }

  return (
    <section className="container-shell py-10">
      <NarrativeRotationAgentPanel
        snapshot={snapshot}
        agent={agent}
        riskProfile={riskProfile}
        holdingPeriod={holdingPeriod}
        capitalAmount={capitalAmount}
        setRiskProfile={setRiskProfile}
        setHoldingPeriod={setHoldingPeriod}
        setCapitalAmount={setCapitalAmount}
        onGenerateReport={handleGenerateReport}
      />

      <NarrativeXArchitectureModal
        open={architectureOpen}
        onClose={() => setArchitectureOpen(false)}
      />

      <div className="mt-5">
        <AgentDecisionLogPanel decisions={decisionLog} />
      </div>

      <div className="mt-5">
        <WhyThisAllocationPanel snapshot={snapshot} agent={agent} />
      </div>

      <div className="mt-5">
        <NarrativeRotationChangesPanel decisions={decisionLog} snapshot={snapshot} />
      </div>

      <div className="rounded-[28px] border border-white/5 bg-ink-850/70 px-6 py-6 shadow-card sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="label-eyebrow text-signal-400">Strategy snapshot</span>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-mist-100 sm:text-4xl">
              Live portfolio posture
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-mist-500">
              Current data source, connection status, and update timestamp are shown below alongside
              the live narrative, regime, and risk readings.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setArchitectureOpen(true)}
              className="rounded-full border border-signal-400/20 bg-signal-500/10 px-4 py-2 text-xs font-medium tracking-[0.16em] text-signal-300 transition hover:-translate-y-0.5 hover:bg-signal-500/15"
            >
              How NarrativeX Works
            </button>
            <Badge tone={getSourceTone(snapshot.source)}>{snapshot.source}</Badge>
            <Badge tone={getSourceTone(snapshot.source)}>{getModeBadgeLabel(snapshot.source)}</Badge>
            <Badge tone={getConnectionTone(snapshot.connectionStatus)}>{snapshot.connectionStatus}</Badge>
            <Badge tone="neutral">
              {updatedAt}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-4">
        <NarrativeAnalysisPanel
          narratives={snapshot.narratives}
          watchlist={snapshot.narrativeWatchlist}
        />
        <NarrativeRotationPanel narratives={snapshot.narratives} />
        <MarketRegimePanel regime={snapshot.regime} />
        <RiskScorePanel risk={snapshot.risk} />
        <NarrativeHeatmapPanel heatmap={snapshot.narrativeHeatmap ?? []} />
        <NarrativeTimelinePanel timeline={snapshot.narratives.narrativeTimeline ?? []} />
        <NarrativeExplanationPanel explanation={snapshot.narratives.narrativeExplanation} />
        <StrategyOutputPanel agent={agent} />
        <AiStrategyOutputPanel snapshot={snapshot} agent={agent} />
      </div>
    </section>
  );
}
