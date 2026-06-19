import { NextResponse } from "next/server";
import { marketRegime } from "@/lib/mockData";

export const dynamic = "force-dynamic";

export async function GET() {
  const marketRegimePanel = {
    active: "Bull",
    summary: "Risk-on expansion with improving breadth and stable funding.",
    catalyst: "Liquidity is rotating into majors and AI-linked beta first.",
    states: [
      { name: "Bull", score: 84, note: "Trend and breadth are supportive", tone: "signal" },
      { name: "Bear", score: 11, note: "Sell pressure is contained", tone: "danger" },
      { name: "Sideways", score: 28, note: "Range compression remains possible", tone: "neutral" },
      { name: "Panic", score: 6, note: "No capitulation signal in spot flow", tone: "danger" },
      { name: "Euphoria", score: 19, note: "Speculative heat is elevated but not extreme", tone: "pulse" },
    ],
    supportLevels: [
      "BTC above 50D average",
      "ETH/BTC trend holding",
      "Funding rates staying positive but contained",
    ],
  };

  return NextResponse.json({
    platform: "CMC NarrativeX",
    endpoint: "regime",
    updatedAt: new Date().toISOString(),
    data: {
      marketRegimePanel,
      legacy: {
        regime: marketRegime.regime,
        since: marketRegime.since,
        volatility: marketRegime.volatility,
        liquidity: marketRegime.liquidity,
        breadth: marketRegime.breadth,
        description: marketRegime.description,
      },
    },
  }, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
