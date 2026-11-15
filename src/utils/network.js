// Construye el grafo de seguimiento. Funciones puras: sin React ni Firebase.
const DAY = 86_400_000;

export const STAGE = { NEW: "nuevo", PROGRESS: "en-progreso", DONE: "completo", GHOST: "fantasma" };
export const STAGE_LABEL = {
  nuevo: "Sin empezar", "en-progreso": "Test a medias", completo: "Test completo", fantasma: "Usuario no encontrado",
};

/** Don con mayor puntaje de un `resultado` ({ id, [don]: 0-100 }). */
export function topGift(resultado) {
  const best = Object.entries(resultado ?? {})
    .filter(([k, v]) => k !== "id" && typeof v === "number")
    .sort((a, b) => b[1] - a[1])[0];
  return best ? { name: best[0], score: best[1] } : null;
}

function makeNode(u, totalQuestions, now) {
  const answered = (u.answers ?? []).filter((a) => a.respuesta > 0).length;
  const tested = Boolean(u.resultado);
  const last = u.updatedAt ?? u.createdAt ?? null;
  return {
    id: u.uid, name: u.name || u.email || "Sin nombre", photo: u.photo ?? null, ghost: false,
    tested, stage: tested ? STAGE.DONE : answered > 0 ? STAGE.PROGRESS : STAGE.NEW,
    progress: tested ? 1 : Math.min(1, answered / totalQuestions), top: topGift(u.resultado),
    received: 0, given: 0, idleDays: last ? Math.floor((now - last) / DAY) : null,
  };
}

const ghostNode = (id) => ({
  id, name: "Desconocido", photo: null, ghost: true, tested: false, stage: STAGE.GHOST,
  progress: 0, top: null, received: 0, given: 0, idleDays: null,
});

/** Número de componentes conexos (grupos aislados de personas). */
function countGroups(ids, edges) {
  const parent = new Map(ids.map((i) => [i, i]));
  const find = (x) => (parent.get(x) === x ? x : (parent.set(x, find(parent.get(x))), parent.get(x)));
  edges.forEach((e) => parent.set(find(e.source), find(e.target)));
  return new Set(ids.map(find)).size;
}

export function buildNetwork(users, evaluations, { totalQuestions = 40, now = Date.now(), stalledDays = 7, invites = [] } = {}) {
  const byId = new Map(users.map((u) => [u.uid, makeNode(u, totalQuestions, now)]));
  const node = (id) => byId.get(id) ?? (byId.set(id, ghostNode(id)), byId.get(id));

  // Una arista por par evaluador -> evaluado (count = veces que evaluó)
  const edgeMap = new Map();
  for (const ev of evaluations) {
    if (!ev.target || !ev.evaluator || ev.target === ev.evaluator) continue;
    const key = `${ev.evaluator}>${ev.target}`;
    const e = edgeMap.get(key) ?? { id: key, source: ev.evaluator, target: ev.target, count: 0, createdAt: ev.createdAt };
    e.count += 1;
    edgeMap.set(key, e);
  }
  const edges = [...edgeMap.values()];
  edges.forEach((e) => { node(e.source).given += 1; node(e.target).received += 1; });
  edges.forEach((e) => {
    e.evaluatorTested = byId.get(e.source).tested; // ¿quien evaluó ya hizo su propio test?
    e.targetTested = byId.get(e.target).tested;
    e.reciprocal = edgeMap.has(`${e.target}>${e.source}`);
  });

  const nodes = [...byId.values()];
  const real = nodes.filter((n) => !n.ghost);
  const evaluators = real.filter((n) => n.given > 0);

  // Invitaciones: ¿cuántas enlaces compartidos recibieron respuesta?
  const answeredOwners = new Set(edges.map((e) => e.target));
  // Dueños de enlace: por la colección invites y por el campo `inviteCode` del propio usuario
  const ownersWithInvite = new Set([...invites.map((i) => i.ownerUid), ...users.filter((u) => u.inviteCode).map((u) => u.uid)].filter(Boolean));

  const stats = {
    users: real.length,
    invites: invites.length,
    ownersWithInvite: ownersWithInvite.size,
    inviteResponseRate: ownersWithInvite.size ? [...ownersWithInvite].filter((o) => answeredOwners.has(o)).length / ownersWithInvite.size : null,
    funnel: [
      { key: "registrados", label: "Registrados", count: real.length },
      { key: "empezaron", label: "Empezaron el test", count: real.filter((n) => n.stage !== STAGE.NEW).length },
      { key: "completaron", label: "Completaron el test", count: real.filter((n) => n.tested).length },
    ],
    evaluations: edges.length,
    withEvaluation: real.filter((n) => n.received > 0).length,
    evaluators: evaluators.length,
    // Viralidad: de quienes evalúan a otros, ¿cuántos hicieron su propio test?
    conversion: evaluators.length ? evaluators.filter((n) => n.tested).length / evaluators.length : null,
    reciprocalPairs: edges.filter((e) => e.reciprocal).length / 2,
    groups: countGroups(nodes.filter((n) => n.given + n.received > 0).map((n) => n.id), edges),
  };

  const stalled = (n) => n.idleDays === null || n.idleDays >= stalledDays;
  const insights = {
    // Evaluaron a alguien pero no hicieron su test: la mejor oportunidad de conversión
    convert: evaluators.filter((n) => !n.tested).sort((a, b) => b.given - a.given),
    // Empezaron y lo dejaron
    stalled: real.filter((n) => n.stage === STAGE.PROGRESS && stalled(n)).sort((a, b) => (b.idleDays ?? 1e9) - (a.idleDays ?? 1e9)),
    // Crearon su enlace de evaluación y nadie respondió
    unanswered: real.filter((n) => ownersWithInvite.has(n.id) && n.received === 0),
    // Completaron pero nadie los ha evaluado aún
    share: real.filter((n) => n.tested && n.received === 0 && !ownersWithInvite.has(n.id)),
  };

  return { nodes, edges, stats, insights };
}
