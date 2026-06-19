import { NextResponse } from "next/server";
import {
  currentNarrative,
  previousNarrative,
  narrativeSequence,
} from "@/lib/mockData";

export const dynamic = "force-dynamic";

export async function GET() {
  const narrativeAnalysis = {
    dominantNarrative: {
      name: currentNarrative.title,
      status: "Dominant",
      strength: currentNarrative.strength,
      momentum: currentNarrative.momentum,
      detectedAt: currentNarrative.detectedAt,
      summary: currentNarrative.summary,
      assets: currentNarrative.relatedAssets,
      drivers: currentNarrative.signals,
    },
    previousNarrative: {
      name: previousNarrative.title,
      status: "Rotating out",
      fadedAt: previousNarrative.fadedAt,
      duration: previousNarrative.duration,
      peakConfidence: previousNarrative.peakConfidence,
      summary: previousNarrative.summary,
      assets: previousNarrative.relatedAssets,
    },
    narrativeStrength: {
      score: currentNarrative.strength,
      label: currentNarrative.strength >= 80 ? "Strong" : "Building",
      trend: "+8 vs 24h ago",
      socialAgreement: 91,
      onchainConfirmation: 84,
      priceConfirmation: 79,
    },
  };

  return NextResponse.json({
    platform: "CMC NarrativeX",
    endpoint: "narratives",
    updatedAt: new Date().toISOString(),
    data: {
      narrativeAnalysis,
      watchlist: narrativeSequence.map((name, index) => ({
        name,
        rank: index + 1,
        momentum: index < 2 ? "rising" : "watching",
      })),
    },
  }, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
