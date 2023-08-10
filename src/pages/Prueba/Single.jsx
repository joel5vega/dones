import React from "react";
import Slider from "./SliderSimple";
function Single(props) {
  
  return (
    <div className="pregunta">
      <div className="pregunta-text">{props.pregunta}</div>
      <div className="respuesta">
      <Slider id={props.id} value={props.valor} onChange={props.onChange} />
      </div>
    </div>
  );
}

export default Single;
