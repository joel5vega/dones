// Lógica de la migración contra una base tipo Firestore Admin (inyectada, así es testeable).
import { migrateUser, scoringStatus, SCORING_VERSION, NEW_SCORING_SINCE } from "../src/utils/migration.js";
import { topGiftIds } from "../src/utils/peer.js";
import categorias from "../src/data/categorias.js";

const top3 = (resultado) => {
  const { id, ...scores } = resultado;
  return topGiftIds(scores, categorias);
};

export async function runMigration(db, { apply = false, cutoff = NEW_SCORING_SINCE, beforeApply, log = console.log } = {}) {
  const snap = await db.collection("users").get();
  const report = { total: snap.docs.length, current: 0, none: 0, noAnswers: [], migrated: [], top1Changed: 0 };
  const plans = [];

  // Pasada 1: calcular (no escribe nada)
  for (const doc of snap.docs) {
    const data = doc.data();
    const res = migrateUser(data, cutoff);
    if (res.status === "current") report.current++;
    else if (res.status === "none") report.none++;
    else if (res.status === "legacy-no-answers") report.noAnswers.push(data.email ?? doc.id);
    else {
      plans.push({ doc, data, res });
      report.migrated.push(data.email ?? doc.id);
      const before = top3(data.resultado).map((id) => categorias.find((c) => c.id === id)?.name).join("/");
      const after = top3(res.resultado).map((id) => categorias.find((c) => c.id === id)?.name).join("/");
      log(`  • ${data.email ?? doc.id} | ${data.resultado.id} | escala 0-${res.legacyMax} | ${before} → ${after}`);
      if (res.legacyMax !== 3) report.oddScale = (report.oddScale ?? 0) + 1;
      if (top3(data.resultado)[0] !== top3(res.resultado)[0]) report.top1Changed++;
    }
  }

  log(`Corte: resultados sin marca anteriores a ${cutoff} se consideran antiguos.`);
  log(`Usuarios: ${report.total} | ya actuales: ${report.current} | sin test: ${report.none}`);
  log(`A migrar: ${plans.length} | sin respuestas guardadas (no recalculables): ${report.noAnswers.length}`);
  log(`Cambia su don principal: ${report.top1Changed} de ${plans.length}`);
  if (report.oddScale)
    log(`⚠️ ${report.oddScale} usuario(s) tienen respuestas fuera de 0-3: se reescalan a 1-4 proporcionalmente. Revisa las líneas "escala 0-N".`);
  if (!apply || plans.length === 0) return report;

  // Respaldo ANTES de escribir
  await beforeApply?.(plans.map(({ doc, data }) => ({ uid: doc.id, ...data })));

  // Pasada 2: escribir
  for (const { doc, data, res } of plans) {
    await doc.ref.update({
      answers: res.answers,
      resultado: res.resultado,
      scoringVersion: SCORING_VERSION,
      legacy: { resultado: data.resultado, answers: data.answers ?? [], migratedAt: new Date() },
    });

    // Historial: el día del resultado se actualiza; los demás quedan marcados como antiguos
    const { id: day, ...scores } = res.resultado;
    const subs = doc.ref.collection("submissions");
    await subs.doc(day).set({ ...scores, scoringVersion: SCORING_VERSION }, { merge: true });
    const older = await subs.get();
    for (const s of older.docs) {
      if (s.id !== day && s.data().scoringVersion == null) await s.ref.update({ scoringVersion: 1 });
    }
  }
  log(`✔ ${plans.length} usuarios migrados.`);
  return report;
}

export { scoringStatus };
