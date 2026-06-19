import { NextResponse } from "next/server";
import { riskScore } from "@/lib/mockData";

export const dynamic = "force-dynamic";

export async function GET() {
  const riskScorePanel = {
    score: riskScore.score,
    label: riskScore.score < 35 ? "Low" : riskScore.score < 70 ? "Medium" : "High",
    interpretation:
      riskScore.score < 50
        ? "Position sizing can stay constructive, but leverage should remain contained."
        : "Risk is elevated enough to justify tighter stops and smaller adds.",
    factors: riskScore.factors,
    thresholds: {
      low: 30,
      medium: 60,
      high: 80,
    },
  };

  return NextResponse.json({
    platform: "CMC NarrativeX",
    endpoint: "risk",
    updatedAt: new Date().toISOString(),
    data: {
      riskScorePanel,
      legacy: {
        score: riskScore.score,
        label: riskScore.label,
        description: riskScore.description,
        factors: riskScore.factors,
      },
    },
  }, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
