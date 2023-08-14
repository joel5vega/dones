import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFrown,
  faGrimace,
  faMeh,
  faSmile,
  faGrin,
  faFaceSmileBeam,
} from "@fortawesome/free-solid-svg-icons";
import "./Slider.css";
const Slider = ({ id, value, onChange, pregunta }) => {
  const options = [
    { icon: faGrimace, label: "No", value: 0 },
    { icon: faSmile, label: "Maybe", value: 1 },
    { icon: faGrin, label: "Surely", value: 2 },
    { icon: faFaceSmileBeam, label: "Definitely", value: 3 },
    { icon: faFaceSmileBeam, label: "Definitely", value: 4 },
  ];

  return (
    <div className="slider-container">
      <label htmlFor={id}>{pregunta}</label>
      {/* <br /> */}
      <div className="slider-value">
        <FontAwesomeIcon icon={options[value].icon} />
      </div>
      <div className="slider-input-container">
        <label>Poco</label>
        <input
          // className="slider-input-container"
          id={id}
          type="range"
          min="0"
          max="3"
          value={value}
          onChange={(event) => onChange(id, Number(event.target.value))}
        />
        <label>Mucho</label>
      </div>
    </div>
  );
};

export default Slider;
