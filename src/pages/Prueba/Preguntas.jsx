import React, { useState, useEffect, useContext } from "react";
import PreguntasData from "../../data/PreguntasData";
import CategoriaData from "../../data/CategoriasData";
import Single from "./Single";
import Results from "./Results";
import NavBar from "../../components/NavBar";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import db from "../../services/Firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  onSnapshot, 
} from "firebase/firestore";

function Preguntas() {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const fetchData = async (userId) => {
    console.log("fetching data for ", userId);
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    setData(docSnap.data());
    console.log("data is",docSnap.data());
    if (!docSnap.exists()) {
      console.log("no data");
    }
    else {
    // setData(docSnap.data());
    
    console.log("fetched");
    return docSnap.data();
    }
  };

  const handleGoogleSignIn = () => {
    console.log("signing in");
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        console.log("excelente ingresaste")
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
    //* cargar al inicio
      
   
    //*/
  };

  const userId = user ? user.uid : null;
  const [data,setData] = useState({});
  const [answers, setAnswers] = useState(userId?data.answers:PreguntasData);
  const [dones, setDones] = useState(CategoriaData);
  const [result, setResult] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  // useEffect(() => {

  // },loggedIn);
  //save to firebase

  const handleSaveProgress = async () => {
    console.log("saving for user", userId);
    // const db = getFirestore(app);

    const docRef = doc(db, "users", userId);
    try {
      await setDoc(docRef, {
        email: user.email,
        answers: answers,
        dones: dones,
        result: result,
        progreso: progreso
      });
      console.log("saved");
    } catch (error) {
      console.log(error);
    }
  };

  /* keep every 2 min
  useEffect(() => {
    const interval = setInterval(() => {handleSaveProgress()}, 12000);
    return () => clearInterval(interval);
  }, []);
  */
  /////

  const handleChange = (id, value) => {
    const valor = value.target.value;
    console.log(id, valor);
    var newAnswers = [];
    (newAnswers = answers.map((answer) => {
      if (answer.id === id) {
        return {
          ...answer,
          respuesta: valor
        };
      }

      return answer;
    })),
      setAnswers(newAnswers);
    // setProgreso(progreso + 1);
  };

  const action = () => {
    setResult(!result);
  };
  const buscarDon = () => {
    // alert("Buscar don");

    // buscamos entre todos los dones para cada categoria
    var actDones = dones;
    CategoriaData.map((categoria) => {
      //buscamos entre todas las respustas
      var puntaje = categoria.score;
      answers.map((answer) => {
        //  las q coincidad con nuestra categoria
        categoria.valores.map((valor) => {
          //si coincide
          if (answer.id === valor) {
            if (answer.respuesta) {
              puntaje = puntaje + answer.respuesta;
            }
          }
        });
      });
      console.log(categoria.name, puntaje);
      (actDones = actDones.map((don) => {
        if (don.id == categoria.id) {
          return {
            ...don,
            score: puntaje
          };
        }
        // console.log(don)
        return don;
      })),
        setDones(actDones);
      if (puntaje) {
        // console.log("actualiza", categoria.name, actDones);
      }
    });
    setResult(!result);
    handleSaveProgress();
  };

  return (
    <div>
      <NavBar
        title="Test Dones"
        result={result}
        action={action}
        handleGoogleSignIn={handleGoogleSignIn}
        user={user}
        handleSaveProgress={handleSaveProgress}
      />
      {!result ? (
        <>
          <div className="preguntas">
            {answers.map((item) => (
              <Single
                key={item.id}
                id={item.id}
                pregunta={item.pregunta}
                valor={item.respuesta || 0}
                onChange={handleChange}
              />
            ))}
          </div>

          <div className="boton" onClick={buscarDon}>
            Buscar mi Don
          </div>
        </>
      ) : (
        <Results
          show={result}
          dones={dones.sort(function (a, b) {
            return b.score - a.score;
          })}
        />
      )}
    </div>
  );
}

export default Preguntas;
