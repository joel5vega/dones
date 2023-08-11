import React, { useState, Suspense, lazy } from "react";
import PreguntasData from "./data/PreguntasData";
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
        console.log(result.user);
        fetchData(result.user).then((data) => {
          console.log("data", data);
          if (data) {
            setAnswers(data.answers);
          } else {
            handleSignUp(result.user)
          }
          console.log(answers)
          // setDones(data.dones);
          // setResult(data.result);
          // setProgreso(data.progreso);
          setLoggedIn(true);
          console.log("excelente ingresaste");
        });
      })
      .catch((error) => {
        console.error(error.message);
      });
    console.log("user", userId);
  };
  // Obtener datos
  const fetchData = async (user) => {
    console.log(user)
    console.log("fetching data for ", user.uid);
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("cargando data");
      setData(docSnap.data());
      console.log("data is", docSnap.data());
    } else {
      console.error("no existe el documento");
    }

    if (!docSnap.exists()) {
      console.log("no data, registering");
      handleSignUp(user)
    } else {
      // setData(docSnap.data());

      console.log("fetched");
      return docSnap.data();
    }
  };
  //sign up
  const handleSignUp = async (user) => {
    console.log("registering for user", user.uid);

    const docRef = doc(db, "users", user.uid);
    try {
      await setDoc(docRef, {
        email: user.email,
        photo: user.photoURL,
        name: user.displayName,
        phoneNumber: user.phoneNumber,
        answers: PreguntasData,
      });
      setAnswers(data.answers);
      console.log("saved");
    } catch (error) {
      console.log(error);
    }

  };
  //guardar progreso
  const handleSaveProgress = async (data) => {
    console.log("saving for user", userId);

    const docRef = doc(db, "users", userId);
    try {
      await setDoc(docRef, {
        email: user.email,
        photo: user.photoURL,
        name: user.displayName,
        phoneNumber: user.phoneNumber,
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
        title="Test de Dones"
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
                  answers={answers? answers : PreguntasData}
                  setAnswers={setAnswers}
                />
              }
            />
          ) : (
            () => <div>no estas logueado</div>
          )}
          <Route path="/lista" element={<Dones />} />
        </Routes>
      </Suspense>

      <Footer />
    </Router>
  );
}

export default App;
