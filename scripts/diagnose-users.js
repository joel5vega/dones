/**
 * SOLO LECTURA. Agrupa los usuarios según la forma de su documento.
 *   export GOOGLE_APPLICATION_CREDENTIALS=/ruta/clave.json
 *   npm run diagnose
 */
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { shapeOf } from "./shape.js";

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

const snap = await db.collection("users").get();

const groups = new Map();
for (const doc of snap.docs) {
  const data = doc.data();
  const s = shapeOf(data);
  if (!groups.has(s.group)) groups.set(s.group, []);
  groups.get(s.group).push({
    email: data.email ?? doc.id,
    updated: doc.updateTime?.toDate().toISOString().slice(0, 10),
    answered: s.answered,
    nonZero: s.nonZero,
    result: data.result,
    progreso: data.progreso,
    keys: s.keys.join(","),
  });
}

for (const [group, list] of [...groups].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`\n■ ${group}: ${list.length}`);
  list.slice(0, 5).forEach((u) => console.log("   ", JSON.stringify(u)));
}