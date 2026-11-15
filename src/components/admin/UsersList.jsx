import { useMemo, useState } from "react";
import { filterRows, sortRows } from "../../utils/adminUsers";

const PAGE = 40;
const initials = (n) => n.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

/** Lista compacta: búsqueda, filtros por estado/don, orden y "ver más". */
export default function UsersList({ rows, onOpen }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("todos");
  const [gift, setGift] = useState("todos");
  const [sort, setSort] = useState("date:desc");
  const [shown, setShown] = useState(PAGE);

  const gifts = useMemo(() => [...new Set(rows.flatMap((r) => r.tops))].sort((a, b) => a.localeCompare(b)), [rows]);
  const list = useMemo(() => {
    const [key, dir] = sort.split(":");
    return sortRows(filterRows(rows, { query, status, gift }), key, dir);
  }, [rows, query, status, gift, sort]);
  const reset = (set) => (e) => { set(e.target.value); setShown(PAGE); };

  return (
    <section className="adm-card">
      <div className="adm-toolbar">
        <input type="search" placeholder="Buscar por nombre o correo…" value={query} onChange={reset(setQuery)} />
        <select value={status} onChange={reset(setStatus)} aria-label="Estado">
          <option value="todos">Todos</option><option value="completo">Con test</option><option value="sin-test">Sin test</option>
        </select>
        <select value={gift} onChange={reset(setGift)} aria-label="Don principal">
          <option value="todos">Cualquier don</option>{gifts.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={sort} onChange={reset(setSort)} aria-label="Ordenar">
          <option value="date:desc">Más recientes</option><option value="name:asc">Nombre A-Z</option>
          <option value="score:desc">Mayor puntaje</option><option value="gift:asc">Don A-Z</option>
        </select>
      </div>
      <p className="adm-muted">Mostrando {Math.min(shown, list.length)} de {list.length}</p>
      <ul className="adm-list">
        {list.slice(0, shown).map((r) => (
          <li key={r.uid}>
            <button type="button" className="adm-row" onClick={() => onOpen(r.uid)}>
              {r.photo ? <img className="adm-avatar" src={r.photo} alt="" referrerPolicy="no-referrer" loading="lazy" />
                : <span className="adm-avatar adm-initials">{initials(r.name)}</span>}
              <span className="adm-who"><strong>{r.name}</strong><small>{r.email}</small></span>
              {r.tested ? (
                <span className="adm-gift">
                  <b>{r.tops.length > 1 ? `${r.tops.length} empatados` : r.top.name}</b>
                  <em>{r.top.score}%</em>
                </span>
              ) : <span className="adm-chip adm-chip-off">Sin test</span>}
              <span className="adm-date">{r.date ?? ""}</span>
            </button>
          </li>
        ))}
      </ul>
      {list.length === 0 && <p className="adm-muted">Nadie coincide con esos filtros.</p>}
      {shown < list.length && <button type="button" className="btn adm-more" onClick={() => setShown((s) => s + PAGE)}>Ver más</button>}
    </section>
  );
}
