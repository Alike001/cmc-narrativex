const STRATEGY_API_ENDPOINTS = {
  narratives: "/api/narratives",
  regime: "/api/regime",
  risk: "/api/risk",
  strategy: "/api/strategy",
};

function buildFallbackSnapshot() {
  return {
    platform: "CMC NarrativeX Agent",
    source: "CoinMarketCap Free Plan",
    updatedAt: new Date().toISOString(),
    integration: buildMcpReadyAdapter(),
    narratives: {
      dominantNarrative: {
        name: "AI & Big Data Narrative",
        status: "Dominant",
        strength: 84,
        momentum: "Building",
        detectedAt: "Updated recently",
        summary:
          "AI infrastructure, agent, and compute tokens continue to attract the strongest share of attention across the market.",
        assets: ["FET", "TAO", "RNDR", "AKT", "NEAR"],
        drivers: [
          { label: "Tracked category", value: "AI & Big Data" },
          { label: "24h move", value: "+7.8%" },
          { label: "Volume impulse", value: "+18.4%" },
        ],
      },
      previousNarrative: {
        name: "Real World Assets",
        status: "Rotating out",
        fadedAt: "Faded from the top of the tape in the last 24h",
        duration: "Held attention for 2-4 sessions",
        peakConfidence: 77,
        summary:
          "Community attention is drifting away from tokenized credit and treasury rails as the market concentrates on the current leader.",
        assets: ["ONDO", "CFG", "POLYX", "MKR", "OM"],
      },
      narrativeStrength: {
        score: 84,
        label: "Strong",
        trend: "+7.8%",
        socialAgreement: 88,
        onchainConfirmation: 82,
        priceConfirmation: 78,
      },
      narrativeRotationScore: {
        score: 82,
        label: "Strong",
        drivers: [
          { label: "Market cap change", value: "+9.2%" },
          { label: "Volume change", value: "+18.4%" },
          { label: "Avg. price change", value: "+7.8%" },
        ],
      },
      narrativeLifecycle: {
        state: "Dominant",
        description: "The category is leading on both price and liquidity and remains the active tape.",
        nextState: "Exhausting",
      },
      narrativeHeatmap: [
        { rank: 1, name: "AI & Big Data", score: 84, lifecycle: "Dominant", avgPriceChange: "+7.8%", marketCapChange: "+9.2%", volumeChange: "+18.4%" },
        { rank: 2, name: "Memes", score: 72, lifecycle: "Building", avgPriceChange: "+11.4%", marketCapChange: "+15.7%", volumeChange: "+21.8%" },
      ],
      narrativeTimeline: [
        { stage: "detected", title: "Detected", detail: "Entered the live rotation set.", value: "Updated recently" },
        { stage: "strengthening", title: "Strengthening", detail: "Volume and market cap were confirming.", value: "Rotation score 82/100" },
        { stage: "peak", title: "Peak", detail: "Peak conviction is reached when breadth, liquidity, and price move together.", value: "Dominant" },
        { stage: "fading", title: "Fading", detail: "Watch for narrowing breadth or softening volume before the category rotates lower.", value: "Exhausting" },
      ],
      narrativeExplanation: {
        title: "Why this narrative matters",
        summary: "AI & Big Data remains the leading category because market cap, volume, and price change are still aligned.",
        bullets: [
          "AI & Big Data is moving on real capital rotation: market cap change is +9.2% and volume change is +18.4%.",
          "Average price change of +7.8% shows the move is being confirmed across the basket rather than by one outlier.",
          "Rotation score sits at 82/100, placing the narrative in a dominant lifecycle phase.",
          "The move matters because momentum and liquidity are aligned, which typically keeps institutional flows focused until breadth starts to roll over.",
        ],
      },
    },
    narrativeWatchlist: [
      { name: "AI & Big Data", rank: 1, momentum: "rising" },
      { name: "Smart Contract Platform", rank: 2, momentum: "rising" },
      { name: "Memes", rank: 3, momentum: "watching" },
      { name: "Layer 2", rank: 4, momentum: "watching" },
      { name: "DeFi", rank: 5, momentum: "watching" },
    ],
    narrativeHeatmap: [
      { rank: 1, name: "AI & Big Data", score: 84, lifecycle: "Dominant", avgPriceChange: "+7.8%", marketCapChange: "+9.2%", volumeChange: "+18.4%" },
      { rank: 2, name: "Memes", score: 72, lifecycle: "Building", avgPriceChange: "+11.4%", marketCapChange: "+15.7%", volumeChange: "+21.8%" },
      { rank: 3, name: "Smart Contract Platform", score: 69, lifecycle: "Building", avgPriceChange: "+3.1%", marketCapChange: "+4.8%", volumeChange: "+11.1%" },
    ],
    regime: {
      active: "Bull",
      summary:
        "Risk appetite is constructive with BTC dominance near 51.0% and the Fear and Greed index at 67.",
      catalyst: "Liquidity is rotating into majors and AI-linked beta first.",
      states: [
        { name: "Bull", score: 77, note: "Trend and breadth are constructive", tone: "signal" },
        { name: "Bear", score: 36, note: "Sell pressure is present but not absolute", tone: "danger" },
        { name: "Sideways", score: 43, note: "The market lacks a decisive break", tone: "neutral" },
        { name: "Panic", score: 21, note: "Stress rises as sentiment falls", tone: "danger" },
        { name: "Euphoria", score: 61, note: "Speculative heat is elevated", tone: "pulse" },
      ],
      supportLevels: [
        "BTC dominance at 51.0%",
        "Fear and Greed at 67",
        "Altcoin Season Index at 58",
      ],
    },
    risk: {
      score: 43,
      label: "Medium",
      interpretation:
        "Risk is manageable, but momentum can fade quickly if breadth rolls over.",
      factors: [
        { name: "Fear and Greed", value: 67, tone: "pulse" },
        { name: "Altcoin Season", value: 58, tone: "amber" },
        { name: "BTC Dominance", value: 51, tone: "pulse" },
        { name: "Market Breadth", value: 62, tone: "pulse" },
      ],
      thresholds: {
        low: 30,
        medium: 60,
        high: 80,
      },
      description:
        "Risk is manageable, but momentum can fade quickly if breadth rolls over.",
    },
    strategy: {
      confidenceScore: 74,
      confidenceLabel: "Medium confidence",
      entryRecommendation:
        "Scale into AI & Big Data, Smart Contract Platform, Memes on pullbacks while the bull regime stays intact.",
      exitRecommendation:
        "Exit if the narrative falls out of the top rotation list or the regime flips to Bear or Panic.",
      positionSizing: "0.75x to 1.0x base size",
      thesis:
        "AI infrastructure continues to lead while global sentiment remains greedy. Keep the portfolio aligned with the dominant narrative and size for a moderate-risk environment.",
      watchlist: ["AI & Big Data", "Smart Contract Platform", "Memes"],
    },
    news: [
      {
        id: "ai-big-data-lead",
        title: "AI & Big Data continues to lead the tape with a +7.8% 24h move and broad follow-through",
        summary:
          "AI infrastructure, agent, and compute tokens continue to attract the strongest share of attention across the market.",
        url: "",
        source: "CoinMarketCap Free Plan",
        publishedAt: new Date().toISOString(),
        symbols: ["FET", "TAO", "RNDR", "AKT", "NEAR"],
        categories: ["AI & Big Data"],
      },
    ],
  };
}

