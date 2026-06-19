import { NextResponse } from "next/server";
import { generatedStrategy } from "@/lib/mockData";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    platform: "CMC NarrativeX",
    endpoint: "strategy",
    updatedAt: new Date().toISOString(),
    data: {
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
  }, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
