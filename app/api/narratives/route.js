import { NextResponse } from "next/server";
import { createFallbackNarratives, getTrendingNarratives } from "@/lib/cmc";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const narrative = await getTrendingNarratives();

    return NextResponse.json(
      {
        platform: narrative.source,
        endpoint: "narratives",
        updatedAt: narrative.updatedAt,
        data: {
          narrativeAnalysis: {
            dominantNarrative: narrative.dominantNarrative,
            previousNarrative: narrative.previousNarrative,
            narrativeStrength: narrative.narrativeStrength,
          },
          watchlist: narrative.watchlist,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    const narrative = createFallbackNarratives();

    return NextResponse.json(
      {
        platform: narrative.source,
        endpoint: "narratives",
        updatedAt: narrative.updatedAt,
        data: {
          narrativeAnalysis: {
            dominantNarrative: narrative.dominantNarrative,
            previousNarrative: narrative.previousNarrative,
            narrativeStrength: narrative.narrativeStrength,
          },
          watchlist: narrative.watchlist,
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
