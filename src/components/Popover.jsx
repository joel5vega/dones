import { useState } from "react";
import MuiPopover from "@mui/material/Popover";

// Separa el texto del versículo de su cita final, p. ej. "… con gusto. Romanos 12:6-8 (NTV)"
const CITA = /\s*((?:Primera Carta a los\s+|\d\s)?[A-Za-zÁ-ú]+\s\d+:[\d\-,\s]*\d(?:\s*\([A-Z]+\))?)\s*$/;
export function splitCita(content) {
  const m = content.match(CITA);
  return m ? { texto: content.slice(0, m.index).trim(), cita: m[1] } : { texto: content, cita: "" };
}

// Tarjeta oscura que hereda la paleta de la app (el Paper de MUI es blanco por defecto)
const paperSx = {
  mt: 1,
  p: { xs: 2, sm: 3 },
  width: "min(92vw, 520px)",
  maxHeight: "60vh",
  // --fondo-suave es translúcido (6 % blanco): se apila sobre el azul sólido para que no se transparente
  backgroundColor: "var(--fondo, #052f5f)",
  backgroundImage: "linear-gradient(var(--fondo-hover, rgba(255,255,255,0.12)), var(--fondo-hover, rgba(255,255,255,0.12)))",
  color: "var(--primario, #fff)",
  border: "1px solid var(--borde, rgba(255,255,255,0.15))",
  borderRadius: "var(--radius-lg, 16px)",
  boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
};

export default function Popover({ title, content }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { texto, cita } = splitCita(content);

  return (
    <div>
      <button onClick={(e) => setAnchorEl(e.currentTarget)} className="boton-info" aria-haspopup="dialog">
        {title}
      </button>
      <MuiPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { sx: paperSx } }}
      >
        <h4 style={{ margin: "0 0 10px", color: "var(--resaltar, #fbaf00)", fontSize: 16 }}>{title}</h4>
        {texto.split("\n").filter(Boolean).map((p, i) => (
          <p key={i} style={{ margin: "0 0 10px", fontSize: 15, lineHeight: 1.7 }}>{p.trim()}</p>
        ))}
        {cita && <p style={{ margin: 0, fontSize: 13, opacity: 0.65, fontStyle: "italic" }}>{cita}</p>}
      </MuiPopover>
    </div>
  );
}
