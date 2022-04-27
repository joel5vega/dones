import React from "react";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";

function Single(props) {
  return (
    <div className="pregunta">
      <h3>{props.pregunta}</h3>
      <div className="input-range">
        <InputRange
          name={props.pregunta}
          // formatLabel={(value) => `${value}`}
          maxValue={5}
          step={1}
          draggableTrack={true}
          minValue={0}
          value={props.valor}
          onChange={(value) => props.onChange(props.id, value)}
          
          classNames={{
             activeTrack: "input-tange__track input-range__track--active",
             disabledInputRange: "input-range input-range--disabled",
            inputRange: "input-range",
           labelContainer: "input-range__label-container",
           label: "input-range__label",
           maxLabel: "input-range__label input-range__label--max",
           minLabel: "input-range__label input-range__label--min",
             slider: "input-range__slider",
             sliderContainer: "input-range__slider-container",
            track: "input-range__track input-range__track--background",
             valueLabel: "input-range__label--value"
          }}
          
        />
      </div>
    </div>
  );
}

export default Single;
