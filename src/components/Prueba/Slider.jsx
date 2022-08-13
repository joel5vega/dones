import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const marks = [
  {
    value: 0,
    label: "No"
  },
  {
    value: 1
    // label: '20°C',
  },
  { value: 2 },
  {
    value: 3
    // label: '37°C',
  },
  { value: 4 },
  {
    value: 5,
    label: "Si"
  }
];

function valuetext(value) {
  return `${value}`;
}

export default function DiscreteSliderLabel(props) {
  return (
    <Box sx={{ padding: "0.5rem",maxWidth: 360 }}>
      <Slider
        aria-label="Always visible"
        defaultValue={0}
        getAriaValueText={valuetext}
        step={1}
        marks={marks}
        value={props.value|0}
        valueLabelDisplay="on"
        onChange={props.onChange}
        max={5}
      />
    </Box>
  );
}
