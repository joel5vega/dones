/**
 * Recalcula los resultados antiguos con el cálculo actual.
 *
 *   1. Firebase Console → Configuración del proyecto → Cuentas de servicio → "Generar clave privada"
 *   2. export GOOGLE_APPLICATION_CREDENTIALS=/ruta/a/clave.json     (NO la subas al repo)
 *   3. npm run migrate            → simulación (no escribe nada)
 *      npm run migrate -- --apply → aplica y guarda un respaldo JSON
 *      --cutoff=YYYY-MM-DD        → anula NEW_SCORING_SINCE (src/utils/migration.js)
 */
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { writeFileSync } from "node:fs";
import { runMigration } from "./migrationRunner.js";

const apply = process.argv.includes("--apply");
const cutoff = process.argv.find((a) => a.startsWith("--cutoff="))?.split("=")[1];

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

await runMigration(db, {
  apply,
  ...(cutoff && { cutoff }),
  beforeApply: (backup) => {
    const file = `backup-users-${new Date().toISOString().slice(0, 10)}.json`;
    writeFileSync(file, JSON.stringify(backup, null, 2));
    console.log(`Respaldo guardado en ${file}`);
  },
});
if (!apply) console.log("\nSimulación: no se escribió nada. Usa --apply para aplicar.");