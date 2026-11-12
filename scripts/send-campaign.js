/**
 * Envía correos por olas con Nodemailer + Gmail.
 *
 *   export GOOGLE_APPLICATION_CREDENTIALS=/ruta/clave.json
 *   export GMAIL_USER=tu-correo@gmail.com
 *   export GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
 *
 *   npm run campaign                          → simulación (no envía)
 *   npm run campaign -- --test                → envía SOLO a scopos.soporte@gmail.com (simula si no --send)
 *   npm run campaign -- --test --send         → envía de verdad al correo de prueba
 *   npm run campaign -- --send --limit=100    → ola 1: hasta 100 correos reales
 *   npm run campaign -- --send --limit=100    → ola 2: los siguientes 100 (omite los ya enviados)
 *   npm run campaign -- --send --only-unfinished  → solo a los 34 sin resultado
 */
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import nodemailer from "nodemailer";

const SEND = process.argv.includes("--send");
const TEST = process.argv.includes("--test");
const ONLY_UNFINISHED = process.argv.includes("--only-unfinished");
const LIMIT = parseInt(
  process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1] || "100",
  10
);

const BATCH_SIZE = 20;
const DELAY_BETWEEN_BATCHES_MS = 60_000;
const IMAGE_CID = "radar@dones";
const AVATAR_CID = "avatar@dones";
const TEST_EMAIL = "scopos.soporte@gmail.com";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
  console.error("Faltan GMAIL_USER o GMAIL_APP_PASSWORD en el entorno.");
  process.exit(1);
}

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function top3(resultado) {
  return Object.entries(resultado)
    .filter(([k]) => k !== "id")
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function buildResultsHtml({ name, top }) {
  const topList = top
    .map((t, i) => `<li>${i + 1}. ${t.name} (${t.score}%)</li>`)
    .join("");
  return `
    <div style="font-family:Arial,sans-serif;color:#1d2b44;max-width:560px;margin:0 auto">
      <h2 style="color:#052f5f">Hola ${name || "amigo"},</h2>
      <p>Actualizamos el cálculo de tus dones. Con tus mismas respuestas recalculamos tu resultado.</p>
      <p><strong>Tus dones principales:</strong></p>
      <ol>${topList}</ol>
      <p>Este es tu radar actualizado:</p>
      <img src="cid:${IMAGE_CID}" alt="Radar de dones" style="max-width:100%;height:auto;border-radius:12px" />
      <p>Ver mi perfil: <a href="https://joel5vega.github.io/dones/#/perfil">https://joel5vega.github.io/dones/#/perfil</a></p>
      <p><strong>Novedad:</strong> evaluación de alguien más. Pide a alguien que te conozca que responda ~16 preguntas cortas sobre ti y compara su visión con la tuya.</p>
      <p>Crea tu enlace en: <a href="https://joel5vega.github.io/dones/#/evaluaciones">https://joel5vega.github.io/dones/#/evaluaciones</a></p>
      <p>Que Dios te bendiga.</p>
    </div>
  `;
}

function buildUnfinishedHtml({ name }) {
  return `
    <div style="font-family:Arial,sans-serif;color:#1d2b44;max-width:560px;margin:0 auto">
      <h2 style="color:#052f5f">Hola ${name || "amigo"},</h2>
      <p>Vimos que empezaste el test de dones pero no lo terminaste. ¡Te faltó poco!</p>
      <p>Termínalo aquí y descubre tus dones principales:</p>
      <p><a href="https://joel5vega.github.io/dones/#/test" style="display:inline-block;background:#052f5f;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">Terminar mi test</a></p>
      <p>Que Dios te bendiga.</p>
    </div>
  `;
}

async function fetchAvatarBuffer(url) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch {
    return null;
  }
}

