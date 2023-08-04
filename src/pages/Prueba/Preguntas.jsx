import React, { useState, useEffect, useContext } from "react";
import PreguntasData from "../../data/PreguntasData";
import CategoriaData from "../../data/CategoriasData";
import Single from "./Single";
import Results from "./Results";
import NavBar from "../../components/NavBar";
import { getAuth,GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import db from "../../services/Firebase";
import { collection, doc, getDocs,setDoc, onSnapshot } from "firebase/firestore";

function Preguntas() {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const handleGoogleSignIn = () => {
    console.log("signing in")
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => {
        console.error(error.message)
      });
  }
  // const user = useContext(UserContext);
  //  const user = getAuth().currentUser;
  
  const userId = user ? user.uid : null;
  console.log("user",userId)
  // console.log(userId)
  const [answers, setAnswers] = useState(PreguntasData);
  const [dones, setDones] = useState(CategoriaData);
  const [result, setResult] = useState(false);
  const [progreso, setProgreso] = useState(0);
  //save to firebase
  /* cargar al inicio
  useEffect(() => {
    const fetchData = async () => {
     
      const connectedRef = doc(db, '.info/connected');
      onSnapshot(connectedRef, (doc) => {
          if (doc.data().connected === true) {
              console.log("connected");
          } else {
              console.log("not connected");
          }
      });
  
  
      const collectionRef = collection(db, 'users');
      const snapshot = await getDocs(collectionRef);
      setData(snapshot.docs.map(doc => doc.data()));
      console.log(snapshot);
      console.log("fethced")
    };

    fetchData();
  }, []);
*/
  const handleSaveProgress = async () => {
    console.log("saving for user", userId);
    // const db = getFirestore(app);
    
    const docRef = doc(db, 'users', userId);
    try {
        await setDoc(docRef, {
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
  };

  return (
    <div>
      <NavBar title="Test Dones" result={result} action={action} handleGoogleSignIn={handleGoogleSignIn} user={user} handleSaveProgress={handleSaveProgress}/>
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
