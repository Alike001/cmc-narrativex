import { NextResponse } from "next/server";
import {
  currentNarrative,
  previousNarrative,
  narrativeSequence,
} from "@/lib/mockData";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    platform: "CMC NarrativeX",
    endpoint: "narratives",
    updatedAt: new Date().toISOString(),
    data: {
      current: {
        ...currentNarrative,
        status: "active",
        category: "macro-narrative",
        confidenceBand: currentNarrative.strength >= 80 ? "high" : "medium",
      },
      previous: {
        ...previousNarrative,
        status: "expired",
        category: "rotating-out",
      },
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
