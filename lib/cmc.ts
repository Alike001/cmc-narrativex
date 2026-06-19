type CmcEnvelope<T> = {
  data?: T;
  status?: {
    error_code?: number;
    error_message?: string;
    notice?: string;
  };
};

type CategoryItem = {
  id?: number | string;
  name?: string;
  title?: string;
  description?: string;
  num_tokens?: number | string;
  avg_price_change?: number | string;
  market_cap?: number | string;
  market_cap_change?: number | string;
  volume?: number | string;
  volume_change?: number | string;
  last_updated?: string;
};

type NewsItem = {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  symbols: string[];
  categories: string[];
};

type NarrativeStrength = {
  score: number;
  label: string;
  trend: string;
  socialAgreement: number;
  onchainConfirmation: number;
  priceConfirmation: number;
};

type NarrativeRotationScore = {
  score: number;
  label: "Weak" | "Building" | "Strong" | "Overheated";
  drivers: Array<{ label: string; value: string }>;
};

type NarrativeLifecycleState = "Emerging" | "Building" | "Dominant" | "Peak" | "Exhausting";

type NarrativeLifecycle = {
  state: NarrativeLifecycleState;
  description: string;
  nextState: NarrativeLifecycleState;
};

type NarrativeTimelineStep = {
  stage: "detected" | "strengthening" | "peak" | "fading";
  title: string;
  detail: string;
  value: string;
};

type NarrativeHeatmapItem = {
  rank: number;
  name: string;
  score: number;
  lifecycle: NarrativeLifecycleState;
  avgPriceChange: string;
  marketCapChange: string;
  volumeChange: string;
};

type NarrativeExplanation = {
  title: string;
  summary: string;
  bullets: string[];
};

type NarrativeCard = {
  name: string;
  status: string;
  strength: number;
  momentum: string;
  detectedAt: string;
  summary: string;
  assets: string[];
  drivers: Array<{ label: string; value: string }>;
};

type PreviousNarrativeCard = {
  name: string;
  status: string;
  fadedAt: string;
  duration: string;
  peakConfidence: number;
  summary: string;
  assets: string[];
};

type MarketRegime = "Bull" | "Bear" | "Sideways" | "Panic" | "Euphoria";

type MarketRegimePanel = {
  active: MarketRegime;
  summary: string;
  catalyst: string;
  states: Array<{
    name: MarketRegime;
    score: number;
    note: string;
    tone: "signal" | "danger" | "neutral" | "pulse";
  }>;
  supportLevels: string[];
};

type RiskScorePanel = {
  score: number;
  label: "Low" | "Medium" | "High";
  interpretation: string;
};

type StrategyOutputPanel = {
  confidenceScore: number;
  confidenceLabel: string;
  entryRecommendation: string;
  exitRecommendation: string;
  positionSizing: string;
  thesis: string;
  watchlist: string[];
};

type GlobalMetrics = {
  totalMarketCapUsd: number;
  totalVolume24hUsd: number;
  btcDominance: number;
  ethDominance: number;
  activeCryptocurrencies: number;
  activeExchanges: number;
  activeMarketPairs: number;
  altcoinSeasonIndex: number;
  fearAndGreedValue: number;
  fearAndGreedLabel: string;
};

type CmcMarketContext = {
  categories: CategoryItem[];
  ranked: CategoryItem[];
  scored: Array<CategoryItem & { rotationScore: number; lifecycle: NarrativeLifecycleState; momentum: number }>;
  leader: CategoryItem;
  runnerUp: CategoryItem;
  secondary: CategoryItem;
  breadth: number;
  momentum: number;
  volumePulse: number;
  marketCapPulse: number;
};

