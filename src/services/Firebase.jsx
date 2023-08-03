// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore,doc,getDoc} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBey3bAdl7n6pd018UJZ1JOWyTRkvBRfbg",
  authDomain: "dones-902ec.firebaseapp.com",
  projectId: "dones-902ec",
  storageBucket: "dones-902ec.appspot.com",
  messagingSenderId: "541388500056",
  appId: "1:541388500056:web:71a618d2d94c617cb5ae2d",
  measurementId: "G-4L0KRVPD49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

async function verifyFirestoreConnection() {
  try {
    const docRef = doc(db, 'test', 'test');
    const docSnap = await getDoc(docRef);
    console.log('Firestore is connected');
  } catch (e) {
    console.error('Error connecting to Firestore:', e);
  }
}

verifyFirestoreConnection();

export default db;
