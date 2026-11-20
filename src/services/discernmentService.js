import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

export async function saveDiscernment(uid, discernment) {
  const clean = {
    interests: discernment.interests || [],
    skills: discernment.skills || [],
    causes: discernment.causes || [],
    context: discernment.context || "both",
    availability: discernment.availability || [],
    updatedAt: serverTimestamp(),
  };
  await updateDoc(doc(db, "users", uid), { discernment: clean, updatedAt: serverTimestamp() });
  return clean;
}