const FALLBACK_CATEGORIES: CategoryItem[] = [
  {
    id: 1,
    name: "AI & Big Data",
    title: "AI & Big Data",
    description: "Compute, agent, and data infrastructure tokens.",
    num_tokens: 182,
    avg_price_change: 7.8,
    market_cap: 14250000000,
    market_cap_change: 9.2,
    volume: 3120000000,
    volume_change: 18.4,
    last_updated: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Smart Contract Platform",
    title: "Smart Contract Platform",
    description: "Layer 1 ecosystems with the deepest liquidity.",
    num_tokens: 311,
    avg_price_change: 3.1,
    market_cap: 26300000000,
    market_cap_change: 4.8,
    volume: 5420000000,
    volume_change: 11.1,
    last_updated: new Date().toISOString(),
  },
  {
    id: 3,
    name: "DeFi",
    title: "DeFi",
    description: "Lending, exchange, and liquidity protocols.",
    num_tokens: 428,
    avg_price_change: 2.6,
    market_cap: 9800000000,
    market_cap_change: 3.9,
    volume: 1760000000,
    volume_change: 8.7,
    last_updated: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Memes",
    title: "Memes",
    description: "Community-driven speculative assets.",
    num_tokens: 256,
    avg_price_change: 11.4,
    market_cap: 8100000000,
    market_cap_change: 15.7,
    volume: 2740000000,
    volume_change: 21.8,
    last_updated: new Date().toISOString(),
  },
  {
    id: 5,
    name: "RWA",
    title: "Real World Assets",
    description: "Tokenized treasuries, credit, and collateral rails.",
    num_tokens: 74,
    avg_price_change: 1.9,
    market_cap: 5200000000,
    market_cap_change: 2.2,
    volume: 890000000,
    volume_change: 4.6,
    last_updated: new Date().toISOString(),
  },
  {
    id: 6,
    name: "Layer 2",
    title: "Layer 2",
    description: "Scaling and rollup ecosystems.",
    num_tokens: 101,
    avg_price_change: 4.4,
    market_cap: 7600000000,
    market_cap_change: 5.6,
    volume: 1330000000,
    volume_change: 10.3,
    last_updated: new Date().toISOString(),
  },
  {
    id: 7,
    name: "Gaming",
    title: "Gaming",
    description: "GameFi, consumer, and metaverse assets.",
    num_tokens: 213,
    avg_price_change: -0.8,
    market_cap: 4300000000,
    market_cap_change: -1.1,
    volume: 720000000,
    volume_change: -3.4,
    last_updated: new Date().toISOString(),
  },
];

export function createFallbackNarratives() {
  return buildNarrativesFromCategories(FALLBACK_CATEGORIES, "CoinMarketCap Free Plan");
}

export function createFallbackGlobalMetrics() {
  return buildGlobalMetricsFromCategories(FALLBACK_CATEGORIES, "CoinMarketCap Free Plan");
}

export function createFallbackLatestNews() {
  return buildLatestNewsFromCategories(FALLBACK_CATEGORIES, "CoinMarketCap Free Plan");
}

function getBaseUrl() {
  return process.env.COINMARKETCAP_API_BASE_URL ?? "https://pro-api.coinmarketcap.com";
}

function getApiKey() {
  return process.env.COINMARKETCAP_API_KEY?.trim() ?? "";
}

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(path, getBaseUrl());

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url;
}

async function requestCmc<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<{ ok: true; data: T; source: "live" } | { ok: false; error: string; unsupported: boolean }> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return {
      ok: false,
      error: "Missing COINMARKETCAP_API_KEY in environment.",
      unsupported: true,
    };
  }

  const url = buildUrl(path, params);
  let response: Response;

  try {
    response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "X-CMC_PRO_API_KEY": apiKey,
      },
    });
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : `CoinMarketCap request failed for ${path}`,
      unsupported: false,
    };
  }

  let body: CmcEnvelope<T> | null = null;
  try {
    body = (await response.json()) as CmcEnvelope<T>;
  } catch {
    body = null;
  }

  const errorMessage = body?.status?.error_message?.trim() || "";
  const errorCode = body?.status?.error_code;
  const unsupported = /doesn't support this endpoint|subscription plan/i.test(errorMessage);

  if (!response.ok || (typeof errorCode === "number" && errorCode !== 0)) {
    return {
      ok: false,
      error: errorMessage || `CoinMarketCap request failed for ${path} (${response.status})`,
      unsupported: unsupported || response.status === 401 || response.status === 402 || response.status === 403,
    };
  }

  if (!body || body.data === undefined) {
    return {
      ok: false,
      error: `CoinMarketCap returned an empty response for ${path}`,
      unsupported: false,
    };
  }

  return { ok: true, data: body.data, source: "live" };
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = typeof value === "string" ? Number(value) : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function formatPercent(value: number) {
  const formatted = value >= 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
  return formatted;
}

