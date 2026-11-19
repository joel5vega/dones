import {
  addDoc, collection, getDocs, query, where, serverTimestamp, doc, updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

const ministriesRef = collection(db, "ministries");

export async function getPublishedMinistries() {
  const snapshot = await getDocs(query(ministriesRef, where("status", "==", "active")));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function getMyMinistryProposals(uid) {
  const snapshot = await getDocs(query(ministriesRef, where("ownerUid", "==", uid)));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function proposeMinistry(uid, profile, ministry) {
  const payload = {
    ...ministry,
    ownerUid: uid,
    ownerName: profile?.name || profile?.displayName || "",
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(ministriesRef, payload);
  return { id: ref.id, ...payload };
}

export async function getPendingMinistries() {
  const snapshot = await getDocs(query(ministriesRef, where("status", "==", "pending")));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function reviewMinistry(ministryId, status) {
  if (!["active", "rejected"].includes(status)) throw new Error("Estado de revisión inválido");
  await updateDoc(doc(db, "ministries", ministryId), { status, updatedAt: serverTimestamp() });
}
