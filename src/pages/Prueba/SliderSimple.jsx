import React from 'react';

const Slider = ({ id, value, onChange }) => {
  return (
    <input
      type="range"
      min="0"
      max="4"
      value={value}
      onChange={event => onChange(id, event.target.value)}
    />
  );
};

export default Slider;