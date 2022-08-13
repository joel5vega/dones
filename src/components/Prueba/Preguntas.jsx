import React, { useState } from "react";
import PreguntasData from "../../data/PreguntasData";
import CategoriaData from "../../data/CategoriasData";
import Single from "./Single";
import Results from "./Results";
import NavBar from "../NavBar";

function Preguntas() {
  const [answers, setAnswers] = useState(PreguntasData);
  const [dones, setDones] = useState(CategoriaData);
  const [result, setResult] = useState(false);
  const [progreso, setProgreso] = useState(0);

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
      <NavBar  />
      {!result ? (
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
      ) : (
        <Results
          show={result}
          dones={dones.sort(function (a, b) {
            return b.score - a.score;
          })}
        />
      )}
      <div className="boton" onClick={buscarDon}>
        Buscar mi Don
      </div>
    </div>
  );
}

export default Preguntas;
