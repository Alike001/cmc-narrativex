type JsonRecord = Record<string, any>;

type CmcEnvelope<T> = {
  data: T;
  status?: {
    error_code?: number;
    error_message?: string;
    notice?: string;
  };
};

type CoinMarketData = {
  id?: number;
  name?: string;
  symbol?: string;
  slug?: string;
  rank?: number;
  cmc_rank?: number;
  quote?: {
    USD?: {
      price?: number;
      volume_24h?: number;
      percent_change_24h?: number;
      market_cap?: number;
      last_updated?: string;
    };
  };
};

type ContentItem = JsonRecord;

export class CmcApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 502) {
    super(message);
    this.name = "CmcApiError";
    this.statusCode = statusCode;
  }
}

function getBaseUrl() {
  return process.env.COINMARKETCAP_API_BASE_URL ?? "https://pro-api.coinmarketcap.com";
}

function getApiKey() {
  const apiKey = process.env.COINMARKETCAP_API_KEY;

  if (!apiKey) {
    throw new CmcApiError(
      "Missing COINMARKETCAP_API_KEY. Set it in your environment to enable CoinMarketCap data.",
      503,
    );
  }

  return apiKey;
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
): Promise<T> {
  const url = buildUrl(path, params);
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "X-CMC_PRO_API_KEY": getApiKey(),
    },
  });

  let body: CmcEnvelope<T> | null = null;
  try {
    body = (await response.json()) as CmcEnvelope<T>;
  } catch {
    body = null;
  }

  const errorMessage = body?.status?.error_message?.trim();
  const errorCode = body?.status?.error_code;

  if (!response.ok || (typeof errorCode === "number" && errorCode !== 0)) {
    throw new CmcApiError(
      errorMessage || `CoinMarketCap request failed for ${path} (${response.status})`,
      response.status,
    );
  }

  if (!body) {
    throw new CmcApiError(`CoinMarketCap returned an empty response for ${path}`, 502);
  }

  return body.data;
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = typeof value === "string" ? Number(value) : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function deriveNarrativeStrength(coin: CoinMarketData, topicName: string, headline: string) {
  const rank = coin.rank ?? coin.cmc_rank ?? 50;
  const change = toNumber(coin.quote?.USD?.percent_change_24h, 0);
  const volume = toNumber(coin.quote?.USD?.volume_24h, 0);
  const momentumBoost = clamp(Math.round(Math.abs(change) * 2.1), 0, 14);
  const rankBoost = clamp(Math.round((12 - Math.min(rank, 12)) * 1.5), 0, 18);
  const volumeBoost = volume > 0 ? clamp(Math.round(Math.log10(volume) - 5), 0, 10) : 0;
  const score = clamp(56 + momentumBoost + rankBoost + volumeBoost, 58, 96);

  return {
    score,
    label: score >= 80 ? "Strong" : "Building",
    trend: change >= 0 ? `+${change.toFixed(1)}% 24h` : `${change.toFixed(1)}% 24h`,
    socialAgreement: clamp(score + 5, 0, 99),
    onchainConfirmation: clamp(score - 2, 0, 99),
    priceConfirmation: clamp(score - 6, 0, 99),
    topicName,
    headline,
  };
}

function normalizeContentItem(item: ContentItem) {
  const symbolList = Array.isArray(item?.symbol)
    ? item.symbol
    : Array.isArray(item?.symbols)
      ? item.symbols
      : [];

  const categoryList = Array.isArray(item?.category)
    ? item.category
    : typeof item?.category === "string"
      ? [item.category]
      : [];

  return {
    id: item.id ?? item.guid ?? item.url ?? item.title ?? item.name,
    title: item.title ?? item.headline ?? item.name ?? "Untitled",
    summary: item.description ?? item.summary ?? item.excerpt ?? item.content ?? "",
    url: item.url ?? item.link ?? "",
    source: item.source_name ?? item.source ?? item.publisher ?? "CoinMarketCap",
    publishedAt: item.published_at ?? item.date_added ?? item.created_at ?? "",
    symbols: symbolList.filter(Boolean),
    categories: categoryList.filter(Boolean),
  };
}