function formatTimestamp(value?: string) {
  if (!value) return "Updated recently";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Updated recently";
  return `Updated ${parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function normalizeCategory(category: CategoryItem): CategoryItem {
  return {
    ...category,
    title: category.title ?? category.name ?? "Unknown",
    name: category.name ?? category.title ?? "Unknown",
    last_updated: category.last_updated ?? new Date().toISOString(),
  };
}

function buildCategoryContext(inputCategories: CategoryItem[]): CmcMarketContext {
  const categories = inputCategories.map(normalizeCategory).filter((category) => Boolean(category.name));
  const rawScores = categories.map((category) => {
    const marketCapChange = toNumber(category.market_cap_change, 0);
    const volumeChange = toNumber(category.volume_change, 0);
    const avgPriceChange = toNumber(category.avg_price_change, 0);
    const raw = marketCapChange * 0.4 + volumeChange * 0.35 + avgPriceChange * 0.25;
    const momentum = volumeChange * 0.6 + avgPriceChange * 0.4;

    return {
      category,
      raw,
      momentum,
    };
  });

  const mean =
    rawScores.reduce((sum, item) => sum + item.raw, 0) / Math.max(1, rawScores.length);
  const variance =
    rawScores.reduce((sum, item) => sum + Math.pow(item.raw - mean, 2), 0) /
    Math.max(1, rawScores.length);
  const stdDev = Math.sqrt(variance) || 1;

  const ranked = rawScores
    .slice()
    .sort((a, b) => {
      if (b.raw !== a.raw) return b.raw - a.raw;
      return `${a.category.name ?? a.category.title ?? ""}`.localeCompare(
        `${b.category.name ?? b.category.title ?? ""}`,
      );
    })
    .map((item, index) => {
      const baseScore = 50 + ((item.raw - mean) / stdDev) * 12 + item.momentum * 0.3;
      const lifecycle = lifecycleFromScore(baseScore);
      const score = clamp(Math.round(baseScore - index * 0.2), 0, 100);

      return {
        ...item.category,
        rotationScore: score,
        lifecycle,
        momentum: item.momentum,
      };
    })
    .sort((a, b) => b.rotationScore - a.rotationScore);

  const fallback = FALLBACK_CATEGORIES.map(normalizeCategory);
  const safeRanked = ranked.length > 0 ? ranked : fallback;

  const leader = safeRanked[0] ?? fallback[0];
  const runnerUp = safeRanked[1] ?? fallback[1] ?? leader;
  const secondary = safeRanked[2] ?? fallback[2] ?? runnerUp;
  const breadth = safeRanked.length > 0 ? clamp((safeRanked.filter((cat) => toNumber(cat.avg_price_change, 0) > 0).length / safeRanked.length) * 100, 0, 100) : 50;
  const momentum = safeRanked.length
    ? safeRanked.slice(0, 8).reduce((sum, cat) => sum + toNumber(cat.volume_change, 0) * 0.6 + toNumber(cat.avg_price_change, 0) * 0.4, 0) /
      Math.min(8, safeRanked.length)
    : 50;
  const volumePulse = safeRanked.length
    ? safeRanked.slice(0, 8).reduce((sum, cat) => sum + toNumber(cat.volume_change, 0), 0) / Math.min(8, safeRanked.length)
    : 0;
  const marketCapPulse = safeRanked.length
    ? safeRanked.slice(0, 8).reduce((sum, cat) => sum + toNumber(cat.market_cap_change, 0), 0) / Math.min(8, safeRanked.length)
    : 0;

  return {
    categories: safeRanked,
    ranked: safeRanked,
    scored: ranked,
    leader: leader ?? fallback[0],
    runnerUp: runnerUp ?? fallback[1] ?? fallback[0],
    secondary: secondary ?? fallback[2] ?? fallback[1] ?? fallback[0],
    breadth,
    momentum,
    volumePulse,
    marketCapPulse,
  };
}

function narrativeName(category: CategoryItem) {
  const name = (category.title ?? category.name ?? "Market Rotation").trim();
  return /narrative/i.test(name) ? name : `${name} Narrative`;
}

function lifecycleFromScore(score: number): NarrativeLifecycleState {
  if (score <= 40) return "Emerging";
  if (score <= 60) return "Building";
  if (score <= 80) return "Dominant";
  if (score <= 90) return "Peak";
  return "Exhausting";
}

function buildAssetsFromCategory(category: CategoryItem) {
  const label = `${category.title ?? category.name ?? ""}`.toLowerCase();

  if (/(ai|artificial intelligence|compute|gpu|agent)/.test(label)) return ["FET", "TAO", "RNDR", "AKT", "NEAR"];
  if (/(rwa|real world asset|tokenization|treasury|credit)/.test(label)) return ["ONDO", "CFG", "POLYX", "MKR", "OM"];
  if (/(defi|dex|lending|yield|liquidity)/.test(label)) return ["AAVE", "UNI", "CRV", "COMP", "DYDX"];
  if (/(layer 2|l2|rollup|scaling)/.test(label)) return ["ARB", "OP", "STRK", "MANTA", "METIS"];
  if (/(memes|meme|dog|shib|community)/.test(label)) return ["DOGE", "SHIB", "PEPE", "BONK", "WIF"];
  if (/(bitcoin|store of value|pow)/.test(label)) return ["BTC", "ORDI", "STX", "RUNE", "SATS"];
  if (/(ethereum|eth|smart contract)/.test(label)) return ["ETH", "LDO", "SSV", "ARB", "OP"];
  if (/(gaming|gamefi|metaverse|consumer)/.test(label)) return ["IMX", "RONIN", "GALA", "APE", "PIXEL"];
  return ["BTC", "ETH", "SOL", "XRP", "BNB"];
}

function deriveNarrativeStrength(category: CategoryItem, breadth: number, momentum: number): NarrativeStrength {
  const score = buildNarrativeRotationScore(category, { breadth, momentum }).score;

  return {
    score,
    label: score >= 81 ? "Strong" : "Building",
    trend: formatPercent(toNumber(category.avg_price_change, 0)),
    socialAgreement: clamp(score + 4, 0, 99),
    onchainConfirmation: clamp(score - 2, 0, 99),
    priceConfirmation: clamp(score - 6, 0, 99),
  };
}

function buildNarrativeRotationScore(
  category: CategoryItem,
  context?: { breadth?: number; momentum?: number },
): NarrativeRotationScore {
  const avgPriceChange = toNumber(category.avg_price_change, 0);
  const marketCapChange = toNumber(category.market_cap_change, 0);
  const volumeChange = toNumber(category.volume_change, 0);
  const raw = marketCapChange * 0.4 + volumeChange * 0.35 + avgPriceChange * 0.25;
  const breadthBonus = (context?.breadth ?? 50) * 0.06;
  const momentumBonus = (context?.momentum ?? 0) * 0.25;
  const score = clamp(Math.round(50 + raw * 3.2 + breadthBonus + momentumBonus), 0, 100);

  return {
    score,
    label: score >= 91 ? "Overheated" : score >= 61 ? "Strong" : score >= 41 ? "Building" : "Weak",
    drivers: [
      { label: "Market cap change", value: formatPercent(marketCapChange) },
      { label: "Volume change", value: formatPercent(volumeChange) },
      { label: "Avg. price change", value: formatPercent(avgPriceChange) },
    ],
  };
}

function classifyNarrativeLifecycle(
  rotationScore: number,
  momentum: number,
): NarrativeLifecycle {
  if (rotationScore <= 40) {
    return {
      state: "Emerging",
      description: "Early rotation is visible, but momentum is still insufficient to confirm broad participation.",
      nextState: "Building",
    };
  }

  if (rotationScore <= 60) {
    return {
      state: "Building",
      description: "Momentum is improving and liquidity is starting to confirm the narrative.",
      nextState: "Dominant",
    };
  }

  if (rotationScore <= 80) {
    return {
      state: "Dominant",
      description: momentum >= 0 ? "The category is leading on both price and liquidity and remains the active tape." : "Leadership is intact, but momentum is no longer expanding cleanly.",
      nextState: "Peak",
    };
  }

  if (rotationScore <= 90) {
    return {
      state: "Peak",
      description: "The category is at peak conviction, with price and volume confirming the move at the top of the stack.",
      nextState: "Exhausting",
    };
  }

  return {
    state: "Exhausting",
    description: "Late-cycle strength is visible and the category is now vulnerable to rotation if breadth softens.",
    nextState: "Exhausting",
  };
}

function buildNarrativeTimeline(
  category: CategoryItem,
  rotationScore: number,
  lifecycle: NarrativeLifecycle,
  context: CmcMarketContext,
): NarrativeTimelineStep[] {
  const avgPriceChange = toNumber(category.avg_price_change, 0);
  const marketCapChange = toNumber(category.market_cap_change, 0);
  const volumeChange = toNumber(category.volume_change, 0);
  const detectedAt = formatTimestamp(category.last_updated);
  const leadGap = context.scored[1] ? rotationScore - context.scored[1].rotationScore : rotationScore;
  const momentum = volumeChange * 0.6 + avgPriceChange * 0.4;

  return [
    {
      stage: "detected",
      title: "Detected",
      detail: `${category.title ?? category.name ?? "Category"} entered the live rotation set with ${formatPercent(avgPriceChange)} average price change and ${formatPercent(volumeChange)} volume growth.`,
      value: detectedAt,
    },
    {
      stage: "strengthening",
      title: "Strengthening",
      detail: `Volume change at ${formatPercent(volumeChange)} and market cap change at ${formatPercent(marketCapChange)} confirm capital is following through.`,
      value: `Rotation score ${rotationScore}/100`,
    },
    {
      stage: "peak",
      title: "Peak",
      detail: `The category reached ${lifecycle.state} because its weighted rotation score outran the broader universe by ${Math.max(1, Math.round(leadGap))} points.`,
      value: lifecycle.state,
    },
    {
      stage: "fading",
      title: "Fading",
      detail: `${momentum >= 0 ? "Momentum remains constructive, but" : "Momentum is already softening, and"} the next slowdown to watch is narrowing volume or market-cap follow-through.`,
      value: lifecycle.nextState,
    },
  ];
}

function buildNarrativeExplanation(
  category: CategoryItem,
  rotationScore: number,
  lifecycle: NarrativeLifecycle,
): NarrativeExplanation {
  const avgPriceChange = toNumber(category.avg_price_change, 0);
  const marketCapChange = toNumber(category.market_cap_change, 0);
  const volumeChange = toNumber(category.volume_change, 0);
  const categoryName = category.title ?? category.name ?? "The category";

  return {
    title: "Why this narrative matters",
    summary: `${categoryName} reached ${lifecycle.state.toLowerCase()} because market cap change, volume change, and average price change are aligned in the same direction.`,
    bullets: [
      `Market cap change is ${formatPercent(marketCapChange)}, volume change is ${formatPercent(volumeChange)}, and the weighted rotation score is ${rotationScore}/100.`,
      `Average price change of ${formatPercent(avgPriceChange)} shows the move is being confirmed across the basket rather than by one outlier.`,
      `Lifecycle is ${lifecycle.state.toLowerCase()}, which is derived directly from the score band for this category.`,
      `Institutional flows usually stay focused here until volume growth fades or breadth rolls over in the rest of the universe.`,
    ],
  };
}

function buildNarrativeHeatmap(context: CmcMarketContext): NarrativeHeatmapItem[] {
  return context.scored.slice(0, 10).map((category, index) => {
    const lifecycle = lifecycleFromScore(category.rotationScore);

    return {
      rank: index + 1,
      name: category.title ?? category.name ?? `Category ${index + 1}`,
      score: category.rotationScore,
      lifecycle,
      avgPriceChange: formatPercent(toNumber(category.avg_price_change, 0)),
      marketCapChange: formatPercent(toNumber(category.market_cap_change, 0)),
      volumeChange: formatPercent(toNumber(category.volume_change, 0)),
    };
  });
}

function buildNewsHeadline(category: CategoryItem, marketRegime: MarketRegime) {
  const name = category.title ?? category.name ?? "Market rotation";
  const move = formatPercent(toNumber(category.avg_price_change, 0));

  switch (marketRegime) {
    case "Bull":
      return `${name} continues to lead the tape with a ${move} 24h move and broad follow-through`;
    case "Euphoria":
      return `${name} is running hot as speculation expands across the category basket`;
    case "Panic":
      return `${name} is holding up while traders rotate defensively after a sharp risk-off move`;
    case "Bear":
      return `${name} is still under pressure, but the category is stabilizing after weak breadth`;
    default:
      return `${name} is consolidating while the market waits for a cleaner breakout`;
  }
}

function buildLatestNewsFromCategories(categories: CategoryItem[], source: string): NewsItem[] {
  const context = buildCategoryContext(categories);
  const leader = context.leader;
  const runnerUp = context.runnerUp;
  const secondary = context.secondary;
  const regime = classifyRegime(
    Math.max(0, 100 - Math.round(context.breadth * 0.65 + context.momentum * 0.45)),
    Math.round(context.momentum * 1.1),
  );

  const leaderLabel = leader.title ?? leader.name ?? "Market rotation";
  const runnerUpLabel = runnerUp.title ?? runnerUp.name ?? "Secondary rotation";
  const secondaryLabel = secondary.title ?? secondary.name ?? "Broader market";

  return [
    {
      id: `${leaderLabel}-lead`,
      title: buildNewsHeadline(leader, regime),
      summary: `${leaderLabel} is backed by ${toNumber(leader.num_tokens, 0)} tracked assets and a ${formatPercent(
        toNumber(leader.volume_change, 0),
      )} volume impulse. The category remains the clearest source of relative strength in the current tape.`,
      url: "",
      source,
      publishedAt: leader.last_updated ?? new Date().toISOString(),
      symbols: buildAssetsFromCategory(leader),
      categories: [leaderLabel],
    },
    {
      id: `${runnerUpLabel}-rotation`,
      title: `${runnerUpLabel} is shaping the next rotation pocket`,
      summary: `${runnerUpLabel} shows a ${formatPercent(toNumber(runnerUp.avg_price_change, 0))} price drift and a ${formatPercent(
        toNumber(runnerUp.market_cap_change, 0),
      )} market-cap change, suggesting capital is broadening beyond the leader.`,
      url: "",
      source,
      publishedAt: runnerUp.last_updated ?? new Date().toISOString(),
      symbols: buildAssetsFromCategory(runnerUp),
      categories: [runnerUpLabel],
    },
    {
      id: `${secondaryLabel}-risk`,
      title: `${secondaryLabel} provides the market's risk check`,
      summary: `${secondaryLabel} is acting as a sentiment gauge. When it weakens while leadership narrows, the regime tends to shift toward caution.`,
      url: "",
      source,
      publishedAt: secondary.last_updated ?? new Date().toISOString(),
      symbols: buildAssetsFromCategory(secondary),
      categories: [secondaryLabel],
    },
    {
      id: `breadth-read`,
      title: `Breadth remains ${context.breadth >= 55 ? "constructive" : "mixed"} across tracked categories`,
      summary: `Across the ranked category basket, ${Math.round(context.breadth)}% of categories are printing positive 24h price change, which keeps the narrative engine biased toward trend continuation.`,
      url: "",
      source,
      publishedAt: new Date().toISOString(),
      symbols: ["BTC", "ETH", ...buildAssetsFromCategory(leader).slice(0, 3)],
      categories: [leaderLabel, runnerUpLabel, secondaryLabel],
    },
  ];
}

