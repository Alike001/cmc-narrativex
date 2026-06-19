import { NextResponse } from "next/server";
import { CmcApiError, getGlobalMetrics } from "@/lib/cmc";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const globalMetrics = await getGlobalMetrics();

    return NextResponse.json(
      {
        platform: globalMetrics.source,
        endpoint: "regime",
        updatedAt: globalMetrics.updatedAt,
        data: {
          marketRegimePanel: globalMetrics.marketRegime,
          legacy: globalMetrics.metrics,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load CoinMarketCap regime data.";
    const status = error instanceof CmcApiError ? error.statusCode : 502;

    return NextResponse.json(
      {
        platform: "CoinMarketCap API",
        endpoint: "regime",
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
