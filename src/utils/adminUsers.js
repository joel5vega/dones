// Lógica pura para el listado admin: filas, filtros, orden y agrupación por don. Sin React ni Firebase.
const norm = (s) => (s ?? "").toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/** Ranking [{name, score}] de un `resultado` (descarta `id` y valores no numéricos). */
export function rankGifts(resultado) {
  return Object.entries(resultado ?? {})
    .filter(([k, v]) => k !== "id" && typeof v === "number")
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

/** Una fila por usuario. `tops` incluye todos los dones empatados en el puntaje máximo. */
export function toRow(p) {
  const ranking = rankGifts(p.resultado);
  const top = ranking[0] ?? null;
  return {
    uid: p.uid, name: p.name || p.email || "Sin nombre", email: p.email ?? "", photo: p.photo ?? null,
    tested: ranking.length > 0, ranking, top,
    tops: top ? ranking.filter((g) => g.score === top.score).map((g) => g.name) : [],
    date: p.resultado?.id ?? null, profile: p,
  };
}
export const toRows = (profiles) => profiles.filter(Boolean).map(toRow);

/** status: todos | completo | sin-test ; gift: todos | nombre del don (cuenta empates). */
export function filterRows(rows, { query = "", status = "todos", gift = "todos" } = {}) {
  const q = norm(query.trim());
  return rows.filter((r) =>
    (status === "todos" || (status === "completo") === r.tested) &&
    (gift === "todos" || r.tops.includes(gift)) &&
    (!q || norm(r.name).includes(q) || norm(r.email).includes(q)));
}

const KEYS = {
  name: (r) => norm(r.name),
  score: (r) => r.top?.score ?? -1,
  gift: (r) => norm(r.top?.name ?? "~"),
  date: (r) => r.date ?? "",
};
export function sortRows(rows, key = "name", dir = "asc") {
  const f = KEYS[key] ?? KEYS.name, s = dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const x = f(a), y = f(b);
    if (key === "date" || key === "score") { // los que no tienen dato siempre al final
      if ((x === "" || x === -1) !== (y === "" || y === -1)) return x === "" || x === -1 ? 1 : -1;
    }
    return (x < y ? -1 : x > y ? 1 : 0) * s || a.name.localeCompare(b.name);
  });
}

/** Agrupa por don principal. Un empate aparece en cada don empatado (por eso la suma puede superar a los usuarios). */
export function groupByTopGift(rows) {
  const map = new Map();
  rows.filter((r) => r.tested).forEach((r) =>
    r.tops.forEach((g) => (map.get(g) ?? map.set(g, []).get(g)).push(r)));
  return [...map.entries()]
    .map(([gift, members]) => ({
      gift, count: members.length,
      members: members.sort((a, b) => b.top.score - a.top.score || a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => b.count - a.count || a.gift.localeCompare(b.gift));
}
