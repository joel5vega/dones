import { arrayUnion, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { GIFT_OPTIONS, INTEREST_OPTIONS, SKILL_OPTIONS, CAUSE_OPTIONS } from "../data/intereses";
export const DEFAULT_MINISTRY_TAXONOMY = { gifts:GIFT_OPTIONS, interests:INTEREST_OPTIONS, skills:SKILL_OPTIONS, causes:CAUSE_OPTIONS };
const taxonomyRef = doc(db, "settings", "ministryTaxonomy");
export async function getMinistryTaxonomy() {
 const snapshot=await getDoc(taxonomyRef); const stored=snapshot.exists()?snapshot.data():{};
 return Object.fromEntries(Object.entries(DEFAULT_MINISTRY_TAXONOMY).map(([key,defaults])=>[key,[...new Set([...defaults,...(Array.isArray(stored[key])?stored[key]:[])])].sort((a,b)=>a.localeCompare(b,"es"))]));
}
export async function addMinistryCategory(category,label) {
 if(!Object.hasOwn(DEFAULT_MINISTRY_TAXONOMY,category)) throw new Error("Categoría no válida.");
 const clean=String(label||"").trim().replace(/\s+/g," ");
 if(clean.length<2||clean.length>60) throw new Error("Usa entre 2 y 60 caracteres.");
 await setDoc(taxonomyRef,{[category]:arrayUnion(clean),updatedAt:serverTimestamp()},{merge:true});
 return getMinistryTaxonomy();
}