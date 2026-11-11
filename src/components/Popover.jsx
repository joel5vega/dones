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
    </div>
  );
}
