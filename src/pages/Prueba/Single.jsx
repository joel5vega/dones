import React from "react";
import Slide from "./Slider";
function Single(props) {
  return (
    <div className="pregunta">
      <div className="pregunta-text">{props.pregunta}</div>
      <div className="respuesta">
        <Slide
          value={props.valor}
          onChange={(value) => props.onChange(props.id, value)}
        />
      </div>
    </div>
  );
}

export default Single;
