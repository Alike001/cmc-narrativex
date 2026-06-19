import { NextResponse } from "next/server";
import { marketRegime } from "@/lib/mockData";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    platform: "CMC NarrativeX",
    endpoint: "regime",
    updatedAt: new Date().toISOString(),
    data: {
      regime: marketRegime.regime,
      since: marketRegime.since,
      volatility: marketRegime.volatility,
      liquidity: marketRegime.liquidity,
      breadth: marketRegime.breadth,
      description: marketRegime.description,
      sentimentBias: "risk-on",
      marketPhase: "expansion",
      nextShiftWatch: ["BTC dominance", "perp funding", "ETH/BTC rotation"],
    },
  }, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
