// Adaptador: traduce tus documentos de Firestore al formato interno del grafo.
// Estructura real (firestore.rules):
//   invites/{code}                      -> { ownerUid }   (el dueño invita)
//   invites/{code}/responses/{uid}      -> { evaluatorUid } (quien evalúa; el id del doc también es su uid)
// Si cambian los nombres de campo, edítalos SOLO aquí.
const FIELDS = {
  date: ["createdAt", "updatedAt", "submittedAt", "fecha"],
};

const pick = (data, keys) => keys.map((k) => data[k]).find((v) => v != null) ?? null;

/** Timestamp de Firestore | Date | número | string -> milisegundos (o null). */
export function toMs(v) {
  if (v == null) return null;
  if (typeof v.toMillis === "function") return v.toMillis();
  if (v instanceof Date) return v.getTime();
  if (typeof v === "number") return v;
  const p = Date.parse(v);
  return Number.isNaN(p) ? null : p;
}

/** Una respuesta de invites/{code}/responses/{id}. ownerUid = dueño de la invitación (el evaluado). */
export function normalizeEvaluation(id, data, ownerUid) {
  return {
    id,
    target: ownerUid ?? data.ownerUid ?? null,
    evaluator: data.evaluatorUid ?? id,
    createdAt: toMs(pick(data, FIELDS.date)),
  };
}

export const normalizeInvite = (code, data) => ({ code, ownerUid: data.ownerUid ?? null, createdAt: toMs(data.createdAt) });

export const normalizeUser = (u) => ({ ...u, createdAt: toMs(u.createdAt), updatedAt: toMs(u.updatedAt) });
