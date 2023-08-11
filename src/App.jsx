import React, { useState, Suspense, lazy } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Loader from "./components/Loader/Loader";
import Home from "./pages/Home/Home";
import NavBar from "./components/NavBar";
import "./app.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import db from "./services/Firebase";
const Test = lazy(() => import("./pages/Prueba/Test"));
const Dones = lazy(() => import("./pages/Dones/Dones"));

function App() {
  // Variables de estado
  const [data, setData] = useState({});
  const [result, setResult] = useState(false);
  const [user, setUser] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [progreso, setProgreso] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const userId = user ? user.uid : null;
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  //funciones extras

  const action = () => {
    setResult(!result);
  };
  //Iniciar sesion
  const handleGoogleSignIn = () => {
    console.log("signing in");
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        console.log("excelente ingresaste");
        fetchData(result.user.uid).then((data) => {
          console.log("data", data);
          setAnswers(data.answers);
          // setDones(data.dones);
          // setResult(data.result);
          setProgreso(data.progreso);
          setLoggedIn(true);
        });
      })
      .catch((error) => {
        console.error(error.message);
      });
    console.log("user", userId);
  };
  // Obtener datos
  const fetchData = async (userId) => {
    console.log("fetching data for ", userId);
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("cargando data");
      setData(docSnap.data());
      console.log("data is", docSnap.data());
    } else {
      console.error("no existe el documento");
    }

    if (!docSnap.exists()) {
      console.log("no data");
    } else {
      // setData(docSnap.data());

      console.log("fetched");
      return docSnap.data();
    }
  };
  //guardar progreso
  const handleSaveProgress = async (data) => {
    console.log("saving for user", userId);

    const docRef = doc(db, "users", userId);
    try {
      await setDoc(docRef, {
        email: user.email,
        answers: answers,
        // dones: dones,
        result: result
        // progreso: progreso
      });
      console.log("saved");
    } catch (error) {
      console.log(error);
    }
  };
  ///

  return (
    <Router basename="/dones">
      <NavBar
        // title={user ? user.email : "Dones espirituales"}
        result={true}
        action={action}
        handleGoogleSignIn={handleGoogleSignIn}
        user={user}
        handleSaveProgress={handleSaveProgress}
      />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          {loggedIn ? (
          <Route
            path="/test"
            element={
              <Test 
              user={user} 
              handleSaveProgress={handleSaveProgress} 
              answers={answers}
              setAnswers={setAnswers}
              />
            }
          />):()=><div>no estas logueado</div>}
          <Route path="/lista" element={<Dones />} />
        </Routes>
      </Suspense>

      <Footer />
    </Router>
  );
}

export default App;
