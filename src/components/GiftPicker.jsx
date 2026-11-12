import { useState } from "react";
import categorias from "../data/categorias";
import iconos from "../data/iconos";
import { PEER_TOP_GIFTS } from "../utils/peer";
import "./peer.css";
import "../pages/Test/questions.css"; // barra .progress-bar-top

/** Elegir exactamente N dones. El orden de selección marca la prioridad (1, 2, 3). */
export default function GiftPicker({ ownerName, questionsTotal, onSubmit, onBack, error }) {
  const [picked, setPicked] = useState([]);
  const [sending, setSending] = useState(false);

  const toggle = (id) =>
    setPicked((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : p.length < PEER_TOP_GIFTS ? [...p, id] : p
    );

  const send = async () => {
    setSending(true);
    await onSubmit(picked);
    setSending(false);
  };

  // Preguntas completas + avance dentro del último paso (dones elegidos / 3)
  const progress = Math.round(((questionsTotal + picked.length / PEER_TOP_GIFTS) / (questionsTotal + 1)) * 100);

  return (
    <div className="peer-card">
      <div className="progress-bar-top">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <h2>¿Qué {PEER_TOP_GIFTS} dones crees que tiene {ownerName}?</h2>
      <p className="peer-muted">Elige en orden de importancia ({picked.length}/{PEER_TOP_GIFTS}).</p>

      <div className="picker-grid">
        {categorias.map((c) => {
          const pos = picked.indexOf(c.id);
          return (
            <button
              key={c.id}
              className={`picker-item ${pos >= 0 ? "selected" : ""}`}
              onClick={() => toggle(c.id)}
              aria-pressed={pos >= 0}
            >
              {pos >= 0 && <span className="picker-badge">{pos + 1}</span>}
              <img src={iconos[c.id]} alt="" aria-hidden="true" />
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>

      {error && <p className="peer-error">{error}</p>}
      <div className="peer-actions">
        <button className="btn-outline" onClick={onBack}>Volver</button>
        <button className="btn-finish" disabled={picked.length !== PEER_TOP_GIFTS || sending} onClick={send}>
          Enviar evaluación
        </button>
      </div>
    </div>
  );
}
