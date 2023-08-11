import React, { useState, Suspense, lazy } from "react";
import PreguntasData from "./data/PreguntasData";
import Footer from "./components/Footer";
import Loader from "./components/Loader/Loader";
import Home from "./pages/Home/Home";
import NavBar from "./components/NavBar";

import "./app.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
  const [resultado, setResultado] = useState([]);
  const [dones, setDones] = useState([]);
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
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        fetchData(result.user).then((data) => {
          if (data) {
            setAnswers(data.answers);
            setLoggedIn(true);
          } else {
            handleSignUp(result.user);
          }
          setLoggedIn(true);
        });
      })
      .catch((error) => {
        console.error(error.message);
      });
  };
  // Obtener datos
  const fetchData = async (user) => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setData(docSnap.data());
    } else {
      console.error("no existe el documento");
    }

    if (!docSnap.exists()) {
      handleSignUp(user);
    } else {
      return docSnap.data();
    }
  };
  //sign up
  const handleSignUp = async (user) => {

    const docRef = doc(db, "users", user.uid);
    try {
      await setDoc(docRef, {
        email: user.email,
        photo: user.photoURL,
        name: user.displayName,
        phoneNumber: user.phoneNumber,
        answers: PreguntasData
      });
      setAnswers(data.answers);
    } catch (error) {
      console.log(error);
    }
  };
  //guardar progreso
  const handleSaveProgress = async (data) => {
    const docRef = doc(db, "users", userId);
    try {
      await setDoc(docRef, {
        answers: answers,
        result: result,
        progreso: progreso
      });
      console.log("saved");
    } catch (error) {
      console.log(error);
    }
  };
  ///
  const handleSaveResultado = async (dones,resultado) => {
    // console.log(dones,resultado)
    setDones(dones)
    setResultado(resultado)
    const docRef = doc(db, "users", userId);
    try {
      await setDoc(docRef, {
        answers: answers,
        dones: dones,
        resultado: resultado,
      });
      console.log("saved");
    } catch (error) {
      console.log(error);
    }
  }
////
  return (
    <Router basename="/dones">
      <NavBar
        title="Test de Dones"
        result={true}
        action={action}
        handleGoogleSignIn={handleGoogleSignIn}
        user={user}
        handleSaveProgress={handleSaveProgress}
        handleSaveResultado={handleSaveResultado}
      />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home loggedIn={loggedIn} />} />
          {loggedIn && (
            <Route
              path="/test"
              element={
                <Test
                  user={user}
                  handleSaveProgress={handleSaveProgress}
                  answers={answers ? answers : PreguntasData}
                  setAnswers={setAnswers}
                  setDones={setDones}
                  setResultado={setResultado}
                  resultado={resultado?resultado:[]}
                  handleSaveResultado={handleSaveResultado}
                />
              }
            />
          )}
          <Route path="/lista" element={<Dones />} />
        </Routes>
      </Suspense>

      <Footer />
    </Router>
  );
}

export default App;
