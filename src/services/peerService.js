// Invitaciones y respuestas de evaluadores externos en Firestore.
//   invites/{code}                      -> { ownerUid, ownerName, ownerPhoto, questionIds }
//   invites/{code}/responses/{uid}      -> respuesta de cada evaluador
import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import categorias from "../data/categorias";
import { generateCode, selectPeerQuestionIds } from "../utils/peer";

const inviteRef = (code) => doc(db, "invites", code);
const responseRef = (code, uid) => doc(db, "invites", code, "responses", uid);

/** Datos públicos de una invitación (null si no existe). */
export async function getInvite(code) {
  const snap = await getDoc(inviteRef(code));
  return snap.exists() ? { code, ...snap.data() } : null;
}

/**
 * Crea la invitación del usuario o, si ya tiene, actualiza sus preguntas
 * con las respuestas de su último test (el código y las respuestas se conservan).
 */
export async function createOrRefreshInvite(user) {
  const userDoc = doc(db, "users", user.uid);
  const snap = await getDoc(userDoc);
  const { answers = [], inviteCode } = snap.data() ?? {};

  const data = {
    ownerUid: user.uid,
    ownerName: user.displayName ?? "",
    ownerPhoto: user.photoURL ?? "",
    questionIds: selectPeerQuestionIds(answers, categorias),
  };

  if (inviteCode) {
    await updateDoc(inviteRef(inviteCode), data);
    return { code: inviteCode, ...data };
  }
  const code = generateCode();
  await setDoc(inviteRef(code), { ...data, createdAt: serverTimestamp() });
  await updateDoc(userDoc, { inviteCode: code });
  return { code, ...data };
}

export async function getMyResponse(code, uid) {
  const snap = await getDoc(responseRef(code, uid));
  return snap.exists() ? snap.data() : null;
}

export const submitResponse = (code, evaluator, { answers, topGifts, scores }) =>
  setDoc(responseRef(code, evaluator.uid), {
    evaluatorUid: evaluator.uid,
    evaluatorName: evaluator.displayName ?? "",
    evaluatorPhoto: evaluator.photoURL ?? "",
    answers: answers.map(({ id, respuesta }) => ({ id, respuesta })),
    topGifts,
    scores,
    createdAt: serverTimestamp(),
  });

/** Solo el dueño de la invitación puede listar (lo garantizan las reglas). */
export async function getResponses(code) {
  const snap = await getDocs(collection(db, "invites", code, "responses"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
