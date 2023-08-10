import React, { useState, lazy, useEffect, useContext } from "react";
import PreguntasData from "../../data/PreguntasData";
import CategoriaData from "../../data/CategoriasData";
import Results from "./Results";
// import Preguntas from "./Preguntas";
const Preguntas = lazy(() => import("./Preguntas"));
function Test(props) {
  const [data, setData] = useState({});
  const [answers, setAnswers] = useState(
    props.user ? props.answers : PreguntasData
  );
  const [dones, setDones] = useState(CategoriaData);
  const [result, setResult] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const userId = props.user ? props.user.uid : null;

  const handleChange = (id, value) => {
    console.log(id, value);
    var newAnswers = [];
    (newAnswers = answers.map((answer) => {
      if (answer.id === id) {
        return {
          ...answer,
          respuesta: value
        };
      }
      return answer;
    })),
    setAnswers(newAnswers);
    props.setAnswers(newAnswers);
  };

  const buscarDon = () => {
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
    props.handleSaveProgress();
  };

  return (
    <div>
      {!result ? (
        <>
          <Preguntas answers={props.answers} onChange={handleChange} />

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

export default Test;
