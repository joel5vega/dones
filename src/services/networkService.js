// Lectura de datos para el panel de seguimiento (solo admin; lo garantizan las reglas).
import { collection, collectionGroup, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { getAllProfiles } from "./userService";
import { normalizeEvaluation, normalizeInvite, normalizeUser } from "../utils/evaluationAdapter";

export async function getNetworkData() {
  const [profiles, invSnap, respSnap] = await Promise.all([
    getAllProfiles(),
    getDocs(collection(db, "invites")),
    getDocs(collectionGroup(db, "responses")), // invites/{code}/responses/{evaluatorUid}
  ]);
  const invites = invSnap.docs.map((d) => normalizeInvite(d.id, d.data()));
  const ownerByCode = new Map(invites.map((i) => [i.code, i.ownerUid]));
  const evaluations = respSnap.docs.map((d) =>
    normalizeEvaluation(d.id, d.data(), ownerByCode.get(d.ref.parent.parent?.id))
  );
  return { users: profiles.map(normalizeUser), invites, evaluations };
}
