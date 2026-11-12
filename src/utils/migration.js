// Migración del cálculo antiguo (suma lineal, respuestas 0-3) al actual
// (peso cuadrático normalizado a 0-100, respuestas 1-4). Funciones puras.
import categorias from "../data/categorias";
import { calculateScores, toResultado } from "./scoring";

/** Se guarda en users/{uid}.scoringVersion; marca resultados con el cálculo actual. */
export const SCORING_VERSION = 2;

/**
 * ⚠️ AJUSTAR: día en que publicaste el cálculo actual (escala 1-4, puntaje 0-100).
 * Un resultado SIN marca `scoringVersion` guardado antes de este día se considera antiguo.
 * (Los valores de los puntajes no sirven para distinguirlos: versiones antiguas de la app
 *  produjeron sumas de hasta 12.)
 */
export const NEW_SCORING_SINCE = "2026-11-01";

/**
 * "none"    → sin resultado guardado
 * "current" → cálculo actual (con marca, o guardado desde NEW_SCORING_SINCE)
 * "legacy"  → cálculo antiguo (sin marca y anterior a NEW_SCORING_SINCE, o sin fecha)
 */
export function scoringStatus(data, cutoff = NEW_SCORING_SINCE) {
  if (!data?.resultado) return "none";
  if (data.scoringVersion >= SCORING_VERSION) return "current";
  const day = data.resultado.id; // "YYYY-MM-DD": se compara como texto
  return typeof day === "string" && day >= cutoff ? "current" : "legacy";
}

/** Máximo de la escala antigua de ese usuario, deducido de sus respuestas (mínimo 3). */
export const legacyMaxOf = (answers = []) =>
  Math.max(3, ...answers.map((a) => (typeof a.respuesta === "number" ? a.respuesta : 0)));

/** Antigua 0..legacyMax → nueva 1..4 conservando el orden (con 0-3 es simplemente +1). */
export const legacyToNew = (value, legacyMax) =>
  legacyMax === 3 ? value + 1 : 1 + Math.round((value * 3) / legacyMax);

/**
 * Recalcula un usuario antiguo con sus mismas respuestas y el cálculo actual.
 * status: current | none | legacy-no-answers | migrated
 */
export function migrateUser(data, cutoff = NEW_SCORING_SINCE) {
  const status = scoringStatus(data, cutoff);
  if (status !== "legacy") return { status };

  const answers = (data.answers ?? []).filter((a) => typeof a.respuesta === "number");
  if (answers.length === 0) return { status: "legacy-no-answers" }; // no hay de dónde recalcular

  const legacyMax = legacyMaxOf(answers);
  const shifted = answers.map(({ id, respuesta }) => ({ id, respuesta: legacyToNew(respuesta, legacyMax) }));
  const ranking = calculateScores(shifted, categorias);
  const parsed = new Date(data.resultado.id);
  const resultado = toResultado(ranking, Number.isNaN(parsed.getTime()) ? new Date() : parsed);
  return { status: "migrated", answers: shifted, resultado, legacyMax };
}
