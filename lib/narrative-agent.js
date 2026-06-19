const PROFILE_PRESETS = {
  Conservative: {
    exposureBase: 0.54,
    cashBase: 0.28,
    dominantBias: 0.02,
    secondaryBias: 0.04,
    thirdBias: 0.05,
    confidenceFloor: 6,
  },
  Moderate: {
    exposureBase: 0.67,
    cashBase: 0.18,
    dominantBias: 0.05,
    secondaryBias: 0.02,
    thirdBias: 0.0,
    confidenceFloor: 3,
  },
  Aggressive: {
    exposureBase: 0.81,
    cashBase: 0.1,
    dominantBias: 0.1,
    secondaryBias: -0.01,
    thirdBias: -0.04,
    confidenceFloor: 0,
  },
};

const HOLDING_PRESETS = {
  "1 Week": {
    exposureBase: -0.05,
    cashBase: 0.07,
    dominantBias: 0.08,
    secondaryBias: -0.02,
    thirdBias: -0.04,
    cadence: "daily",
  },
  "2 Weeks": {
    exposureBase: -0.01,
    cashBase: 0.03,
    dominantBias: 0.05,
    secondaryBias: 0.0,
    thirdBias: -0.02,
    cadence: "every 2-3 sessions",
  },
  "1 Month": {
    exposureBase: 0.04,
    cashBase: -0.01,
    dominantBias: 0.0,
    secondaryBias: 0.03,
    thirdBias: 0.02,
    cadence: "weekly",
  },
  "3 Months": {
    exposureBase: 0.08,
    cashBase: -0.05,
    dominantBias: -0.05,
    secondaryBias: 0.05,
    thirdBias: 0.06,
    cadence: "weekly",
  },
};

