// Única capa que habla con Firestore. Los componentes nunca importan `db`.
import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { SCORING_VERSION } from "../utils/migration";

const userRef = (uid) => doc(db, "users", uid);
// Guardamos solo lo necesario: [{ id, respuesta }]
const slim = (answers) => answers.map(({ id, respuesta }) => ({ id, respuesta }));

export async function getOrCreateProfile(user) {
  const snap = await getDoc(userRef(user.uid));
  if (snap.exists()) return { uid: user.uid, ...snap.data() };

  const profile = {
    email: user.email,
    name: user.displayName,
    photo: user.photoURL,
    answers: [],
  };
  await setDoc(userRef(user.uid), profile);
  return { uid: user.uid, ...profile };
}

export const saveProgress = (uid, answers) =>
  updateDoc(userRef(uid), { answers: slim(answers) });

export async function saveResult(uid, answers, resultado) {
  const { id: submissionId, ...scores } = resultado;
  await updateDoc(userRef(uid), {
    answers: slim(answers),
    resultado,
    scoringVersion: SCORING_VERSION,
  });
  // Historial: un documento por día
  await setDoc(doc(db, "users", uid, "submissions", submissionId), {
    ...scores,
    scoringVersion: SCORING_VERSION,
    createdAt: serverTimestamp(),
  });
}

// Solo el admin puede listar todos (lo garantizan las reglas de Firestore)
export async function getAllProfiles() {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}

export async function saveRadarImage(uid, base64) {
  await updateDoc(doc(db, "users", uid), { radarImageBase64: base64 });
}

