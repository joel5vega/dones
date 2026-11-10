// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore,doc,getDoc} from "firebase/firestore";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "$env.apiKey",
  authDomain: "$env.authDomain",
  projectId: "$env.projectId",
  storageBucket: "$env.storageBucket",
  messagingSenderId: "$env.messagingSenderId",
  appId: "$env.appId",
  measurementId: "G-4L0KRVPD49"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);


