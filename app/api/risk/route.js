import { NextResponse } from "next/server";
import { createFallbackGlobalMetrics, getGlobalMetrics } from "@/lib/cmc";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const globalMetrics = await getGlobalMetrics();
    const panel = {
      score: globalMetrics.riskScore.score,
      label: globalMetrics.riskScore.label,
      description: globalMetrics.riskScore.interpretation,
      factors: [
        {
          name: "Fear and Greed",
          value: globalMetrics.metrics.fearAndGreedValue,
          tone: globalMetrics.metrics.fearAndGreedValue > 60 ? "pulse" : "amber",
        },
        {
          name: "Altcoin Season",
          value: globalMetrics.metrics.altcoinSeasonIndex,
          tone: globalMetrics.metrics.altcoinSeasonIndex > 75 ? "pulse" : "amber",
        },
        {
          name: "BTC Dominance",
          value: Math.round(globalMetrics.metrics.btcDominance),
          tone: globalMetrics.metrics.btcDominance > 60 ? "amber" : "pulse",
        },
        {
          name: "Market Breadth",
          value: Math.min(100, Math.round((globalMetrics.metrics.activeCryptocurrencies / 5000) * 100)),
          tone: "pulse",
        },
      ],
      thresholds: {
        low: 30,
        medium: 60,
        high: 80,
      },
      interpretation: globalMetrics.riskScore.interpretation,
    };

    return NextResponse.json(
      {
        platform: "CMC NarrativeX Agent",
        source: globalMetrics.source,
        connectionStatus: globalMetrics.connectionStatus,
        dataSource: globalMetrics.dataSource,
        endpoint: "risk",
        updatedAt: globalMetrics.updatedAt,
        data: {
          riskScorePanel: panel,
          legacy: {
            score: panel.score,
            label: panel.label,
            description: panel.description,
            factors: panel.factors,
          },
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
    const panel = {
      score: globalMetrics.riskScore.score,
      label: globalMetrics.riskScore.label,
      description: globalMetrics.riskScore.interpretation,
      factors: [
        {
          name: "Fear and Greed",
          value: globalMetrics.metrics.fearAndGreedValue,
          tone: globalMetrics.metrics.fearAndGreedValue > 60 ? "pulse" : "amber",
        },
        {
          name: "Altcoin Season",
          value: globalMetrics.metrics.altcoinSeasonIndex,
          tone: globalMetrics.metrics.altcoinSeasonIndex > 75 ? "pulse" : "amber",
        },
        {
          name: "BTC Dominance",
          value: Math.round(globalMetrics.metrics.btcDominance),
          tone: globalMetrics.metrics.btcDominance > 60 ? "amber" : "pulse",
        },
        {
          name: "Market Breadth",
          value: Math.min(100, Math.round((globalMetrics.metrics.activeCryptocurrencies / 5000) * 100)),
          tone: "pulse",
        },
      ],
      thresholds: {
        low: 30,
        medium: 60,
        high: 80,
      },
      interpretation: globalMetrics.riskScore.interpretation,
    };

    return NextResponse.json(
      {
        platform: "CMC NarrativeX Agent",
        source: globalMetrics.source,
        connectionStatus: globalMetrics.connectionStatus,
        dataSource: globalMetrics.dataSource,
        endpoint: "risk",
        updatedAt: globalMetrics.updatedAt,
        data: {
          riskScorePanel: panel,
          legacy: {
            score: panel.score,
            label: panel.label,
            description: panel.description,
            factors: panel.factors,
          },
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