function noStoreInit(signal) {
  return {
    signal,
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  };
}

async function fetchJson(path, signal) {
  const response = await fetch(path, noStoreInit(signal));

  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function buildMcpReadyAdapter() {
  return {
    adapter: "mock-api",
    provider: "CoinMarketCap MCP ready",
    status: "prepared",
    notes: [
      "Swap the endpoint resolver to MCP resources when the CoinMarketCap transport is available.",
      "Keep the dashboard panels unchanged; only the data source adapter should move.",
      "Normalize MCP payloads to this same snapshot shape to avoid UI churn.",
    ],
  };
}

export function getCoinMarketCapMcpPlan() {
  return buildMcpReadyAdapter();
}

export async function loadStrategyPlatformSnapshot({ signal } = {}) {
  try {
    const [narratives, regime, risk, strategy] = await Promise.all([
      fetchJson(STRATEGY_API_ENDPOINTS.narratives, signal),
      fetchJson(STRATEGY_API_ENDPOINTS.regime, signal),
      fetchJson(STRATEGY_API_ENDPOINTS.risk, signal),
      fetchJson(STRATEGY_API_ENDPOINTS.strategy, signal),
    ]);

    return {
      platform: narratives.platform ?? "CMC NarrativeX Agent",
      source: "Mock API",
      updatedAt:
        strategy.updatedAt ??
        narratives.updatedAt ??
        regime.updatedAt ??
        risk.updatedAt ??
        new Date().toISOString(),
      integration: buildMcpReadyAdapter(),
      narratives: narratives.data?.narrativeAnalysis,
      narrativeWatchlist: narratives.data?.watchlist ?? [],
      narrativeHeatmap: narratives.data?.narrativeHeatmap ?? [],
      regime: regime.data?.marketRegimePanel,
      risk: risk.data?.riskScorePanel,
      strategy: strategy.data?.strategyOutputPanel,
      news: strategy.data?.news ?? [],
    };
  } catch {
    return buildFallbackSnapshot();
  }
}

export { STRATEGY_API_ENDPOINTS };
