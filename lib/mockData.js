// Development content layer for the CMC NarrativeX marketing site.
// The dashboard no longer depends on this file; the live panels now consume
// the CoinMarketCap service layer and only use fallback data when needed.

export const narrativeSequence = [
  "AI AGENTS & AUTONOMOUS COMPUTE",
  "REAL-WORLD ASSET TOKENIZATION",
  "DEFI YIELD REVIVAL",
  "L2 RESTAKING FLOWS",
  "BITCOIN TREASURY ADOPTION",
  "MEME CYCLE EXHAUSTION",
  "MODULAR DATA AVAILABILITY",
];

export const currentNarrative = {
  title: "AI Agents & Autonomous Compute",
  detectedAt: "Detected 4 days ago",
  momentum: "Accelerating",
  strength: 86,
  summary:
    "Capital and social volume are rotating into tokens tied to autonomous AI agents and decentralized compute markets, as on-chain agent activity and GPU-network usage both post fresh highs.",
  relatedAssets: ["FET", "TAO", "RNDR", "AKT", "NEAR"],
  signals: [
    { label: "Social mention velocity", value: "+212%", tone: "up" },
    { label: "On-chain agent wallets", value: "+38%", tone: "up" },
    { label: "Avg. 24h volume vs 30d", value: "2.4x", tone: "up" },
  ],
};

export const previousNarrative = {
  title: "Real-World Asset Tokenization",
  fadedAt: "Faded 5 days ago",
  duration: "Held dominance for 11 days",
  peakConfidence: 81,
  summary:
    "Tokenized treasuries and private-credit narratives lost share of voice as new issuance slowed and rotation accelerated into AI-linked compute tokens.",
  relatedAssets: ["ONDO", "POLYX", "CFG"],
};

export const confidenceScore = {
  score: 78,
  label: "High confidence",
  description:
    "Narrative is corroborated across social, on-chain, and price-volume data with low conflict between sources.",
  factors: [
    { name: "Cross-source agreement", weight: 92 },
    { name: "Data freshness", weight: 88 },
    { name: "Historical pattern match", weight: 64 },
  ],
};

export const marketRegime = {
  regime: "Risk-On Expansion",
  since: "Active for 6 days",
  volatility: "Moderate",
  liquidity: "Improving",
  breadth: "Narrow — led by majors & AI sector",
  description:
    "Funding rates are positive but not stretched, spot volume is outpacing derivatives growth, and liquidity is returning to mid-cap pairs first.",
};

export const riskScore = {
  score: 42,
  label: "Moderate",
  description:
    "Leverage is building back up but hasn't reached prior-cycle extremes. Watch funding rates over the next 48–72h.",
  factors: [
    { name: "Derivatives leverage", value: 58, tone: "amber" },
    { name: "Liquidity depth", value: 31, tone: "pulse" },
    { name: "Correlation to BTC", value: 47, tone: "amber" },
    { name: "Volatility (30d realized)", value: 35, tone: "pulse" },
  ],
};

export const generatedStrategy = {
  conviction: "Medium-High",
  timeframe: "5–10 day horizon",
  thesis:
    "Lean into the AI-agent narrative while it's corroborated and the regime stays risk-on, but size positions for a moderate-risk environment rather than a euphoric one.",
  actions: [
    "Scale into AI-compute majors (FET, TAO, RNDR) on pullbacks toward the 4h trend average.",
    "Keep a standing reduce-risk trigger if funding rates on AI-sector perps exceed +0.06% (8h).",
    "Avoid adding to RWA-tokenization positions until narrative strength re-accelerates.",
  ],
  allocationTilt: [
    { sector: "AI & Compute", tilt: "Overweight" },
    { sector: "L1 Majors", tilt: "Neutral" },
    { sector: "RWA / Tokenization", tilt: "Underweight" },
  ],
  disclaimer:
    "Generated for informational purposes only. Not financial advice — always size positions according to your own risk tolerance.",
};

export const howItWorks = [
  {
    step: "01",
    title: "Ingest",
    description:
      "Streams social volume, on-chain activity, and price-volume data across thousands of assets in real time.",
  },
  {
    step: "02",
    title: "Detect",
    description:
      "An AI model identifies which narrative is gaining share of voice and scores how confident it is in that read.",
  },
  {
    step: "03",
    title: "Generate",
    description:
      "Translates the narrative, regime, and risk score into a concrete, sized strategy you can act on or override.",
  },
];

export const platformStats = [
  { label: "Narratives tracked live", value: "184" },
  { label: "Assets monitored", value: "9,200+" },
  { label: "Avg. detection lag", value: "< 6 min" },
];
