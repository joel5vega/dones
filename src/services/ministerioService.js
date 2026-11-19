import {
  addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc, where,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../config/firebase";

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
  const payload = { ...ministry, ownerUid: uid, ownerName: profile?.name || profile?.displayName || "", status: "pending", createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  const created = await addDoc(ministriesRef, payload);
  return { id: created.id, ...payload };
}
export async function getPendingMinistries() {
  const snapshot = await getDocs(query(ministriesRef, where("status", "==", "pending")));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}
export async function getAdminMinistries() {
  const snapshot = await getDocs(ministriesRef);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}
export async function createMinistry(ministry) {
  const payload = { ...ministry, status: "active", ownerUid: null, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  const created = await addDoc(ministriesRef, payload);
  return { id: created.id, ...payload };
}
export async function updateMinistry(ministryId, changes) {
  await updateDoc(doc(db, "ministries", ministryId), { ...changes, updatedAt: serverTimestamp() });
}
export async function setMinistryStatus(ministryId, status) {
  if (!["active", "inactive", "rejected"].includes(status)) throw new Error("Estado inválido");
  await updateDoc(doc(db, "ministries", ministryId), { status, updatedAt: serverTimestamp() });
}
export async function reviewMinistry(ministryId, status) {
  if (!["active", "rejected"].includes(status)) throw new Error("Estado de revisión inválido");
  await updateDoc(doc(db, "ministries", ministryId), { status, updatedAt: serverTimestamp() });
}
export async function importStarterMinistry(starter) {
  const { id: starterId, ...data } = starter;
  const created = await addDoc(ministriesRef, { ...data, starterId, status: "active", ownerUid: null, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return { id: created.id, ...data, starterId, status: "active" };
}
export async function uploadMinistryLogo(ministryId, file) {
  if (!file || !file.type.startsWith("image/")) throw new Error("Selecciona un archivo de imagen.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Formato permitido: JPG, PNG o WebP.");
  if (file.size > 3 * 1024 * 1024) throw new Error("La imagen debe pesar 3 MB o menos.");
  const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
  const logoRef = ref(storage, `ministries/${ministryId}/logo.${extension}`);
  await uploadBytes(logoRef, file, { contentType: file.type });
  return getDownloadURL(logoRef);
}
export async function removeMinistryLogo(ministryId) {
  const candidates = ["jpg", "png", "webp"];
  await Promise.all(candidates.map(async (extension) => {
    try { await deleteObject(ref(storage, `ministries/${ministryId}/logo.${extension}`)); } catch (error) {
      if (error.code !== "storage/object-not-found") throw error;
    }
  }));
}
