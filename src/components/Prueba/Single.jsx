import React from "react";
import Slide from "./Slider";
function Single(props) {
  return (
    <div className="pregunta">
      <p>{props.pregunta}</p>
      <Slide
        value={props.valor}
        onChange={(value) => props.onChange(props.id, value)}
      />
    </div>
  );
}

export default Single;
