import { NextResponse } from "next/server";
import { getStrategySnapshot } from "@/lib/cmc";

export const dynamic = "force-dynamic";

export async function GET() {
  const strategy = await getStrategySnapshot();

  return NextResponse.json(
    {
      platform: strategy.platform ?? "CMC NarrativeX Agent",
      source: strategy.source,
      connectionStatus: strategy.connectionStatus,
      dataSource: strategy.dataSource,
      endpoint: "strategy",
      updatedAt: strategy.updatedAt,
      data: strategy,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