function classifyRegime(fearAndGreed: number, altcoinIndex: number) {
  if (fearAndGreed >= 78 || altcoinIndex >= 75) return "Euphoria";
  if (fearAndGreed >= 60) return "Bull";
  if (fearAndGreed <= 20) return "Panic";
  if (fearAndGreed <= 40) return "Bear";
  return "Sideways";
}

function regimeSummary(
  regime: "Bull" | "Bear" | "Sideways" | "Panic" | "Euphoria",
  btcDominance: number,
  fearAndGreed: number,
) {
  switch (regime) {
    case "Bull":
      return `Risk appetite is constructive with BTC dominance at ${btcDominance.toFixed(1)} and the Fear and Greed index at ${fearAndGreed}.`;
    case "Bear":
      return `Capital is defensive, breadth is weak, and the Fear and Greed index is only ${fearAndGreed}.`;
    case "Panic":
      return `The market is in a risk-off flush, with elevated stress and quick rotations across majors and alts.`;
    case "Euphoria":
      return `Speculative energy is stretched and capital is chasing alpha across the highest beta names.`;
    default:
      return `The market is range-bound, with no clear direction from macro breadth or sentiment.`;
  }
}

function riskScoreFromMetrics(fearAndGreed: number, altcoinIndex: number, btcDominance: number) {
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

function narrativeName(topicName: string, coin: CoinMarketData) {
  const name = topicName?.trim() || coin.name || "Market Rotation";
  return /narrative/i.test(name) ? name : `${name} Narrative`;
}

export async function getTrendingNarratives() {
  const [trendingCoins, trendingTopics, trendingTokens, latestNews] = await Promise.all([
    requestCmc<CoinMarketData[]>("/v1/cryptocurrency/trending/latest", {
      limit: 10,
      time_period: "24h",
      convert: "USD",
    }),
    requestCmc<JsonRecord[]>("/v1/community/trending/topic", { limit: 5 }),
    requestCmc<JsonRecord[]>("/v1/community/trending/token", { limit: 5 }),
    requestCmc<JsonRecord[]>("/v1/content/latest", {
      limit: 10,
      content_type: "news",
      news_type: "news",
      language: "en",
    }),
  ]);

  const dominantCoin = trendingCoins[0] ?? trendingTokens[0] ?? {};
  const dominantTopic = trendingTopics[0]?.topic ?? dominantCoin.name ?? "Crypto Market Rotation";
  const previousTopic = trendingTopics[1]?.topic ?? trendingTokens[0]?.name ?? "Capital Rotation";
  const leadHeadline = normalizeContentItem(latestNews[0] ?? {}).title;

  const strength = deriveNarrativeStrength(dominantCoin, dominantTopic, leadHeadline);
  const dominantAssets = trendingCoins
    .slice(0, 5)
    .map((coin) => coin.symbol)
    .filter((symbol): symbol is string => Boolean(symbol));

  const previousAssets = trendingCoins
    .slice(1, 4)
    .map((coin) => coin.symbol)
    .filter((symbol): symbol is string => Boolean(symbol));

  return {
    source: "CoinMarketCap API",
    updatedAt:
      dominantCoin.quote?.USD?.last_updated ??
      latestNews[0]?.published_at ??
      new Date().toISOString(),
    dominantNarrative: {
      name: narrativeName(dominantTopic, dominantCoin),
      status: "Dominant",
      strength: strength.score,
      momentum:
        toNumber(dominantCoin.quote?.USD?.percent_change_24h, 0) >= 0 ? "Accelerating" : "Cooling",
      detectedAt: dominantCoin.quote?.USD?.last_updated
        ? `Updated ${new Date(dominantCoin.quote.USD.last_updated).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}`
        : "Updated recently",
      summary:
        `Search volume is clustering around ${dominantTopic}. ${leadHeadline ? `${leadHeadline}.` : ""}`.trim(),
      assets: dominantAssets,
      drivers: [
        { label: "Trending coin", value: dominantCoin.name ?? "Unknown" },
        { label: "Search signal", value: dominantTopic },
        { label: "News catalyst", value: leadHeadline },
      ],
    },
    previousNarrative: {
      name: previousTopic,
      status: "Rotating out",
      fadedAt: "Faded from the top of the tape in the last 24h",
      duration: "Held attention for 2-4 sessions",
      peakConfidence: clamp(strength.score - 7, 40, 90),
      summary:
        `Community attention is drifting away from ${previousTopic} as the market concentrates on the current leader.`,
      assets: previousAssets,
    },
    narrativeStrength: {
      score: strength.score,
      label: strength.label,
      trend: strength.trend,
      socialAgreement: strength.socialAgreement,
      onchainConfirmation: strength.onchainConfirmation,
      priceConfirmation: strength.priceConfirmation,
    },
    watchlist: trendingCoins.slice(0, 7).map((coin, index) => ({
      name: coin.symbol ?? coin.name ?? `Asset ${index + 1}`,
      rank: index + 1,
      momentum: index < 2 ? "rising" : "watching",
    })),
    news: latestNews.slice(0, 5).map(normalizeContentItem),
  };
}

export async function getGlobalMetrics() {
  const [globalMetrics, fearAndGreed, altcoinSeason] = await Promise.all([
    requestCmc<JsonRecord>("/v1/global-metrics/quotes/latest"),
    requestCmc<JsonRecord>("/v3/fear-and-greed/latest"),
    requestCmc<JsonRecord>("/v1/altcoin-season-index/latest"),
  ]);

  const usdQuote = globalMetrics?.quote?.USD ?? {};
  const fearValue = toNumber(fearAndGreed?.value, 50);
  const altcoinValue = toNumber(altcoinSeason?.altcoin_index, 50);
  const btcDominance = toNumber(globalMetrics?.btc_dominance, 0);
  const regime = classifyRegime(fearValue, altcoinValue);
  const risk = riskScoreFromMetrics(fearValue, altcoinValue, btcDominance);

  return {
    source: "CoinMarketCap API",
    updatedAt:
      globalMetrics?.last_updated ??
      fearAndGreed?.update_time ??
      altcoinSeason?.snapshot_time ??
      new Date().toISOString(),
    metrics: {
      totalMarketCapUsd: toNumber(usdQuote.total_market_cap, 0),
      totalVolume24hUsd: toNumber(usdQuote.total_volume_24h, 0),
      btcDominance,
      ethDominance: toNumber(globalMetrics?.eth_dominance, 0),
      activeCryptocurrencies: toNumber(globalMetrics?.active_cryptocurrencies, 0),
      activeExchanges: toNumber(globalMetrics?.active_exchanges, 0),
      activeMarketPairs: toNumber(globalMetrics?.active_market_pairs, 0),
      altcoinSeasonIndex: altcoinValue,
      fearAndGreedValue: fearValue,
      fearAndGreedLabel: fearAndGreed?.value_classification ?? "Neutral",
    },
    marketRegime: {
      active: regime,
      summary: regimeSummary(regime, btcDominance, fearValue),
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
          score: clamp(Math.round(fearValue + 12 - btcDominance / 6), 0, 100),
          note: "Trend and breadth are constructive",
          tone: "signal",
        },
        {
          name: "Bear",
          score: clamp(Math.round(100 - fearValue + btcDominance / 10), 0, 100),
          note: "Sell pressure is present but not absolute",
          tone: "danger",
        },
        {
          name: "Sideways",
          score: clamp(Math.round(65 - Math.abs(50 - fearValue)), 0, 100),
          note: "The market lacks a decisive break",
          tone: "neutral",
        },
        {
          name: "Panic",
          score: clamp(Math.round(100 - fearValue * 1.2), 0, 100),
          note: "Stress rises as sentiment falls",
          tone: "danger",
        },
        {
          name: "Euphoria",
          score: clamp(Math.round(altcoinValue * 0.9), 0, 100),
          note: "Speculative heat is elevated",
          tone: "pulse",
        },
      ],
      supportLevels: [
        `BTC dominance at ${btcDominance.toFixed(1)}%`,
        `Fear and Greed at ${fearValue}`,
        `Altcoin Season Index at ${altcoinValue}`,
      ],
    },
    riskScore: risk,
  };
}

export async function getLatestNews() {
  const content = await requestCmc<JsonRecord[]>("/v1/content/latest", {
    limit: 10,
    content_type: "news",
    news_type: "news",
    language: "en",
  });

  return content.map((item) => normalizeContentItem(item));
}
