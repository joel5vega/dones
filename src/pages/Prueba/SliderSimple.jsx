import React from 'react';
import './Slider.css';

const Slider = ({ id, value, onChange ,pregunta}) => {
  return (
    <div className="slider-container">
      <label className="slider-label" htmlFor={id}>
        {pregunta}
      </label>
      <div className="slider-input-container">
        <span>No</span>
        <input
          id={id}
          type="range"
          min="0"
          max="4"
          value={value}
          onChange={event => onChange(id, event.target.value)}
        />
        <span>Si</span>
      </div>
    </div>
  );
};

export default Slider;
