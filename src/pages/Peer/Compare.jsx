import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import InvitePanel from "../../components/InvitePanel";
import CompareRadar from "../../components/CompareRadar";
import categorias from "../../data/categorias";
import iconos from "../../data/iconos";
import { useAuth } from "../../contexts/AuthContext";
import { usePeerComparison } from "../../hooks/usePeerComparison";
import { topGiftIds } from "../../utils/peer";
import "../../components/peer.css";

const OWN_COLOR = "#fbaf00";
const PEER_COLORS = ["#4dd0e1", "#ff7b9c", "#8bc34a", "#b388ff", "#ff9e57", "#80cbc4"];
const gift = (id) => categorias.find((c) => c.id === id);

function TopGifts({ ids, compareWith }) {
  return (
    <>
      {ids.map((id) => (
        <span key={id} className={`top-gift ${compareWith?.includes(id) ? "match" : ""}`}>
          <img src={iconos[id]} alt="" />
          {gift(id)?.name}
        </span>
      ))}
    </>
  );
}

export default function Compare() {
  const { user, profile, loading } = useAuth();
  const { invite, responses, busy, createOrRefresh } = usePeerComparison();
  const [selected, setSelected] = useState(null); // null = primer evaluador por defecto

  const own = profile?.resultado;
  const ownScores = useMemo(() => (own ? Object.fromEntries(Object.entries(own).filter(([k]) => k !== "id")) : null), [own]);
  const ownTop = useMemo(() => (ownScores ? topGiftIds(ownScores, categorias) : []), [ownScores]);

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/" replace />;

  const active = selected ?? (responses[0] ? [responses[0].id] : []);
  const toggle = (id) => setSelected(active.includes(id) ? active.filter((x) => x !== id) : [...active, id]);
  const colorOf = (id) => PEER_COLORS[responses.findIndex((r) => r.id === id) % PEER_COLORS.length];

  const shown = responses.filter((r) => active.includes(r.id));
  const series = [
    ...(ownScores ? [{ key: "own", color: OWN_COLOR, scores: ownScores }] : []),
    ...shown.map((r) => ({ key: r.id, color: colorOf(r.id), scores: r.scores, dashed: true })),
  ];

  return (
    <main className="peer-page">
      <InvitePanel invite={invite} busy={busy} onCreate={createOrRefresh} canCreate={Boolean(own)} />

      {!own && (
        <div className="peer-card">
          <p className="peer-muted">Completa tu test para poder comparar.</p>
          <Link to="/test" className="btn-outline">Hacer el test</Link>
        </div>
      )}

      {own && invite && responses.length === 0 && (
        <div className="peer-card"><p className="peer-muted">Aún nadie ha respondido. Cuando lo hagan, aparecerán aquí.</p></div>
      )}

      {own && responses.length > 0 && (
        <div className="peer-card">
          <h2>Cómo te ven los demás</h2>
          <div className="peer-chips">
            {responses.map((r) => (
              <button key={r.id} className={`peer-chip ${active.includes(r.id) ? "on" : ""}`}
                style={{ "--chip-color": colorOf(r.id) }} onClick={() => toggle(r.id)} aria-pressed={active.includes(r.id)}>
                {r.evaluatorPhoto ? <img src={r.evaluatorPhoto} alt="" referrerPolicy="no-referrer" /> : <span className="chip-fallback" />}
                {r.evaluatorName?.split(" ")[0] || "Anónimo"}
              </button>
            ))}
          </div>

          <CompareRadar series={series} />
          <div className="legend">
            <span><i style={{ background: OWN_COLOR }} />Tú</span>
            {shown.map((r) => (
              <span key={r.id}><i style={{ background: colorOf(r.id) }} />{r.evaluatorName?.split(" ")[0]}</span>
            ))}
          </div>

          <h2>Tus 3 dones principales</h2>
          <div className="top-rows">
            <div className="top-row"><span className="top-row-name">Tú</span><TopGifts ids={ownTop} /></div>
            {responses.map((r) => (
              <div key={r.id} className="top-row">
                <span className="top-row-name">{r.evaluatorName?.split(" ")[0]}</span>
                <TopGifts ids={r.topGifts ?? []} compareWith={ownTop} />
              </div>
            ))}
          </div>
          <p className="peer-muted">En verde: coincide con uno de tus 3 dones. La evaluación externa usa menos preguntas, así que es una referencia, no una medida exacta.</p>
        </div>
      )}
    </main>
  );
}
