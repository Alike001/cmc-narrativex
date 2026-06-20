function clamp(value, min, max) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return min;
  }
  return Math.max(min, Math.min(max, numeric));
}

function safeNumber(value, fallback = 0) {
  const numeric = Number(value ?? fallback);
  return Number.isFinite(numeric) ? numeric : fallback;
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
    avgPriceChange: parsePercentString(item.avgPriceChange ?? item.avg_price_change),
    volumeChange: parsePercentString(item.volumeChange ?? item.volume_change),
    marketCapChange: parsePercentString(item.marketCapChange ?? item.market_cap_change),
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

function getProfileMeta(riskProfile) {
  const profiles = {
    Conservative: {
      name: "Conservative",
      confidenceBias: -10,
      cashBias: 0.12,
      concentrationBias: -0.08,
      momentumBias: -0.45,
      stabilityBias: 0.95,
      entryStyle: "confirmation-first",
      exitStyle: "tight",
      reviewStyle: "daily",
      noteStyle: "capital preservation",
    },
    Moderate: {
      name: "Moderate",
      confidenceBias: 0,
      cashBias: 0,
      concentrationBias: 0,
      momentumBias: 0.05,
      stabilityBias: 0.55,
      entryStyle: "balanced",
      exitStyle: "discipline",
      reviewStyle: "every 2-3 sessions",
      noteStyle: "balanced",
    },
    Aggressive: {
      name: "Aggressive",
      confidenceBias: 8,
      cashBias: -0.08,
      concentrationBias: 0.09,
      momentumBias: 0.95,
      stabilityBias: 0.2,
      entryStyle: "momentum-first",
      exitStyle: "trailing",
      reviewStyle: "intraday",
      noteStyle: "opportunistic",
    },
  };

  return profiles[riskProfile] ?? profiles.Moderate;
}

function getHoldingMeta(holdingPeriod) {
  const holdings = {
    "1 Week": {
      name: "1 Week",
      confidenceBias: -5,
      cashBias: 0.08,
      momentumBias: 0.95,
      stabilityBias: -0.1,
      exposureBias: -0.04,
      cadence: "daily",
      entryBias: 0.12,
      exitBias: 0.12,
    },
    "2 Weeks": {
      name: "2 Weeks",
      confidenceBias: -1,
      cashBias: 0.03,
      momentumBias: 0.6,
      stabilityBias: 0.1,
      exposureBias: -0.01,
      cadence: "every 2-3 sessions",
      entryBias: 0.06,
      exitBias: 0.06,
    },
    "1 Month": {
      name: "1 Month",
      confidenceBias: 2,
      cashBias: -0.01,
      momentumBias: 0.22,
      stabilityBias: 0.45,
      exposureBias: 0.04,
      cadence: "weekly",
      entryBias: 0.02,
      exitBias: 0.02,
    },
    "3 Months": {
      name: "3 Months",
      confidenceBias: 4,
      cashBias: -0.05,
      momentumBias: -0.18,
      stabilityBias: 0.7,
      exposureBias: 0.08,
      cadence: "weekly",
      entryBias: -0.04,
      exitBias: -0.04,
    },
  };

  return holdings[holdingPeriod] ?? holdings["1 Week"];
}

function getRegimeMeta(regimeName) {
  const regimes = {
    Bull: {
      name: "Bull",
      confidenceBias: 8,
      cashBias: -0.05,
      momentumBias: 0.8,
      stabilityBias: 0.25,
      exposureBias: 0.06,
    },
    Euphoria: {
      name: "Euphoria",
      confidenceBias: 5,
      cashBias: 0,
      momentumBias: 1,
      stabilityBias: -0.2,
      exposureBias: 0.02,
    },
    Sideways: {
      name: "Sideways",
      confidenceBias: -4,
      cashBias: 0.08,
      momentumBias: -0.15,
      stabilityBias: 0.55,
      exposureBias: -0.08,
    },
    Bear: {
      name: "Bear",
      confidenceBias: -11,
      cashBias: 0.14,
      momentumBias: -0.55,
      stabilityBias: 0.82,
      exposureBias: -0.16,
    },
    Panic: {
      name: "Panic",
      confidenceBias: -16,
      cashBias: 0.2,
      momentumBias: -0.75,
      stabilityBias: 1,
      exposureBias: -0.24,
    },
  };

  return regimes[regimeName] ?? regimes.Sideways;
}

function scoreLifecycle(lifecycle) {
  switch (lifecycle) {
    case "Dominant":
      return 12;
    case "Building":
      return 8;
    case "Emerging":
      return 6;
    case "Peak":
      return -2;
    case "Exhausting":
      return -10;
    default:
      return 4;
  }
}

function scoreMomentum(candidate) {
  const avgPriceChange = safeNumber(candidate?.avgPriceChange ?? candidate?.avg_price_change, 0);
  const volumeChange = safeNumber(candidate?.volumeChange ?? candidate?.volume_change, 0);
  const marketCapChange = safeNumber(candidate?.marketCapChange ?? candidate?.market_cap_change, 0);

  return (
    avgPriceChange * 1.35 +
    volumeChange * 1.1 +
    marketCapChange * 0.85
  );
}

function getCandidateUniverse(snapshot) {
  const heatmap = getTopNarrativeCandidates(snapshot);
  const watchlist = Array.isArray(snapshot?.narrativeWatchlist) ? snapshot.narrativeWatchlist : [];
  const dominantAssets = snapshot?.narratives?.dominantNarrative?.assets ?? [];
  const merged = new Map();

  heatmap.forEach((candidate) => {
    merged.set(candidate.name, candidate);
  });

  watchlist.forEach((item, index) => {
    if (merged.has(item.name)) {
      return;
    }

    merged.set(item.name, {
      name: item.name,
      score: clamp(72 - index * 4, 28, 84),
      lifecycle: item.momentum === "rising" ? "Building" : "Emerging",
      avgPriceChange: item.momentum === "rising" ? 4.5 : 1.5,
      volumeChange: item.momentum === "rising" ? 5.5 : 2,
      marketCapChange: item.momentum === "rising" ? 4 : 1,
    });
  });

  dominantAssets.forEach((name, index) => {
    if (merged.has(name)) {
      return;
    }

    merged.set(name, {
      name,
      score: clamp(68 - index * 3, 24, 78),
      lifecycle: index === 0 ? "Building" : "Emerging",
      avgPriceChange: index === 0 ? 3.5 : 1,
      volumeChange: index === 0 ? 4 : 1.5,
      marketCapChange: index === 0 ? 3 : 1,
    });
  });

  return Array.from(merged.values());
}

function scoreCandidatePriority(candidate, { profile, holding, regime, riskScore }) {
  const momentum = safeNumber(scoreMomentum(candidate), 0);
  const lifecycle = scoreLifecycle(candidate.lifecycle);
  const score = safeNumber(candidate.score, 0);
  const peerScore = safeNumber(candidate.peerScore, score);
  const marketCapChange = safeNumber(candidate.marketCapChange, 0);
  const avgPriceChange = safeNumber(candidate.avgPriceChange, 0);
  const volumeChange = safeNumber(candidate.volumeChange, 0);
  const signalGap = Math.max(0, score - peerScore);
  const volatility = Math.abs(avgPriceChange - volumeChange / 3);
  const regimeTilt =
    regime.name === "Bull"
      ? momentum * 0.35 + score * 0.08
      : regime.name === "Euphoria"
        ? momentum * 0.42 - Math.max(0, lifecycle * -0.4)
        : regime.name === "Sideways"
          ? marketCapChange * 0.95 + lifecycle * 0.45
          : regime.name === "Bear"
            ? marketCapChange * 1.05 + lifecycle * 0.55 - momentum * 0.08
            : marketCapChange * 1.15 + lifecycle * 0.7 - momentum * 0.12;

  const profileTilt =
    profile.name === "Conservative"
      ? marketCapChange * profile.stabilityBias + lifecycle * 0.4 - volatility * 0.9
      : profile.name === "Aggressive"
        ? momentum * profile.momentumBias + signalGap * 0.65 - Math.max(0, 5 - score) * 0.1
        : momentum * 0.45 + marketCapChange * 0.55 + lifecycle * 0.25;

  const holdingTilt =
    holding.name === "1 Week"
      ? momentum * holding.momentumBias + signalGap * 0.5 - volatility * 0.6
      : holding.name === "2 Weeks"
        ? momentum * holding.momentumBias + volumeChange * 0.4
        : holding.name === "1 Month"
          ? marketCapChange * 0.7 + lifecycle * 0.45 + momentum * 0.2
          : marketCapChange * 1.1 + lifecycle * 0.7 - Math.max(0, momentum - 15) * 0.08;

  const riskTilt =
    profile.name === "Conservative"
      ? -riskScore * 0.16 - Math.max(0, momentum - 8) * 0.35
      : profile.name === "Moderate"
        ? -riskScore * 0.1 - Math.max(0, momentum - 12) * 0.18
        : -riskScore * 0.04 + Math.max(0, momentum - 6) * 0.08;

  return (
    score * 0.46 +
    regimeTilt +
    profileTilt +
    holdingTilt +
    riskTilt +
    lifecycle * 0.3
  );
}

function rankCandidates(snapshot, riskProfile, holdingPeriod) {
  const profile = getProfileMeta(riskProfile);
  const holding = getHoldingMeta(holdingPeriod);
  const regime = getRegimeMeta(snapshot?.regime?.active ?? "Sideways");
  const riskScore = clamp(safeNumber(snapshot?.risk?.score, 50), 0, 100);
  const candidates = getCandidateUniverse(snapshot);

  const ranked = candidates
    .map((candidate, index, list) => {
      const peerScore = list[index + 1]?.score ?? list[index - 1]?.score ?? candidate.score;
      const enhanced = {
        ...candidate,
        peerScore,
      };
      const priority = scoreCandidatePriority(enhanced, {
        profile,
        holding,
        regime,
        riskScore,
      });

      return {
        ...candidate,
        priority: safeNumber(priority, 0),
        momentumScore: safeNumber(scoreMomentum(candidate), 0),
      };
    })
    .sort((a, b) => safeNumber(b.priority, 0) - safeNumber(a.priority, 0) || safeNumber(b.score, 0) - safeNumber(a.score, 0));

  return ranked;
}

function buildAllocationWeights(rankedCandidates, snapshot, riskProfile, holdingPeriod) {
  const profile = getProfileMeta(riskProfile);
  const holding = getHoldingMeta(holdingPeriod);
  const regime = getRegimeMeta(snapshot?.regime?.active ?? "Sideways");
  const riskScore = clamp(safeNumber(snapshot?.risk?.score, 50), 0, 100);
  const riskPenalty = riskScore / 400;

  const [dominant, second, third] = rankedCandidates;
  const dominantSignal = safeNumber(dominant?.priority, safeNumber(dominant?.score, 0));
  const secondSignal = safeNumber(second?.priority, dominantSignal * 0.82);
  const thirdSignal = safeNumber(third?.priority, secondSignal * 0.8);
  const signalGap = dominant && second ? clamp(safeNumber(dominant.priority, 0) - safeNumber(second.priority, 0), 0, 40) : 0;
  const momentumBoost = safeNumber(dominant?.momentumScore, 0) / 18;

  const dominantRaw = Math.max(
    1,
    dominantSignal * (1 + profile.concentrationBias + holding.entryBias + regime.exposureBias) +
      signalGap * 0.85 +
      momentumBoost * 2.5 -
      riskPenalty * 15,
  );
  const secondRaw = Math.max(
    1,
    secondSignal * (0.82 + profile.concentrationBias / 2 + holding.entryBias / 2 + regime.exposureBias / 2) +
      safeNumber(second?.momentumScore, 0) * 0.12 +
      Math.max(0, 15 - signalGap) * 0.35,
  );
  const thirdRaw = Math.max(
    1,
    thirdSignal * (0.66 + profile.concentrationBias / 4 + holding.exitBias / 2 + regime.exposureBias / 3) +
      safeNumber(third?.marketCapChange, 0) * 0.9 +
      safeNumber(snapshot?.narratives?.narrativeStrength?.score, 0) / 15,
  );

  const exposureBase = clamp(
    0.54 +
      profile.concentrationBias +
      holding.exposureBias +
      regime.exposureBias -
      riskPenalty +
      safeNumber(dominant?.momentumScore, 0) / 300,
    0.24,
    0.94,
  );
  const cashBase = clamp(profile.cashBias + holding.cashBias + regime.cashBias + riskPenalty * 1.15, 0.06, 0.58);
  const exposurePool = clamp(1 - cashBase, 0.42, 0.94);

  const narrativePool = Math.max(0.05, exposureBase);
  const totalSignal = dominantRaw + secondRaw + thirdRaw;

  let dominantWeight = (dominantRaw / totalSignal) * exposurePool;
  let secondWeight = (secondRaw / totalSignal) * exposurePool;
  let thirdWeight = (thirdRaw / totalSignal) * exposurePool;
  let cashWeight = 1 - (dominantWeight + secondWeight + thirdWeight);

  dominantWeight = clamp(dominantWeight + narrativePool * (0.04 + profile.concentrationBias), 0.12, 0.72);
  secondWeight = clamp(secondWeight + narrativePool * 0.02, 0.06, 0.42);
  thirdWeight = clamp(thirdWeight + narrativePool * 0.01, 0.04, 0.3);
  cashWeight = clamp(1 - (dominantWeight + secondWeight + thirdWeight), 0.04, 0.7);

  const raw = [
    { name: dominant?.name ?? "Dominant Narrative", weight: dominantWeight },
    { name: second?.name ?? "Secondary Narrative", weight: secondWeight },
    { name: third?.name ?? "Tertiary Narrative", weight: thirdWeight },
    { name: "Cash", weight: cashWeight },
  ];

  const total = raw.reduce((sum, item) => sum + item.weight, 0) || 1;
  const normalized = raw.map((item, index) => {
    const percent =
      index === raw.length - 1
        ? Math.max(
            0,
            100 -
              raw
                .slice(0, -1)
                .reduce((sum, entry) => sum + Math.round((entry.weight / total) * 100), 0),
          )
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

function buildWatchlist(rankedCandidates, riskProfile, holdingPeriod) {
  const profile = getProfileMeta(riskProfile);
  const holding = getHoldingMeta(holdingPeriod);

  return rankedCandidates.slice(0, 5).map((candidate, index) => {
    const momentum = safeNumber(candidate.momentumScore, 0);
    const rank = index + 1;
    const tone =
      rank === 1
        ? "pulse"
        : profile.name === "Conservative"
          ? "signal"
          : momentum >= 8
            ? "signal"
            : momentum >= 0
              ? "neutral"
              : "amber";

    return {
      rank,
      name: candidate.name,
      score: safeNumber(candidate.score, 0),
      priority: Math.round(safeNumber(candidate.priority, 0)),
      momentum: momentum >= 8 ? "rising" : momentum >= 0 ? "steady" : "cooling",
      tone,
      note:
        profile.name === "Conservative"
          ? candidate.marketCapChange >= candidate.volumeChange
            ? "stability-led"
            : "gap-aware"
          : holding.name === "1 Week"
            ? "fast-moving"
            : holding.name === "3 Months"
              ? "trend-persistence"
              : "balanced",
    };
  });
}

function getRegimeStrength(regimeName) {
  switch (regimeName) {
    case "Bull":
      return 88;
    case "Euphoria":
      return 84;
    case "Sideways":
      return 62;
    case "Bear":
      return 38;
    case "Panic":
      return 18;
    default:
      return 55;
  }
}

function getBreadthScore(snapshot) {
  const heatmap = Array.isArray(snapshot?.narrativeHeatmap) ? snapshot.narrativeHeatmap : [];

  if (heatmap.length === 0) {
    return 55;
  }

  const positiveMoves = heatmap.filter((item) => Number(item.avgPriceChange ?? 0) > 0).length;
  const positiveVolume = heatmap.filter((item) => Number(item.volumeChange ?? 0) > 0).length;
  const avgSpread =
    heatmap.reduce((sum, item) => sum + Math.abs(Number(item.avgPriceChange ?? 0)), 0) / heatmap.length;

  return clamp(
    Math.round(30 + positiveMoves * 8 + positiveVolume * 4 + Math.min(20, avgSpread * 2)),
    35,
    92,
  );
}

function getMomentumScore(rankedCandidates) {
  const topCandidate = rankedCandidates[0];
  const secondCandidate = rankedCandidates[1];

  if (!topCandidate) {
    return 50;
  }

  const leaderMomentum = clamp(Math.round(55 + safeNumber(topCandidate.momentumScore, 0) * 1.8), 35, 95);
  const gapBoost = secondCandidate
    ? clamp(Math.round((safeNumber(topCandidate.priority, 0) - safeNumber(secondCandidate.priority, 0)) * 1.4), 0, 18)
    : 6;

  return clamp(leaderMomentum + gapBoost, 35, 95);
}

function buildConfidenceScore({
  rankedCandidates,
  snapshot,
  riskProfile,
  holdingPeriod,
}) {
  const profile = getProfileMeta(riskProfile);
  const holding = getHoldingMeta(holdingPeriod);
  const regime = getRegimeMeta(snapshot?.regime?.active ?? "Sideways");
  const riskScore = clamp(safeNumber(snapshot?.risk?.score, 50), 0, 100);
  const narrativeStrength = clamp(
    safeNumber(snapshot?.narratives?.narrativeStrength?.score, safeNumber(rankedCandidates[0]?.score, 50)),
    0,
    100,
  );
  const regimeStrength = getRegimeStrength(regime.name);
  const breadthScore = getBreadthScore(snapshot);
  const momentumScore = getMomentumScore(rankedCandidates);
  const topCandidate = rankedCandidates[0] ?? {
    score: 50,
    priority: 50,
    momentumScore: 50,
  };
  const signalGap = clamp(
    safeNumber(topCandidate.priority, 50) - safeNumber(rankedCandidates[1]?.priority, safeNumber(topCandidate.priority, 50)),
    0,
    30,
  );
  const quality =
    narrativeStrength * 0.28 +
    regimeStrength * 0.18 +
    breadthScore * 0.22 +
    momentumScore * 0.18 +
    (100 - riskScore) * 0.14;

  const profileTilt = profile.confidenceBias * 0.6 + profile.stabilityBias * 2;
  const holdingTilt = holding.confidenceBias * 0.8 + holding.stabilityBias * 2;
  const regimeTilt =
    regime.name === "Bull"
      ? 4
      : regime.name === "Euphoria"
        ? 3
        : regime.name === "Sideways"
          ? 0
          : regime.name === "Bear"
            ? -5
            : -8;
  const signalTilt = signalGap >= 12 ? 4 : signalGap >= 6 ? 2 : 0;
  const concentrationPenalty = signalGap < 5 ? 6 : signalGap < 10 ? 3 : 0;
  const riskPenalty = riskScore >= 70 ? 8 : riskScore >= 55 ? 4 : 0;
  const rawScore = Math.round(
    quality * 0.72 +
      profileTilt +
      holdingTilt +
      regimeTilt +
      signalTilt -
      concentrationPenalty -
      riskPenalty,
  );

  return clamp(Number.isFinite(rawScore) ? rawScore : 0, 0, 100);
}

function buildEntryStrategy({
  dominantCandidate,
  rankedCandidates,
  regimeName,
  riskScore,
  riskProfile,
  holdingPeriod,
}) {
  const profile = getProfileMeta(riskProfile);
  const holding = getHoldingMeta(holdingPeriod);
  const secondCandidate = rankedCandidates[1];
  const topThreshold = Math.max(52, Math.round(dominantCandidate.score - (riskProfile === "Conservative" ? 18 : riskProfile === "Aggressive" ? 10 : 14)));
  const reviewCadence = holding.cadence;

  if (profile.name === "Conservative") {
    const secondClause = secondCandidate
      ? `Keep ${secondCandidate.name} on the list only as a confirmation signal, not as a sizing anchor.`
      : `Keep the broader basket as confirmation, not as a sizing anchor.`;

    return [
      `Stage into ${dominantCandidate.name} only after it holds above a ${topThreshold}/100 rotation read and the ${regimeName.toLowerCase()} regime stops deteriorating.`,
      `Use ${reviewCadence} reviews and prefer pullback entries over strength-chasing.`,
      riskScore >= 55
        ? "Keep the first tranche small until risk normalizes."
        : "Only add size once breadth and liquidity stay aligned for another check-in.",
      secondClause,
    ].join(" ");
  }

  if (profile.name === "Aggressive") {
    return [
      `Press ${dominantCandidate.name} and the leading basket while the signal stack remains constructive and the ${regimeName.toLowerCase()} regime is still supportive.`,
      `Use ${reviewCadence} checks, but allow earlier adds when momentum expands instead of waiting for deep retracements.`,
      secondCandidate
        ? `If ${secondCandidate.name} keeps climbing, scale the second-ranked theme as a momentum add rather than waiting for a full reset.`
        : `If the lead keeps widening, add to the basket instead of waiting for a reset.`,
    ].join(" ");
  }

  return [
    `Scale into ${dominantCandidate.name} in measured tranches while the ${regimeName.toLowerCase()} regime and rotation score stay aligned.`,
    `Use ${reviewCadence} reviews and bias entries toward confirmation on pullbacks or shallow consolidations.`,
    secondCandidate
      ? `Let ${secondCandidate.name} remain a secondary add only if its momentum stays constructive relative to the leader.`
      : `Keep the second-best theme as a backup entry only if it continues to confirm.`,
    riskScore >= 60
      ? "Size with a little more cash reserve until breadth improves."
      : "Maintain a balanced cash buffer so the next rotation can be added without forcing an exit.",
  ].join(" ");
}

function buildExitStrategy({
  dominantCandidate,
  rankedCandidates,
  regimeName,
  riskScore,
  riskProfile,
  holdingPeriod,
}) {
  const profile = getProfileMeta(riskProfile);
  const holding = getHoldingMeta(holdingPeriod);
  const secondCandidate = rankedCandidates[1];
  const exitThreshold = Math.max(38, Math.round(dominantCandidate.score - (riskProfile === "Conservative" ? 22 : riskProfile === "Aggressive" ? 14 : 18)));

  if (profile.name === "Conservative") {
    return [
      `Reduce exposure if ${dominantCandidate.name} slips below ${exitThreshold}/100 or the ${regimeName.toLowerCase()} regime weakens further.`,
      `Take profits faster on the weaker legs and use the ${holding.cadence} review cadence to avoid letting gains round-trip.`,
      riskScore >= 55
        ? "If breadth contracts, protect capital first and redeploy later."
        : "If the tape stays orderly, keep some exposure but stay ready to de-risk quickly.",
    ].join(" ");
  }

  if (profile.name === "Aggressive") {
    return [
      `Stay in the trade until ${dominantCandidate.name} loses momentum, the top-ranked basket rolls over, or the regime flips decisively away from support.`,
      `Use trailing exits around ${exitThreshold}/100, but avoid clipping strength too early while the move keeps expanding.`,
      secondCandidate
        ? `If ${secondCandidate.name} overtakes the leader, rotate rather than fully liquidating first.`
        : `If a new leader emerges, rotate instead of flattening everything immediately.`,
    ].join(" ");
  }

  return [
    `Trim exposure if ${dominantCandidate.name} falls below ${exitThreshold}/100, or if the ${regimeName.toLowerCase()} regime stops confirming the move.`,
    `Use ${holding.cadence} checks and keep exits disciplined rather than emotional.`,
    riskScore >= 60
      ? "If risk keeps rising, reduce the basket faster and keep more cash available."
      : "If the move remains orderly, rotate from weaker names into the leader instead of exiting all at once.",
  ].join(" ");
}

function buildRiskNotes({
  rankedCandidates,
  regimeName,
  riskScore,
  riskProfile,
  holdingPeriod,
}) {
  const profile = getProfileMeta(riskProfile);
  const holding = getHoldingMeta(holdingPeriod);
  const dominantCandidate = rankedCandidates[0];
  const secondCandidate = rankedCandidates[1];
  const topGap = Math.max(
    0,
    safeNumber(dominantCandidate?.priority, 0) - safeNumber(secondCandidate?.priority, safeNumber(dominantCandidate?.priority, 0)),
  );

  const notes = [
    `${profile.name} sizing is shaping the trade, so keep position math aligned with the ${holding.cadence} review cadence.`,
    riskScore >= 60
      ? `The ${regimeName.toLowerCase()} regime is still noisy enough that capital preservation matters before adding more risk.`
      : `The current ${regimeName.toLowerCase()} regime still supports active risk-taking, but only if the leader keeps its edge.`,
    dominantCandidate
      ? `${dominantCandidate.name} is the highest-priority theme, yet the gap to the next candidate is ${Math.round(topGap)} priority points, so watch for rotation if that gap narrows.`
      : "The current leader still needs fresh confirmation before it can be treated as durable.",
  ];

  if (profile.name === "Conservative") {
    notes.push(
      dominantCandidate?.momentumScore > 14
        ? "Momentum is strong enough to help the trade, but not strong enough to justify chasing size."
        : "The move is not strong enough to justify aggressive concentration, so keep a higher cash buffer.",
    );
  } else if (profile.name === "Aggressive") {
    notes.push(
      dominantCandidate?.momentumScore > 12
        ? "Momentum is strong enough to justify leaning in, but keep a trailing exit in place."
        : "Momentum is mixed, so the trade needs faster reaction rather than a wider stop-and-hope posture.",
    );
  } else {
    notes.push(
      dominantCandidate?.marketCapChange >= dominantCandidate?.volumeChange
        ? "Breadth is good enough to support a balanced posture."
        : "Volume is outrunning breadth, so keep the basket diversified and monitor follow-through.",
    );
  }

  return notes;
}

export function buildNarrativeRotationAgent(snapshot, inputs) {
  const riskProfile = inputs?.riskProfile ?? "Moderate";
  const holdingPeriod = inputs?.holdingPeriod ?? "1 Week";
  const capitalAmount = Math.max(0, safeNumber(inputs?.capitalAmount, 0));

  const rankedCandidates = rankCandidates(snapshot, riskProfile, holdingPeriod);
  const dominantCandidate = rankedCandidates[0] ?? {
    name: snapshot?.narratives?.dominantNarrative?.name ?? "Dominant Narrative",
    score: 50,
    lifecycle: snapshot?.narratives?.narrativeLifecycle?.state ?? "Building",
    avgPriceChange: 0,
    volumeChange: 0,
    marketCapChange: 0,
    priority: 50,
    momentumScore: 0,
  };
  const regimeName = snapshot?.regime?.active ?? "Sideways";
  const riskScore = clamp(safeNumber(snapshot?.risk?.score, 50), 0, 100);
  const narrativeStrength = clamp(safeNumber(snapshot?.narratives?.narrativeStrength?.score, dominantCandidate.score), 0, 100);
  const rotationScore = clamp(safeNumber(snapshot?.narratives?.narrativeRotationScore?.score, dominantCandidate.score), 0, 100);
  const confidenceScore = buildConfidenceScore({
    rankedCandidates,
    snapshot,
    riskProfile,
    holdingPeriod,
  });

  const allocation = buildAllocationWeights(rankedCandidates, snapshot, riskProfile, holdingPeriod);
  const capitalBreakdown = allocation.map((item) => ({
    ...item,
    amount: capitalAmount > 0 ? (capitalAmount * item.percent) / 100 : 0,
  }));

  const entryStrategy = buildEntryStrategy({
    dominantCandidate,
    rankedCandidates,
    regimeName,
    riskScore,
    riskProfile,
    holdingPeriod,
  });

  const exitStrategy = buildExitStrategy({
    dominantCandidate,
    rankedCandidates,
    regimeName,
    riskScore,
    riskProfile,
    holdingPeriod,
  });

  const reasoningSummary = [
    `The agent is prioritizing ${dominantCandidate.name} with a rotation score of ${Math.round(rotationScore)}/100 and a confidence read of ${confidenceScore}/100.`,
    `That ranking is shaped by current narrative strength (${Math.round(narrativeStrength)}/100), category momentum, market regime, risk score, and the ${riskProfile.toLowerCase()} / ${holdingPeriod.toLowerCase()} setup.`,
  ].join(" ");

  const riskNotes = buildRiskNotes({
    rankedCandidates,
    regimeName,
    riskScore,
    riskProfile,
    holdingPeriod,
  });

  const prioritizedWatchlist = buildWatchlist(rankedCandidates, riskProfile, holdingPeriod);

  return {
    dominantNarrative: dominantCandidate.name,
    confidenceScore,
    recommendedAllocation: capitalBreakdown,
    suggestedWatchlist: prioritizedWatchlist.map((item) => item.name),
    prioritizedWatchlist,
    entryStrategy,
    exitStrategy,
    riskNotes,
    reasoningSummary,
    profileLabel: riskProfile,
    holdingLabel: holdingPeriod,
    capitalAmount,
  };
}
