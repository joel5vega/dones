import React, { useState, lazy } from "react";
import PreguntasData from "../../data/PreguntasData";
import CategoriaData from "../../data/CategoriasData";
import Results from "./Results";
// import Preguntas from "./Preguntas";
const Preguntas = lazy(() => import("./Preguntas"));
function Test(props) {
  const [data, setData] = useState({});
  const [resultado, setResultado] = useState([]);
  const [answers, setAnswers] = useState(
    props.user ? props.answers : PreguntasData
  );
  const [dones, setDones] = useState(CategoriaData);
  const [result, setResult] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const userId = props.user ? props.user.uid : null;
  const subgroups = {
    Liderazgo: "Mayordomia",
    Administración: "Mayordomia",
    Pastoreo: "Mayordomia",

    Enseñanza: "Comunicar",
    Conocimiento: "Comunicar",
    Sabiduría: "Comunicar",
    Profecía: "Comunicar",

    Evangelismo: "Comunicar",
    Apostolado: "Comunicar",

    Fe: "Poder",

    Discernimiento: "Poder",

    Exhortación: "Ministrar",
    Servicio: "Ministrar",
    Misericordia: "Ministrar",
    Dar: "Ministrar",
    Hospitalidad: "Ministrar"
  };
  const handleChange = (id, value) => {
    console.log("handlechange on test", id, value);
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
    // console.log("newAnswers", newAnswers);
    props.setAnswers(newAnswers);
  };

  const buscarDon = () => {
    // buscamos entre todos los dones para cada categoria
    let resultado = { id: new Date().toISOString().slice(0, 10) };
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
      // console.log(categoria.name, puntaje);
      resultado[categoria.name] = puntaje;
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
      props.setDones(actDones);
      if (puntaje) {
        // console.log("actualiza", categoria.name, actDones);
      }
    });
    setResult(!result);
    // console.log("res", resultado);
    setResultado(resultado);
    props.setResultado(resultado);
    props.handleSaveProgress();
    props.handleSaveResultado(dones, resultado);
  };
  //resetear respuestas
  const handleResetClick = () => {
    props.answers.forEach((item) => {
      handleChange(item.id, 0);
    });
    // console.log(props.answers);
    props.handleSaveProgress();
  };
  return (
    <div>
      {!result ? (
        <>
          <Preguntas
            answers={props.answers}
            onChange={handleChange}
            handleSaveProgress={props.handleSaveProgress}
            buscarDon={buscarDon}
            handleResetClick={handleResetClick}
          />
        </>
      ) : (
        <Results
          resultado={resultado ? resultado : []}
          subgroups={subgroups}
          user={props.user}
          name={props.user.displayName}
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