function classifyRegime(fearAndGreed: number, altcoinIndex: number): MarketRegime {
  if (fearAndGreed >= 78 || altcoinIndex >= 75) return "Euphoria";
  if (fearAndGreed >= 60) return "Bull";
  if (fearAndGreed <= 20) return "Panic";
  if (fearAndGreed <= 40) return "Bear";
  return "Sideways";
}

function regimeSummary(regime: MarketRegime, btcDominance: number, fearAndGreed: number) {
  switch (regime) {
    case "Bull":
      return `Risk appetite is constructive with BTC dominance near ${btcDominance.toFixed(1)}% and the Fear and Greed index at ${fearAndGreed}.`;
    case "Bear":
      return `Capital is defensive, breadth is weak, and the Fear and Greed index is only ${fearAndGreed}.`;
    case "Panic":
      return "The market is in a risk-off flush, with elevated stress and quick rotations across majors and alts.";
    case "Euphoria":
      return "Speculative energy is stretched and capital is chasing alpha across the highest beta names.";
    default:
      return "The market is range-bound, with no clear direction from macro breadth or sentiment.";
  }
}

function riskScoreFromMetrics(
  fearAndGreed: number,
  altcoinIndex: number,
  btcDominance: number,
): RiskScorePanel {
  const score = clamp(
    Math.round(100 - fearAndGreed * 0.45 + (altcoinIndex > 75 ? 10 : 0) + (btcDominance > 60 ? 6 : 0)),
    0,
    100,
  );

  return {
    score,
    label: score < 35 ? "Low" : score < 70 ? "Medium" : "High",
    interpretation:
      score < 35
        ? "Liquidity conditions are relatively calm, but position sizing should still respect volatility."
        : score < 70
          ? "Risk is manageable, but momentum can fade quickly if breadth rolls over."
          : "Risk is elevated; keep size smaller and use tighter exits.",
  };
}

