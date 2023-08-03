import React, { useState ,useEffect} from "react";
import PreguntasData from "../../data/PreguntasData";
import CategoriaData from "../../data/CategoriasData";
import Single from "./Single";
import Results from "./Results";
import NavBar from "../../components/NavBar";
import SaveProgressButton from "../../components/auth/SaveProgressButton";
import {getDatabase,ref,set,onValue} from "firebase/database";
import {getAuth} from "firebase/auth";
import "../../services/Firebase";

const user = getAuth().currentUser;
const userId = user?user.uid:null;
function Preguntas() {
  const [answers, setAnswers] = useState(PreguntasData);
  const [dones, setDones] = useState(CategoriaData);
  const [result, setResult] = useState(false);
  const [progreso, setProgreso] = useState(0);
  //save to firebase
  const handleSaveProgress = () => {
    console.log("saving...")
    const db = getDatabase(app);
    const connectedRef = ref(db, '.info/connected');
    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        console.log("connected");
      } else {
        console.log("not connected");
      }
    });

    set(ref(db, 'users/' + userId), {
      answers: answers,
      dones: dones,
      result: result,
      progreso: progreso
    }).then((result) => {console.log("saved")}).catch((error) => console.log(error) ) ;
  };

  useEffect(() => {
    const interval = setInterval(() => {handleSaveProgress()}, 12000);
    return () => clearInterval(interval);
  }, []);
  
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
}
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
      <NavBar title="Test Dones" result={result} action={action}/>
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
          </div>{" "}
          {!userId?<SaveProgressButton onClick={handleSaveProgress} />:"inicie sesion para guardar progreso"}
          
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
