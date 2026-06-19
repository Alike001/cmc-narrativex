const STRATEGY_API_ENDPOINTS = {
  narratives: "/api/narratives",
  regime: "/api/regime",
  risk: "/api/risk",
  strategy: "/api/strategy",
};

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
  const [narratives, regime, risk, strategy] = await Promise.all([
    fetchJson(STRATEGY_API_ENDPOINTS.narratives, signal),
    fetchJson(STRATEGY_API_ENDPOINTS.regime, signal),
    fetchJson(STRATEGY_API_ENDPOINTS.risk, signal),
    fetchJson(STRATEGY_API_ENDPOINTS.strategy, signal),
  ]);

  return {
    platform: narratives.platform ?? "CMC NarrativeX",
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
    regime: regime.data?.marketRegimePanel,
    risk: risk.data?.riskScorePanel,
    strategy: strategy.data?.strategyOutputPanel,
  };
}

export { STRATEGY_API_ENDPOINTS };
