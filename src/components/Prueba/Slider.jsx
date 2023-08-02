import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const marks = [
  {
    value: 0,
    label: "No"
  },

  { value: 1 },
  {
    value: 3
  },
  {
    value: 4,
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
        step={1}
        marks={marks}
        value={props.valor}
        // valueLabelDisplay="on"
        onChange={props.onChange}
        max={4}
        color="primary"
      />
    </Box>
  );
}