async function main() {
  console.log(
    `Modo: ${SEND ? "ENVÍO REAL" : "SIMULACIÓN"}${TEST ? " | TEST" : ""}${ONLY_UNFINISHED ? " | SOLO INCOMPLETOS" : ""} | límite: ${LIMIT}`
  );

  // ---- OLA DE PRUEBA ----
  if (TEST) {
    const fakeUser = {
      name: "Joel (prueba)",
      email: TEST_EMAIL,
      resultado: { Fe: 85, Apostolado: 80, Dar: 60 },
      radarImageBase64: null, // se enviará sin radar si no hay
      photo: null,
    };
    console.log(`\n--- PRUEBA: enviando solo a ${TEST_EMAIL} ---`);
    if (!SEND) {
      console.log("Simulación: no se envió. Usa --send para enviar de verdad.");
      return;
    }
    const top = top3(fakeUser.resultado);
    const attachments = [];
    if (fakeUser.radarImageBase64) {
      attachments.push({
        filename: "radar.png",
        content: Buffer.from(fakeUser.radarImageBase64, "base64"),
        cid: IMAGE_CID,
      });
    }
    try {
      await transporter.sendMail({
        from: `"Dones" <${GMAIL_USER}>`,
        to: TEST_EMAIL,
        subject: "[PRUEBA] Tus resultados de dones actualizados",
        html: buildResultsHtml({ name: fakeUser.name, top }),
        attachments,
      });
      console.log(`✅ Enviado a ${TEST_EMAIL}`);
    } catch (e) {
      console.error(`❌ Error: ${e.message}`);
    }
    return;
  }

  // ---- CAMPAÑA REAL ----
  const snap = await db.collection("users").get();
  let recipients = snap.docs
    .map((doc) => ({ uid: doc.id, ...doc.data() }))
    .filter((u) => u.email);

  if (ONLY_UNFINISHED) {
    recipients = recipients.filter((u) => !u.resultado);
  } else {
    recipients = recipients.filter((u) => u.resultado && !u.emailSentAt);
  }

  console.log(`Total destinatarios: ${recipients.length}`);

  if (!ONLY_UNFINISHED) {
    const sinImagen = recipients.filter((u) => !u.radarImageBase64).length;
    if (sinImagen)
      console.log(`⚠️ ${sinImagen} usuario(s) sin radarImageBase64: se enviarán sin radar.`);
  }

  const toSend = recipients.slice(0, LIMIT);
  console.log(`Se enviarán ${toSend.length} correos en esta ola (límite: ${LIMIT}).`);

  if (!SEND) {
    console.log("\nSimulación: no se envió nada. Usa --send para enviar.");
    return;
  }

  for (let i = 0; i < toSend.length; i += BATCH_SIZE) {
    const batch = toSend.slice(i, i + BATCH_SIZE);
    console.log(`\n--- Ola ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} correos) ---`);

    for (const user of batch) {
      try {
        const attachments = [];

        // Radar
        if (user.radarImageBase64) {
          attachments.push({
            filename: "radar.png",
            content: Buffer.from(user.radarImageBase64, "base64"),
            cid: IMAGE_CID,
          });
        }

        // Avatar
        const avatarBuffer = await fetchAvatarBuffer(user.photo);
        if (avatarBuffer) {
          attachments.push({
            filename: "avatar.jpg",
            content: avatarBuffer,
            cid: AVATAR_CID,
          });
        }

        const html = ONLY_UNFINISHED
          ? buildUnfinishedHtml({ name: user.name })
          : buildResultsHtml({ name: user.name, top: top3(user.resultado) });

        await transporter.sendMail({
          from: `"Dones" <${GMAIL_USER}>`,
          to: user.email,
          subject: ONLY_UNFINISHED
            ? "Termina tu test de dones"
            : "Tus resultados de dones actualizados + nueva función",
          html,
          attachments,
        });

        // Marcar como enviado (solo campaña con resultado)
        if (!ONLY_UNFINISHED) {
          await db.collection("users").doc(user.uid).update({
            emailSentAt: new Date(),
          });
        }

        console.log(`✅ ${user.email}`);
      } catch (e) {
        console.error(`❌ ${user.email}: ${e.message}`);
      }
    }

    if (i + BATCH_SIZE < toSend.length) {
      console.log(`Esperando ${DELAY_BETWEEN_BATCHES_MS / 1000}s para la siguiente ola...`);
      await sleep(DELAY_BETWEEN_BATCHES_MS);
    }
  }
  console.log("\nCampaña finalizada.");
}

main().catch(console.error);