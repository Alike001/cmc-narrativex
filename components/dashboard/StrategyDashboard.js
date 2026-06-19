"use client";

import { useEffect, useState } from "react";
import WidgetCard from "@/components/dashboard/WidgetCard";
import Badge from "@/components/ui/Badge";
import PulseLine from "@/components/ui/PulseLine";
import RadialGauge from "@/components/ui/RadialGauge";
import {
  getCoinMarketCapMcpPlan,
  loadStrategyPlatformSnapshot,
} from "@/lib/strategy-platform";

const REGIME_TONES = {
  Bull: "signal",
  Bear: "danger",
  Sideways: "neutral",
  Panic: "danger",
  Euphoria: "pulse",
};

function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-xl bg-white/5 ${className}`} />;
}

function LoadingState() {
  return (
    <div className="grid gap-5 lg:grid-cols-4">
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

function buildWhyThisStrategy(snapshot) {
  const narrative = snapshot.narratives.dominantNarrative;
  const regime = snapshot.regime;
  const risk = snapshot.risk;
  const newsItem = snapshot.news?.[0];
  const newsTitle = newsItem?.title ?? "recent market headlines";

  return [
    `Narrative strength is ${narrative.strength}/100, with ${narrative.momentum.toLowerCase()} momentum and strong agreement across social, on-chain, and price signals.`,
    `The market is in a ${regime.active.toLowerCase()} regime, and the supporting breadth, liquidity, and sentiment backdrop still favors trend continuation.`,
    `Risk is ${risk.label.toLowerCase()} at ${risk.score}/100, which supports a constructive stance but still argues for disciplined sizing.`,
    `Latest news flow is centered on ${newsTitle}, reinforcing the same theme instead of fighting it.`,
  ];
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
          {risk.factors.map((factor) => (
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

function StrategyOutputPanel({ strategy }) {
  return (
    <WidgetCard
      eyebrow="Strategy output"
      title="Execution plan"
      headerRight={<Badge tone="pulse">{strategy.confidenceLabel}</Badge>}
      className="lg:col-span-2"
    >
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Metric label="Confidence score" value={`${strategy.confidenceScore}/100`} />
          <Metric label="Position sizing" value={strategy.positionSizing} />
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
            <p className="label-eyebrow">Entry recommendation</p>
            <p className="mt-2 text-sm leading-relaxed text-mist-300">{strategy.entryRecommendation}</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
            <p className="label-eyebrow">Exit recommendation</p>
            <p className="mt-2 text-sm leading-relaxed text-mist-300">{strategy.exitRecommendation}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-ink-850/70 p-4">
          <p className="label-eyebrow">Thesis</p>
          <p className="mt-2 text-sm leading-relaxed text-mist-300">{strategy.thesis}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {strategy.watchlist.map((asset) => (
              <Badge key={asset} tone="signal">
                {asset}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}

function AiStrategyOutputPanel({ snapshot }) {
  const dominantNarrative = snapshot.narratives.dominantNarrative.name;
  const marketRegime = snapshot.regime.active;
  const riskScore = snapshot.risk.score;
  const riskLabel = snapshot.risk.label;
  const recommendedStrategy = snapshot.strategy.thesis;
  const confidenceScore = snapshot.strategy.confidenceScore;
  const reasons = buildWhyThisStrategy(snapshot);

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
            <p className="mt-2 text-sm leading-relaxed text-mist-300">
              {recommendedStrategy}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/5 bg-ink-850 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-mist-500">Entry</p>
                <p className="mt-1.5 text-sm leading-relaxed text-mist-100">
                  {snapshot.strategy.entryRecommendation}
                </p>
              </div>
              <div className="rounded-xl border border-white/5 bg-ink-850 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-mist-500">Exit</p>
                <p className="mt-1.5 text-sm leading-relaxed text-mist-100">
                  {snapshot.strategy.exitRecommendation}
                </p>
              </div>
              <div className="rounded-xl border border-white/5 bg-ink-850 p-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-mist-500">Sizing</p>
                <p className="mt-1.5 text-sm leading-relaxed text-mist-100">
                  {snapshot.strategy.positionSizing}
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
                CoinMarketCap-backed
              </h3>
            </div>
            <Badge tone="signal">Live mock</Badge>
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

  const mcpPlan = getCoinMarketCapMcpPlan();
  const updatedAt = new Date(snapshot.updatedAt);

  return (
    <section className="container-shell py-10">
      <div className="rounded-[28px] border border-white/5 bg-ink-850/70 px-6 py-6 shadow-card sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="label-eyebrow text-signal-400">Strategy platform</span>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-mist-100 sm:text-4xl">
              CMC NarrativeX AI strategy board
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-mist-500">
              The platform now loads a normalized strategy snapshot from the mock API layer and
              is structured so the data source can move to CoinMarketCap MCP without changing the
              dashboard panels.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge tone="pulse">{snapshot.source}</Badge>
            <Badge tone="signal">{mcpPlan.provider}</Badge>
            <Badge tone="neutral">
              Updated {updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-4">
        <NarrativeAnalysisPanel
          narratives={snapshot.narratives}
          watchlist={snapshot.narrativeWatchlist}
        />
        <MarketRegimePanel regime={snapshot.regime} />
        <RiskScorePanel risk={snapshot.risk} />
        <StrategyOutputPanel strategy={snapshot.strategy} />
        <AiStrategyOutputPanel snapshot={snapshot} />
      </div>
    </section>
  );
}
