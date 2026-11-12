import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { normalizeCode } from "../utils/peer";
import "./peer.css";

/** Campo para escribir el código de una invitación y abrir /evaluar/:code. */
export default function CodeEntry({ title = "¿Te pidieron que evalúes a alguien?" }) {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const code = normalizeCode(value);

  const go = (e) => {
    e.preventDefault();
    if (code.length >= 6) navigate(`/evaluar/${code}`);
  };

  return (
    <form className="code-entry" onSubmit={go}>
      <h3>{title}</h3>
      <p className="peer-muted">Escribe el código que te compartieron.</p>
      <div className="code-entry-row">
        <input
          className="peer-input"
          value={value}
          maxLength={12}
          placeholder="ABCD2345"
          autoCapitalize="characters"
          autoComplete="off"
          aria-label="Código de invitación"
          onChange={(e) => setValue(e.target.value)}
        />
        <button className="btn-finish" type="submit" disabled={code.length < 6}>
          Evaluar
        </button>
      </div>
    </form>
  );
}