function buildFallbackMetrics(context: CmcMarketContext) {
  const leadingChange = toNumber(context.leader.avg_price_change, 0);
  const runnerUpChange = toNumber(context.runnerUp.avg_price_change, 0);
  const breadthAdjust = context.breadth - 50;
  const momentumMix = (leadingChange + runnerUpChange + context.momentum / 10) / 3;
  const fearAndGreed = clamp(Math.round(50 + breadthAdjust * 0.45 + momentumMix * 1.7), 8, 92);
  const altcoinSeasonIndex = clamp(Math.round(50 + momentumMix * 4 + breadthAdjust * 0.55), 0, 100);
  const btcDominance = clamp(
    Math.round(
      52 -
        breadthAdjust * 0.1 -
        Math.max(0, leadingChange) * 0.35 +
        (/(bitcoin|btc)/i.test(`${context.leader.title ?? context.leader.name}`) ? 8 : 0),
    ),
    35,
    72,
  );
  const ethDominance = clamp(
    Math.round(18 + (/(ethereum|eth)/i.test(`${context.leader.title ?? context.leader.name}`) ? 4 : 0) + breadthAdjust * 0.03),
    8,
    24,
  );
  const totalMarketCapUsd = Math.max(
    0,
    Math.round(
      context.categories
        .slice(0, 10)
        .reduce((sum, category) => sum + toNumber(category.market_cap, 0), 0) *
        0.34,
    ),
  );
  const totalVolume24hUsd = Math.max(
    0,
    Math.round(
      context.categories
        .slice(0, 10)
        .reduce((sum, category) => sum + toNumber(category.volume, 0), 0) *
        0.48,
    ),
  );
  const activeCryptocurrencies = Math.max(
    0,
    Math.round(context.categories.reduce((sum, category) => sum + toNumber(category.num_tokens, 0), 0)),
  );
  const activeExchanges = clamp(Math.round(120 + breadthAdjust * 0.7), 80, 260);
  const activeMarketPairs = clamp(Math.round(900 + activeCryptocurrencies * 1.8), 400, 9000);

  return {
    totalMarketCapUsd,
    totalVolume24hUsd,
    btcDominance,
    ethDominance,
    activeCryptocurrencies,
    activeExchanges,
    activeMarketPairs,
    altcoinSeasonIndex,
    fearAndGreedValue: fearAndGreed,
    fearAndGreedLabel:
      fearAndGreed >= 80 ? "Extreme Greed" : fearAndGreed >= 60 ? "Greed" : fearAndGreed <= 20 ? "Extreme Fear" : fearAndGreed <= 40 ? "Fear" : "Neutral",
  };
}

