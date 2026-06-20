import { NextResponse } from "next/server";
import { createFallbackGlobalMetrics, getGlobalMetrics } from "@/lib/cmc";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const globalMetrics = await getGlobalMetrics();

    return NextResponse.json(
      {
        platform: "CMC NarrativeX Agent",
        source: globalMetrics.source,
        connectionStatus: globalMetrics.connectionStatus,
        dataSource: globalMetrics.dataSource,
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
        platform: "CMC NarrativeX Agent",
        source: globalMetrics.source,
        connectionStatus: globalMetrics.connectionStatus,
        dataSource: globalMetrics.dataSource,
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
