import { NextResponse } from "next/server";
import { generatedStrategy } from "@/lib/mockData";

export const dynamic = "force-dynamic";

export async function GET() {
  const strategyOutputPanel = {
    confidenceScore: 78,
    confidenceLabel: "High confidence",
    entryRecommendation:
      "Scale into AI-compute leaders on pullbacks toward the 4h trend average, then add only after BTC reclaims local resistance.",
    exitRecommendation:
      "Reduce exposure if narrative strength drops below 70 or if the regime flips to Sideways or Bear.",
    positionSizing:
      "Start at 0.75x base size. Expand toward 1.25x only when social, on-chain, and price confirmation stay aligned.",
    thesis:
      "Lean into the AI-agent narrative while it remains dominant, but respect the fact that regime support is improving rather than euphoric.",
    watchlist: [
      "FET",
      "TAO",
      "RNDR",
      "AKT",
    ],
  };

  return NextResponse.json({
    platform: "CMC NarrativeX",
    endpoint: "strategy",
    updatedAt: new Date().toISOString(),
    data: {
      strategyOutputPanel,
      legacy: {
        ...generatedStrategy,
        strategyType: "narrative-following",
        confidenceScore: 0.78,
        positionBias: "selective long",
        riskNotes: [
          "Prefer entries on pullbacks rather than chasing momentum spikes.",
          "Use lower size if funding accelerates across AI-linked perps.",
          "Rotate out of lagging RWA exposure until share-of-voice recovers.",
        ],
      },
    },
  }, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
