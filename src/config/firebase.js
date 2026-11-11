import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// La config web de Firebase es pública por diseño; la seguridad la dan
// las reglas de Firestore (firestore.rules) y las restricciones de la API key.
const firebaseConfig = {
  apiKey: "AIzaSyBey3bAdl7n6pd018UJZ1JOWyTRkvBRfbg",
  authDomain: "dones-902ec.firebaseapp.com",
  projectId: "dones-902ec",
  storageBucket: "dones-902ec.appspot.com",
  messagingSenderId: "541388500056",
  appId: "1:541388500056:web:71a618d2d94c617cb5ae2d",
  measurementId: "G-4L0KRVPD49",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

isSupported().then((ok) => ok && getAnalytics(app));
