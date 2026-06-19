import { NextResponse } from "next/server";
import { createFallbackGlobalMetrics, createFallbackNarratives, createFallbackLatestNews, getStrategySnapshot } from "@/lib/cmc";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const strategy = await getStrategySnapshot();

    return NextResponse.json(
      {
        platform: strategy.source,
        endpoint: "strategy",
        updatedAt: strategy.updatedAt,
        data: {
          strategyOutputPanel: strategy.strategyOutputPanel,
          news: strategy.news,
          legacy: strategy.legacy,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    const narratives = createFallbackNarratives();
    const globalMetrics = createFallbackGlobalMetrics();
    const news = createFallbackLatestNews();
    const riskScore = globalMetrics.riskScore.score;
    const confidenceScore = Math.round(
      narratives.narrativeStrength.score * 0.6 + (100 - riskScore) * 0.4,
    );
    const activeRegime = globalMetrics.marketRegime.active;
    const topCoins = narratives.watchlist.slice(0, 3).map((item) => item.name);
    const topCoinsLabel = topCoins.length > 0 ? topCoins.join(", ") : "top-ranked assets";
    const topHeadline = news[0]?.title ?? "Market attention remains concentrated";
    const strategyOutputPanel = {
      confidenceScore,
      confidenceLabel: confidenceScore >= 80 ? "High confidence" : "Medium confidence",
      entryRecommendation:
        activeRegime === "Panic"
          ? "Wait for confirmation before adding exposure; only scale in after volatility cools and market breadth stabilizes."
          : `Scale into ${topCoinsLabel} on pullbacks while the ${activeRegime.toLowerCase()} regime stays intact.`,
      exitRecommendation:
        activeRegime === "Euphoria"
          ? "Take profits faster and tighten stops as speculative heat expands."
          : "Exit if the narrative falls out of the top rotation list or the regime flips to Bear or Panic.",
      positionSizing:
        confidenceScore >= 80
          ? "1.0x to 1.25x base size"
          : confidenceScore >= 65
            ? "0.75x to 1.0x base size"
            : "0.5x to 0.75x base size",
      thesis: `${topHeadline}. Keep the portfolio aligned with ${narratives.dominantNarrative.name} while global sentiment remains ${globalMetrics.metrics.fearAndGreedLabel.toLowerCase()}.`,
      watchlist: topCoins,
    };

    return NextResponse.json(
      {
        platform: globalMetrics.source,
        endpoint: "strategy",
        updatedAt: globalMetrics.updatedAt,
        data: {
          strategyOutputPanel,
          news: news.slice(0, 3),
          legacy: {
            confidenceScore: confidenceScore / 100,
            strategyType: "narrative-following",
            positionBias: activeRegime === "Bear" || activeRegime === "Panic" ? "defensive" : "selective long",
            riskNotes: [
              `Narrative strength sits at ${narratives.narrativeStrength.score}/100.`,
              `Fear and Greed is ${globalMetrics.metrics.fearAndGreedValue} (${globalMetrics.metrics.fearAndGreedLabel}).`,
              topHeadline,
            ],
          },
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
