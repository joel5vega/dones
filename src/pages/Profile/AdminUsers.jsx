import { useMemo, useState } from "react";
import iconos from "../../data/iconos";
import { summarizeUser } from "../../utils/userSummary";
import ResultCard from "./ResultCard";
import EmailDialog from "./EmailDialog";
import "../../components/peer.css"; // chips .top-gift
import "./admin.css";

const BADGE = { current: ["ok", "Actualizado"], legacy: ["warn", "Por migrar"], none: ["muted", "Sin test"] };
const SORTS = {
  name: (a, b) => (a.u.name ?? "").localeCompare(b.u.name ?? ""),
  date: (a, b) => (b.s.date ?? "").localeCompare(a.s.date ?? ""), // más recientes primero
};

export default function AdminUsers({ users }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("date");
  const [selected, setSelected] = useState(() => new Set());
  const [open, setOpen] = useState(null);       // fila expandida
  const [emailOpen, setEmailOpen] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users
      .map((u) => ({ u, s: summarizeUser(u) }))
      .filter(({ u }) => !q || `${u.name} ${u.email}`.toLowerCase().includes(q))
      .sort(SORTS[sort]);
  }, [users, query, sort]);

  const eligible = rows.filter((r) => r.s.canEmail);
  const legacyCount = users.filter((u) => summarizeUser(u).status === "legacy").length;
  const allSelected = eligible.length > 0 && eligible.every((r) => selected.has(r.u.uid));

  const toggle = (uid) =>
    setSelected((prev) => { const n = new Set(prev); n.has(uid) ? n.delete(uid) : n.add(uid); return n; });
  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(eligible.map((r) => r.u.uid)));

  const recipients = users.filter((u) => selected.has(u.uid) && summarizeUser(u).canEmail);

  return (
    <section className="admin-users">
      <div className="admin-toolbar">
        <input className="admin-search" placeholder="Buscar por nombre o correo" value={query}
          onChange={(e) => setQuery(e.target.value)} />
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Ordenar">
          <option value="date">Más recientes</option>
          <option value="name">Nombre (A-Z)</option>
        </select>
        <label className="admin-check">
          <input type="checkbox" checked={allSelected} onChange={toggleAll} disabled={!eligible.length} />
          Seleccionar todos ({eligible.length})
        </label>
        <button className="btn btn-primary" disabled={!recipients.length} onClick={() => setEmailOpen(true)}>
          Enviar correo ({recipients.length})
        </button>
      </div>

      {legacyCount > 0 && (
        <p className="admin-note">
          ⚠️ {legacyCount} usuario(s) tienen resultados con el cálculo anterior. Ejecuta <code>npm run migrate</code> antes de enviarles correo.
        </p>
      )}

      <ul className="admin-list">
        {rows.map(({ u, s }) => {
          const [tone, label] = BADGE[s.status];
          return (
            <li key={u.uid} className="admin-row">
              <div className="admin-row-main">
                <input type="checkbox" checked={selected.has(u.uid)} disabled={!s.canEmail}
                  onChange={() => toggle(u.uid)} aria-label={`Seleccionar a ${u.name}`} />
                <button className="admin-user" onClick={() => setOpen(open === u.uid ? null : u.uid)} aria-expanded={open === u.uid}>
                  {u.photo ? <img src={u.photo} alt="" referrerPolicy="no-referrer" /> : <span className="admin-avatar" />}
                  <span><strong>{u.name || "Sin nombre"}</strong><small>{u.email}</small></span>
                </button>
                <div className="admin-gifts">
                  {s.top.map((g) => (
                    <span key={g.id} className="top-gift">
                      <img src={iconos[g.id]} alt="" />
                      {g.name}{s.status === "current" && <b> {g.score}%</b>}
                    </span>
                  ))}
                </div>
                <span className="admin-meta">
                  <em className={`badge ${tone}`}>{label}</em>
                  {s.date && <small>{s.date}</small>}
                </span>
              </div>
              {open === u.uid && s.status !== "none" && <ResultCard profile={u} isAdmin />}
            </li>
          );
        })}
        {rows.length === 0 && <li className="admin-empty">Sin resultados para esa búsqueda.</li>}
      </ul>

      <EmailDialog open={emailOpen} onClose={() => setEmailOpen(false)} recipients={recipients} />
    </section>
  );
}