const REGIME_PRESETS = {
  Bull: {
    exposureBase: 0.06,
    cashBase: -0.05,
    dominantBias: 0.08,
    secondaryBias: 0.03,
    thirdBias: -0.01,
    confidenceBase: 12,
  },
  Euphoria: {
    exposureBase: 0.02,
    cashBase: 0.0,
    dominantBias: 0.05,
    secondaryBias: 0.02,
    thirdBias: 0.0,
    confidenceBase: 8,
  },
  Sideways: {
    exposureBase: -0.08,
    cashBase: 0.08,
    dominantBias: -0.02,
    secondaryBias: 0.03,
    thirdBias: 0.04,
    confidenceBase: -4,
  },
  Bear: {
    exposureBase: -0.16,
    cashBase: 0.14,
    dominantBias: -0.08,
    secondaryBias: 0.05,
    thirdBias: 0.06,
    confidenceBase: -10,
  },
  Panic: {
    exposureBase: -0.24,
    cashBase: 0.2,
    dominantBias: -0.12,
    secondaryBias: 0.07,
    thirdBias: 0.09,
    confidenceBase: -16,
  },
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function parsePercentString(value) {
  if (typeof value === "number") return value;
  const parsed = Number(String(value).replace("%", "").replace("+", ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function getTopNarrativeCandidates(snapshot) {
  const heatmap = Array.isArray(snapshot?.narrativeHeatmap) ? snapshot.narrativeHeatmap : [];
  const fallbackNarrative = snapshot?.narratives?.dominantNarrative;

  const mapped = heatmap.slice(0, 3).map((item, index) => ({
    name: item.name ?? fallbackNarrative?.name ?? `Narrative ${index + 1}`,
    score: clamp(Number(item.score) || 0, 0, 100),
    lifecycle: item.lifecycle ?? "Building",
    avgPriceChange: parsePercentString(item.avgPriceChange),
    volumeChange: parsePercentString(item.volumeChange),
    marketCapChange: parsePercentString(item.marketCapChange),
  }));

  if (mapped.length === 0 && fallbackNarrative) {
    mapped.push({
      name: fallbackNarrative.name,
      score: clamp(Number(snapshot?.narratives?.narrativeRotationScore?.score ?? fallbackNarrative.strength) || 0, 0, 100),
      lifecycle: snapshot?.narratives?.narrativeLifecycle?.state ?? "Building",
      avgPriceChange: parsePercentString(snapshot?.narratives?.narrativeRotationScore?.drivers?.[2]?.value),
      volumeChange: parsePercentString(snapshot?.narratives?.narrativeRotationScore?.drivers?.[1]?.value),
      marketCapChange: parsePercentString(snapshot?.narratives?.narrativeRotationScore?.drivers?.[0]?.value),
    });
  }

  return mapped;
}

function buildAllocationWeights(candidates, snapshot, riskProfile, holdingPeriod) {
  const profile = PROFILE_PRESETS[riskProfile] ?? PROFILE_PRESETS.Moderate;
  const holding = HOLDING_PRESETS[holdingPeriod] ?? HOLDING_PRESETS["1 Week"];
  const regimeName = snapshot?.regime?.active ?? "Sideways";
  const regime = REGIME_PRESETS[regimeName] ?? REGIME_PRESETS.Sideways;
  const riskScore = clamp(Number(snapshot?.risk?.score) || 50, 0, 100);
  const riskPenalty = riskScore / 500;

  const [dominant, second, third] = candidates;
  const dominantSignal = dominant ? dominant.score : 0;
  const secondSignal = second ? second.score : dominantSignal * 0.8;
  const thirdSignal = third ? third.score : secondSignal * 0.8;
  const signalGap = dominant && second ? clamp(dominant.score - second.score, 0, 40) : 0;
  const momentumBoost = dominant ? (dominant.volumeChange + dominant.avgPriceChange) / 20 : 0;

  const dominantRaw = Math.max(
    1,
    dominantSignal * (1 + profile.dominantBias + holding.dominantBias + regime.dominantBias) +
      signalGap * 0.8 +
      momentumBoost * 4 -
      riskPenalty * 20,
  );
  const secondRaw = Math.max(
    1,
    secondSignal * (0.82 + profile.secondaryBias + holding.secondaryBias + regime.secondaryBias) +
      (second ? second.volumeChange : 0) * 1.2 +
      Math.max(0, 15 - signalGap) * 0.4,
  );
  const thirdRaw = Math.max(
    1,
    thirdSignal * (0.68 + profile.thirdBias + holding.thirdBias + regime.thirdBias) +
      (third ? third.marketCapChange : 0) * 0.8 +
      (snapshot?.narratives?.narrativeStrength?.score ? snapshot.narratives.narrativeStrength.score / 12 : 0),
  );

  const exposureBase = clamp(
    profile.exposureBase + holding.exposureBase + regime.exposureBase - riskPenalty,
    0.28,
    0.92,
  );
  const cashBase = clamp(profile.cashBase + holding.cashBase + regime.cashBase + riskPenalty * 1.15, 0.08, 0.55);
  const exposurePool = clamp(1 - cashBase, 0.45, 0.92);

  const narrativePool = Math.max(0.05, exposureBase);
  const totalSignal = dominantRaw + secondRaw + thirdRaw;

  let dominantWeight = (dominantRaw / totalSignal) * exposurePool;
  let secondWeight = (secondRaw / totalSignal) * exposurePool;
  let thirdWeight = (thirdRaw / totalSignal) * exposurePool;
  let cashWeight = 1 - (dominantWeight + secondWeight + thirdWeight);

  dominantWeight = clamp(dominantWeight + narrativePool * 0.08, 0.1, 0.65);
  secondWeight = clamp(secondWeight + narrativePool * 0.02, 0.08, 0.45);
  thirdWeight = clamp(thirdWeight + narrativePool * 0.01, 0.05, 0.35);
  cashWeight = clamp(1 - (dominantWeight + secondWeight + thirdWeight), 0.05, 0.65);

  const raw = [
    { name: dominant?.name ?? "Dominant Narrative", weight: dominantWeight },
    { name: second?.name ?? "Secondary Narrative", weight: secondWeight },
    { name: third?.name ?? "Tertiary Narrative", weight: thirdWeight },
    { name: "Cash", weight: cashWeight },
  ];

  const total = raw.reduce((sum, item) => sum + item.weight, 0) || 1;
  const normalized = raw.map((item, index) => {
    const percent = index === raw.length - 1
      ? Math.max(0, 100 - raw.slice(0, -1).reduce((sum, entry) => sum + Math.round((entry.weight / total) * 100), 0))
      : Math.round((item.weight / total) * 100);
    return {
      name: item.name,
      percent,
    };
  });

  const fixDelta = 100 - normalized.reduce((sum, item) => sum + item.percent, 0);
  normalized[0].percent += fixDelta;

  return normalized;
}

function buildWatchlist(snapshot) {
  const dominantAssets = snapshot?.narratives?.dominantNarrative?.assets ?? [];
  const dominantHeatmap = snapshot?.narrativeHeatmap?.[0]?.name;
  const fallback = Array.isArray(snapshot?.narrativeWatchlist)
    ? snapshot.narrativeWatchlist.map((item) => item.name).filter(Boolean)
    : [];
  const fromAssets = dominantAssets.slice(0, 5);

  return (fromAssets.length > 0 ? fromAssets : [dominantHeatmap, ...fallback])
    .filter(Boolean)
    .slice(0, 5);
}

export function buildNarrativeRotationAgent(snapshot, inputs) {
  const riskProfile = inputs?.riskProfile ?? "Moderate";
  const holdingPeriod = inputs?.holdingPeriod ?? "1 Week";
  const capitalAmount = Math.max(0, Number(inputs?.capitalAmount) || 0);

  const candidates = getTopNarrativeCandidates(snapshot);
  const dominantCandidate = candidates[0] ?? {
    name: snapshot?.narratives?.dominantNarrative?.name ?? "Dominant Narrative",
    score: 50,
    lifecycle: snapshot?.narratives?.narrativeLifecycle?.state ?? "Building",
    avgPriceChange: 0,
    volumeChange: 0,
    marketCapChange: 0,
  };
  const regimeName = snapshot?.regime?.active ?? "Sideways";
  const regimeLabel = regimeName.toLowerCase();
  const riskScore = clamp(Number(snapshot?.risk?.score) || 50, 0, 100);
  const narrativeStrength = clamp(Number(snapshot?.narratives?.narrativeStrength?.score) || dominantCandidate.score, 0, 100);
  const rotationScore = clamp(Number(snapshot?.narratives?.narrativeRotationScore?.score) || dominantCandidate.score, 0, 100);
  const momentum = dominantCandidate.volumeChange + dominantCandidate.avgPriceChange;
  const confidenceScore = clamp(
    Math.round(
      dominantCandidate.score * 0.45 +
        narrativeStrength * 0.2 +
        (100 - riskScore) * 0.18 +
        (regimeName === "Bull" ? 12 : regimeName === "Euphoria" ? 8 : regimeName === "Sideways" ? -2 : regimeName === "Bear" ? -6 : -12) +
        clamp(dominantCandidate.score - (candidates[1]?.score ?? dominantCandidate.score), 0, 30) * 0.4,
    ),
    0,
    100,
  );

  const allocation = buildAllocationWeights(candidates, snapshot, riskProfile, holdingPeriod);
  const capitalBreakdown = allocation.map((item) => ({
    ...item,
    amount: capitalAmount > 0 ? (capitalAmount * item.percent) / 100 : 0,
  }));

  const entryStrategy =
    riskProfile === "Conservative"
      ? `Scale into ${dominantCandidate.name} only after momentum remains positive and the ${regimeLabel} regime keeps breadth intact.`
      : riskProfile === "Aggressive"
        ? `Enter ${dominantCandidate.name} and the top rotation basket in stages while the current signal stack remains constructive.`
        : `Scale in gradually while ${dominantCandidate.name} keeps the lead and the ${regimeLabel} regime does not deteriorate.`;

  const exitStrategy =
    riskProfile === "Aggressive"
      ? `Trim exposure if ${dominantCandidate.name} drops below a ${Math.max(55, dominantCandidate.score - 18)}/100 rotation score or the regime shifts to Bear/Panic.`
      : `Reduce exposure if ${dominantCandidate.name} drops below ${Math.max(60, dominantCandidate.score - 14)}/100 or the market regime shifts to Bear/Panic.`;

  const reasoningSummary = `The agent is prioritizing ${dominantCandidate.name} because its weighted rotation score of ${rotationScore}/100 is supported by category momentum, volume growth, and the current ${regimeName.toLowerCase()} regime while the risk score sits at ${riskScore}/100.`;

  const riskNotes = [
    `${snapshot?.risk?.label ?? "Medium"} risk conditions require ${riskProfile.toLowerCase()} sizing discipline.`,
    `Holding period of ${holdingPeriod.toLowerCase()} implies review cadence of ${HOLDING_PRESETS[holdingPeriod]?.cadence ?? "weekly"}.`,
  ];

  if (dominantCandidate.name?.toLowerCase().includes("ai")) {
    riskNotes.push("High concentration in AI narratives may increase volatility.");
  }

  if (riskScore >= 70 || regimeName === "Bear" || regimeName === "Panic") {
    riskNotes.push("Capital preservation becomes more important as regime stress rises.");
  } else {
    riskNotes.push("Momentum and liquidity are still aligned, but the agent should keep stops active.");
  }

  return {
    dominantNarrative: dominantCandidate.name,
    confidenceScore,
    recommendedAllocation: capitalBreakdown,
    suggestedWatchlist: buildWatchlist(snapshot),
    entryStrategy,
    exitStrategy,
    riskNotes,
    reasoningSummary,
    profileLabel: riskProfile,
    holdingLabel: holdingPeriod,
    capitalAmount,
  };
}
