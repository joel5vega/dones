import { STAGE_LABEL } from "../../utils/network";
import { STAGE_COLOR } from "./NetworkGraph";

function Person({ node, onSelect }) {
  return (
    <li>
      <button type="button" className="seg-person" onClick={() => onSelect(node.id)}>
        <span className="seg-dot" style={{ background: STAGE_COLOR[node.stage] }} />
        <span className="seg-person-name">{node.name}</span>
        <span className={`seg-chip ${node.tested ? "ok" : "pend"}`}>{node.tested ? "✓ hizo su test" : "○ sin test"}</span>
      </button>
    </li>
  );
}

/** Detalle de la persona seleccionada: su estado y el de quienes la rodean. */
export default function NodePanel({ node, nodesById, edges, onSelect }) {
  if (!node) {
    return (
      <aside className="seg-card seg-panel">
        <h3>Selecciona una persona</h3>
        <p className="seg-muted">Toca un nodo del grafo para ver si completó su test y quiénes la evaluaron.</p>
      </aside>
    );
  }
  const gave = edges.filter((e) => e.source === node.id).map((e) => nodesById.get(e.target));
  const got = edges.filter((e) => e.target === node.id).map((e) => nodesById.get(e.source));
  return (
    <aside className="seg-card seg-panel">
      <h3>{node.name}</h3>
      <span className="seg-chip" style={{ background: STAGE_COLOR[node.stage], color: "#052f5f" }}>{STAGE_LABEL[node.stage]}</span>
      {node.stage === "en-progreso" && <p className="seg-muted">Avance: {Math.round(node.progress * 100)}%{node.idleDays != null && ` · inactivo ${node.idleDays} d`}</p>}
      {node.top && <p>Don principal: <strong>{node.top.name}</strong> ({node.top.score}%)</p>}

      <h4>Evaluado por ({got.length})</h4>
      {got.length ? <ul className="seg-list">{got.map((p) => <Person key={p.id} node={p} onSelect={onSelect} />)}</ul> : <p className="seg-muted">Nadie aún.</p>}
      <h4>Evaluó a ({gave.length})</h4>
      {gave.length ? <ul className="seg-list">{gave.map((p) => <Person key={p.id} node={p} onSelect={onSelect} />)}</ul> : <p className="seg-muted">A nadie aún.</p>}
    </aside>
  );
}
