import { NextResponse } from "next/server";
import { createFallbackGlobalMetrics, getGlobalMetrics } from "@/lib/cmc";

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
  } catch {
    const globalMetrics = createFallbackGlobalMetrics();

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
  }
}
