import { NextResponse } from "next/server";
import { CmcApiError, getTrendingNarratives } from "@/lib/cmc";

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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load CoinMarketCap narratives.";
    const status = error instanceof CmcApiError ? error.statusCode : 502;

    return NextResponse.json(
      {
        platform: "CoinMarketCap API",
        endpoint: "narratives",
        error: message,
      },
      {
        status,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
