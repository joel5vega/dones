// Lógica de la evaluación externa: funciones puras, sin React ni Firebase.
import tercera from "../data/preguntasTercera";
import { MAX_PER_ITEM } from "./scale";

/** Preguntas que verá el evaluador por cada don (1 = test corto de ~16 preguntas). */
export const PEER_QUESTIONS_PER_GIFT = 1;
export const PEER_TOP_GIFTS = 3;

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // sin 0/O/1/I/L

/** Código corto y difícil de adivinar (8 caracteres, ~40 bits). */
export function generateCode(length = 8) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
}

export const normalizeCode = (raw = "") => raw.toUpperCase().replace(/[^A-Z0-9]/g, "");

/**
 * Elige, para cada don, las preguntas que el dueño respondió con más puntaje.
 * `savedAnswers`: [{id, respuesta}] del dueño. Empates: gana la de menor id.
 * Devuelve ids ordenados (así el evaluador no ve las preguntas agrupadas por don).
 */
export function selectPeerQuestionIds(savedAnswers, categorias, perGift = PEER_QUESTIONS_PER_GIFT) {
  const byId = new Map(savedAnswers.map((a) => [a.id, a.respuesta ?? 0]));
  const ids = categorias.flatMap((c) =>
    [...c.valores]
      .sort((a, b) => (byId.get(b) ?? 0) - (byId.get(a) ?? 0) || a - b)
      .slice(0, perGift)
  );
  return [...new Set(ids)].sort((a, b) => a - b);
}

/** Primer nombre, para el texto "Joel tiene la habilidad de…". */
export const firstName = (name = "") => name.trim().split(/\s+/)[0] || "esta persona";

/** Pregunta en tercera persona con el nombre insertado. */
export const peerText = (id, name) => (tercera[id] ?? "").replaceAll("{n}", firstName(name));

/** Preguntas listas para el componente <Questions />. */
export function buildPeerQuestions(ids, allQuestions) {
  const byId = new Map(allQuestions.map((q) => [q.id, q]));
  return ids.filter((id) => byId.has(id)).map((id) => ({ ...byId.get(id), respuesta: 0 }));
}

/**
 * Puntaje por don usando solo las preguntas contestadas (misma fórmula que scoring.js:
 * peso cuadrático normalizado a 0-100). Devuelve { [nombreDon]: puntaje }.
 */
export function calculatePartialScores(answers, categorias) {
  const byId = new Map(answers.map((a) => [a.id, a.respuesta ?? 0]));
  return Object.fromEntries(
    categorias.map((c) => {
      const used = c.valores.filter((id) => byId.has(id));
      const raw = used.reduce((sum, id) => sum + byId.get(id) ** 2, 0);
      const max = used.length * MAX_PER_ITEM ** 2;
      return [c.name, max ? Math.round((raw / max) * 100) : 0];
    })
  );
}

/** Los n dones con más puntaje de un { nombre: puntaje } → ids de categoría. */
export function topGiftIds(scores, categorias, n = PEER_TOP_GIFTS) {
  return Object.entries(scores)
    .filter(([name]) => name !== "id")
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => categorias.find((c) => c.name === name)?.id)
    .filter(Boolean)
    .slice(0, n);
}
