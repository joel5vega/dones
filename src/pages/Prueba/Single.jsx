import React from "react";
import Slide from "./Slider";
function Single(props) {
  
  return (
    <div className="pregunta">
      <div className="pregunta-text">{props.pregunta}</div>
      <div className="pregunta-text">{props.valor}</div>
      <div className="respuesta">
        <Slide
          value={props.valor}
          onChange={(event) => props.onChange(props.id, event.target.value)}
        />
      </div>
    </div>
  );
}

export default Single;