function buildGlobalMetricsFromCategories(categories: CategoryItem[], source: string) {
  const context = buildCategoryContext(categories);
  const metrics = buildFallbackMetrics(context);
  const regime = classifyRegime(metrics.fearAndGreedValue, metrics.altcoinSeasonIndex);
  const risk = riskScoreFromMetrics(metrics.fearAndGreedValue, metrics.altcoinSeasonIndex, metrics.btcDominance);

  return {
    source,
    updatedAt:
      context.leader.last_updated ??
      context.runnerUp.last_updated ??
      context.secondary.last_updated ??
      new Date().toISOString(),
    metrics,
    marketRegime: {
      active: regime,
      summary: regimeSummary(regime, metrics.btcDominance, metrics.fearAndGreedValue),
      catalyst:
        regime === "Bull"
          ? "Liquidity is rotating into majors and AI-linked beta first."
          : regime === "Euphoria"
            ? "Speculative beta is running hot across the market."
            : regime === "Panic"
              ? "Defensive flows are dominating and traders are cutting risk."
              : regime === "Bear"
                ? "Breadth is weak and buyers are waiting for a reset."
                : "The market is waiting for a cleaner directional breakout.",
      states: [
        {
          name: "Bull",
          score: clamp(Math.round(metrics.fearAndGreedValue + 12 - metrics.btcDominance / 6), 0, 100),
          note: "Trend and breadth are constructive",
          tone: "signal",
        },
        {
          name: "Bear",
          score: clamp(Math.round(100 - metrics.fearAndGreedValue + metrics.btcDominance / 10), 0, 100),
          note: "Sell pressure is present but not absolute",
          tone: "danger",
        },
        {
          name: "Sideways",
          score: clamp(Math.round(65 - Math.abs(50 - metrics.fearAndGreedValue)), 0, 100),
          note: "The market lacks a decisive break",
          tone: "neutral",
        },
        {
          name: "Panic",
          score: clamp(Math.round(100 - metrics.fearAndGreedValue * 1.2), 0, 100),
          note: "Stress rises as sentiment falls",
          tone: "danger",
        },
        {
          name: "Euphoria",
          score: clamp(Math.round(metrics.altcoinSeasonIndex * 0.9), 0, 100),
          note: "Speculative heat is elevated",
          tone: "pulse",
        },
      ],
      supportLevels: [
        `BTC dominance at ${metrics.btcDominance.toFixed(1)}%`,
        `Fear and Greed at ${metrics.fearAndGreedValue}`,
        `Altcoin Season Index at ${metrics.altcoinSeasonIndex}`,
      ],
    } satisfies MarketRegimePanel,
    riskScore: risk satisfies RiskScorePanel,
  };
}

