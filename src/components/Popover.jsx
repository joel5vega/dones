<<<<<<< HEAD
import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
export default function BasicPopover(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <div>
      <button onClick={handleClick} className="boton-info">
        {props.title}
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 1 }}>{props.content}</Typography>
      </Popover>
=======
import { useState } from "react";
import MuiPopover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

export default function Popover({ title, content }) {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <div>
      <button onClick={(e) => setAnchorEl(e.currentTarget)} className="boton-info">
        {title}
      </button>
      <MuiPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Typography sx={{ p: 1 }}>{content}</Typography>
      </MuiPopover>
>>>>>>> refactor
    </div>
  );
}
