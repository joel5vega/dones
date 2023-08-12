import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown,faGrimace, faMeh, faSmile, faGrin } from '@fortawesome/free-solid-svg-icons';
import './Slider.css';
const Slider = ({ id, value, onChange, pregunta }) => {
  const options = [
    { icon: faMeh, label: 'No' ,value:0},
    { icon: faGrimace, label: 'Maybe',value:1 },
    { icon: faSmile, label: 'Surely',value:2 },
    { icon: faGrin, label: 'Definitely',value:3 }
  ];

  return (
    <div className='slider-container'>
      <label htmlFor={id}>{pregunta}</label>
      {/* <br /> */}
      <div className="slider-value">
        <FontAwesomeIcon icon={options[value].icon} />
      </div>
      <input className='slider-input-container'
        id={id}
        type="range"
        min="0"
        max="3"
        value={value}
        onChange={event => onChange(id, Number(event.target.value))}
      />
    </div>
  );
};

export default Slider;