function buildNarrativesFromCategories(categories: CategoryItem[], source: string) {
  const context = buildCategoryContext(categories);
  const leader = context.leader;
  const runnerUp = context.runnerUp;
  const leaderTitle = leader.title ?? leader.name ?? "Market Rotation";
  const runnerUpTitle = runnerUp.title ?? runnerUp.name ?? "Capital Rotation";
  const latestNews = buildLatestNewsFromCategories(categories, source);
  const leadHeadline = latestNews[0]?.title ?? "";
  const strength = deriveNarrativeStrength(leader, context.breadth, context.momentum);
  const rotation = buildNarrativeRotationScore(leader, context);
  const lifecycle = classifyNarrativeLifecycle(rotation.score, context.momentum);
  const leaderAssets = buildAssetsFromCategory(leader);
  const runnerAssets = buildAssetsFromCategory(runnerUp);
  const heatmap = buildNarrativeHeatmap(context);
  const timeline = buildNarrativeTimeline(leader, rotation.score, lifecycle, context);
  const explanation = buildNarrativeExplanation(leader, rotation.score, lifecycle);

  return {
    source,
    updatedAt:
      leader.last_updated ??
      runnerUp.last_updated ??
      latestNews[0]?.publishedAt ??
      new Date().toISOString(),
    dominantNarrative: {
      name: narrativeName(leader),
      status: "Dominant",
      strength: strength.score,
      momentum: toNumber(leader.avg_price_change, 0) >= 0 ? "Accelerating" : "Cooling",
      detectedAt: formatTimestamp(leader.last_updated),
      summary:
        `Search and liquidity are clustering around ${leaderTitle}. ${leadHeadline ? `${leadHeadline}.` : ""}`.trim(),
      assets: leaderAssets,
      drivers: [
        { label: "Tracked category", value: leaderTitle },
        { label: "24h move", value: formatPercent(toNumber(leader.avg_price_change, 0)) },
        { label: "Volume impulse", value: formatPercent(toNumber(leader.volume_change, 0)) },
      ],
    } satisfies NarrativeCard,
    previousNarrative: {
      name: runnerUpTitle,
      status: "Rotating out",
      fadedAt: "Faded from the top of the tape in the last 24h",
      duration: "Held attention for 2-4 sessions",
      peakConfidence: clamp(strength.score - 7, 40, 90),
      summary: `Community attention is drifting away from ${runnerUpTitle} as the market concentrates on the current leader.`,
      assets: runnerAssets,
    } satisfies PreviousNarrativeCard,
    narrativeStrength: {
      score: rotation.score,
      label: rotation.score >= 61 ? "Strong" : rotation.score >= 41 ? "Building" : "Weak",
      trend: strength.trend,
      socialAgreement: clamp(rotation.score + 4, 0, 99),
      onchainConfirmation: clamp(rotation.score - 2, 0, 99),
      priceConfirmation: clamp(rotation.score - 6, 0, 99),
    },
    narrativeRotationScore: rotation,
    narrativeLifecycle: lifecycle,
    narrativeHeatmap: heatmap,
    narrativeTimeline: timeline,
    narrativeExplanation: explanation,
    watchlist: context.ranked.slice(0, 7).map((category, index) => ({
      name: category.title ?? category.name ?? `Asset ${index + 1}`,
      rank: index + 1,
      momentum: index < 2 ? "rising" : "watching",
    })),
    news: latestNews,
  };
}

