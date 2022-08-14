import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const marks = [
  {
    value: 0,
    label: "No"
  },
  {
    value: 1.25
    // label: '20°C',
  },
  { value: 2.5 },
  {
    value: 3.75
    // label: '37°C',
  },
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
    <Box sx={{ height:55,maxWidth: 100,color:"var(--activo)" }}>
      <Slider
        aria-label="Always visible"
        defaultValue={0}
        getAriaValueText={valuetext}
        step={1.25}
        marks={marks}
        value={props.valor}
        // valueLabelDisplay="on"
        onChange={props.onChange}
        max={5}
        color="primary"
      />
    </Box>
  );
}
