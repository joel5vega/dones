// Encola correos en la colección `mail`; la extensión "Trigger Email from Firestore" los envía.
import { collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "../config/firebase";

const CHUNK = 400; // límite de Firestore: 500 operaciones por lote

/** messages: [{ uid, to, subject, text, html }] → número de correos encolados */
export async function queueEmails(messages, kind = "results-update-v2") {
  for (let i = 0; i < messages.length; i += CHUNK) {
    const batch = writeBatch(db);
    messages.slice(i, i + CHUNK).forEach(({ uid, to, subject, text, html }) => {
      batch.set(doc(collection(db, "mail")), {
        to,
        message: { subject, text, html },
        meta: { uid, kind },
        createdAt: serverTimestamp(),
      });
    });
    await batch.commit();
  }
  return messages.length;
}
