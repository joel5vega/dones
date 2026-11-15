/** Lista accionable (p. ej. "para reactivar"); cada fila selecciona al nodo en el grafo. */
export default function InsightList({ title, hint, items, detail, onSelect }) {
  return (
    <section className="seg-card">
      <h3>{title} <span className="seg-count">{items.length}</span></h3>
      <p className="seg-muted">{hint}</p>
      {items.length === 0 ? <p className="seg-muted">Nada pendiente 🎉</p> : (
        <ul className="seg-list">
          {items.slice(0, 8).map((n) => (
            <li key={n.id}>
              <button type="button" className="seg-person" onClick={() => onSelect(n.id)}>
                <span className="seg-person-name">{n.name}</span>
                <span className="seg-muted">{detail(n)}</span>
              </button>
            </li>
          ))}
          {items.length > 8 && <li className="seg-muted">y {items.length - 8} más…</li>}
        </ul>
      )}
    </section>
  );
}
