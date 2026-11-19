const clamp = (value) => Math.max(0, Math.min(100, value));

function normalizeList(value) {
  return Array.isArray(value) ? value.map((item) => String(item).trim().toLowerCase()) : [];
}

function overlapScore(selected, offered) {
  const a = normalizeList(selected);
  const b = normalizeList(offered);
  if (!a.length || !b.length) return null;
  const matches = a.filter((item) => b.includes(item)).length;
  return matches ? (matches / Math.min(a.length, b.length)) * 100 : 0;
}

function giftScore(results, gifts) {
  if (!results || !gifts?.length) return null;
  const entries = Object.entries(results)
    .filter(([key, value]) => key !== "id" && Number.isFinite(Number(value)));
  if (!entries.length) return null;
  const selected = new Set(gifts.map((gift) => gift.toLowerCase()));
  const matching = entries.filter(([name]) => selected.has(name.toLowerCase()));
  if (!matching.length) return 0;
  return matching.reduce((sum, [, score]) => sum + clamp(Number(score)), 0) / matching.length;
}

/**
 * Explainable recommendation score, not a spiritual diagnosis.
 * Gifts 40%, interests 25%, skills 15%, causes 10%, preferred context 10%.
 * Missing dimensions are removed from the denominator.
 */
export function scoreMinistry(ministry, discernment = {}, resultado = {}) {
  const candidates = [
    { key: "dones", weight: 0.40, score: giftScore(resultado, ministry.gifts) },
    { key: "intereses", weight: 0.25, score: overlapScore(discernment.interests, ministry.interests) },
    { key: "habilidades", weight: 0.15, score: overlapScore(discernment.skills, ministry.skills) },
    { key: "causas", weight: 0.10, score: overlapScore(discernment.causes, ministry.causes) },
    { key: "ambito", weight: 0.10, score: ministry.scope === "both" || !discernment.context || discernment.context === "both" || ministry.scope === discernment.context ? 100 : 0 },
  ];
  const hasMatchingSignal = candidates.some((item) => item.key !== "ambito" && item.score !== null);
  const dimensions = candidates.filter((item) => item.score !== null && (item.key !== "ambito" || hasMatchingSignal));
  const totalWeight = dimensions.reduce((sum, item) => sum + item.weight, 0);
  const score = totalWeight ? Math.round(dimensions.reduce((sum, item) => sum + item.score * item.weight, 0) / totalWeight) : 0;
  return {
    ...ministry,
    matchScore: score,
    reasons: dimensions.filter((item) => item.score >= 40).map((item) => ({
      dones: "Dones que podrían ponerse al servicio",
      intereses: "Intereses que expresaste",
      habilidades: "Habilidades que puedes aportar",
      causas: "Necesidades y causas que te conmueven",
      ambito: "Ámbito de servicio que prefieres",
    }[item.key])),
    dimensions: Object.fromEntries(dimensions.map(({ key, score: value }) => [key, Math.round(value)])),
  };
}

export function recommendMinistries(ministries, discernment, resultado) {
  const hasProfile = ["interests", "skills", "causes"].some((key) => normalizeList(discernment?.[key]).length > 0);
  const hasResults = Object.entries(resultado || {}).some(([key, value]) => key !== "id" && Number.isFinite(Number(value)));
  if (!hasProfile && !hasResults) return [];
  return ministries
    .map((ministry) => scoreMinistry(ministry, discernment, resultado))
    .filter((ministry) => ministry.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}