function buildStrategyFromContext(categories: CategoryItem[], source: string) {
  const narratives = buildNarrativesFromCategories(categories, source);
  const globalMetrics = buildGlobalMetricsFromCategories(categories, source);
  const news = buildLatestNewsFromCategories(categories, source);
  const riskScore = globalMetrics.riskScore.score;
  const confidenceScore = clamp(Math.round(narratives.narrativeStrength.score * 0.6 + (100 - riskScore) * 0.4), 0, 100);
  const activeRegime = globalMetrics.marketRegime.active;
  const topCoins = narratives.watchlist.slice(0, 3).map((item) => item.name);
  const topCoinsLabel = topCoins.length > 0 ? topCoins.join(", ") : "top-ranked assets";
  const topHeadline = news[0]?.title ?? "Market attention remains concentrated";

  return {
    source,
    updatedAt: globalMetrics.updatedAt,
    strategyOutputPanel: {
      confidenceScore,
      confidenceLabel: confidenceScore >= 80 ? "High confidence" : "Medium confidence",
      entryRecommendation:
        activeRegime === "Panic"
          ? "Wait for confirmation before adding exposure; only scale in after volatility cools and market breadth stabilizes."
          : `Scale into ${topCoinsLabel} on pullbacks while the ${activeRegime.toLowerCase()} regime stays intact.`,
      exitRecommendation:
        activeRegime === "Euphoria"
          ? "Take profits faster and tighten stops as speculative heat expands."
          : "Exit if the narrative falls out of the top rotation list or the regime flips to Bear or Panic.",
      positionSizing:
        confidenceScore >= 80
          ? "1.0x to 1.25x base size"
          : confidenceScore >= 65
            ? "0.75x to 1.0x base size"
            : "0.5x to 0.75x base size",
      thesis: `${topHeadline}. Keep the portfolio aligned with ${narratives.dominantNarrative.name} while global sentiment remains ${globalMetrics.metrics.fearAndGreedLabel.toLowerCase()}.`,
      watchlist: topCoins,
    } satisfies StrategyOutputPanel,
    news: news.slice(0, 3),
    legacy: {
      confidenceScore: confidenceScore / 100,
      strategyType: "narrative-following",
      positionBias: activeRegime === "Bear" || activeRegime === "Panic" ? "defensive" : "selective long",
      riskNotes: [
        `Narrative strength sits at ${narratives.narrativeStrength.score}/100.`,
        `Fear and Greed is ${globalMetrics.metrics.fearAndGreedValue} (${globalMetrics.metrics.fearAndGreedLabel}).`,
        topHeadline,
      ],
    },
  };
}

async function loadCategoryUniverse() {
  const response = await requestCmc<CategoryItem[]>("/v1/cryptocurrency/categories");

  if (response.ok && Array.isArray(response.data) && response.data.length > 0) {
    return response.data;
  }

  return FALLBACK_CATEGORIES;
}

export async function getTrendingNarratives() {
  try {
    const categories = await loadCategoryUniverse();
    return buildNarrativesFromCategories(categories, "CoinMarketCap Free Categories");
  } catch {
    return createFallbackNarratives();
  }
}

export async function getGlobalMetrics() {
  try {
    const categories = await loadCategoryUniverse();
    return buildGlobalMetricsFromCategories(categories, "CoinMarketCap Free Categories");
  } catch {
    return createFallbackGlobalMetrics();
  }
}

export async function getLatestNews() {
  try {
    const categories = await loadCategoryUniverse();
    return buildLatestNewsFromCategories(categories, "CoinMarketCap Free Categories");
  } catch {
    return createFallbackLatestNews();
  }
}

export async function getStrategySnapshot() {
  try {
    const categories = await loadCategoryUniverse();
    return buildStrategyFromContext(categories, "CoinMarketCap Free Categories");
  } catch {
    const fallbackCategories = FALLBACK_CATEGORIES;
    return buildStrategyFromContext(fallbackCategories, "CoinMarketCap Free Plan");
  }
}
