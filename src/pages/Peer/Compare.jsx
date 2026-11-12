import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import InvitePanel from "../../components/InvitePanel";
import CompareRadar from "../../components/CompareRadar";
import categorias from "../../data/categorias";
import { useAuth } from "../../contexts/AuthContext";
import { usePeerComparison } from "../../hooks/usePeerComparison";
import { topGiftIds } from "../../utils/peer";
import "../../components/peer.css";

const OWN_COLOR = "#fbaf00";
const PEER_COLORS = ["#4dd0e1", "#ff7b9c", "#8bc34a", "#b388ff", "#ff9e57", "#80cbc4"];
const gift = (id) => categorias.find((c) => c.id === id);

// ✨ COMPONENTE REDISEÑADO SIN ÍCONOS Y A PRUEBA DE FALLOS
function TopGiftRow({ label, ids, scores, isMe }) {
  // Busca el puntaje sin importar si viene por ID o por Nombre
  const getScore = (id) => {
    const name = gift(id)?.name;
    return scores?.[id] ?? scores?.[name] ?? 0;
  };

  const items = isMe 
    ? Object.entries(scores || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([id, score]) => ({ id, score }))
    : (ids || []).map(id => ({ id, score: getScore(id) }));

  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ 
        fontSize: "14px", 
        fontWeight: "bold", 
        color: isMe ? "#fbaf00" : "#fff",
        marginBottom: "10px",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}>
        {isMe ? "Tú" : label}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {items.map(({ id, score }) => {
          const cat = gift(id);
          return (
            <div key={id} style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              background: "rgba(255,255,255,0.03)",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.05)"
            }}>
              {/* Nombre del don */}
              <span style={{ fontSize: "13px", color: "#e2e8f0", fontWeight: "500" }}>
                {cat?.name || id}
              </span>
              
              {/* Porcentaje y barra */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "60px", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: `${score}%`, height: "100%", background: isMe ? "#fbaf00" : "#4dd0e1", borderRadius: "4px" }} />
                </div>
                <span style={{ fontSize: "12px", fontWeight: "bold", color: isMe ? "#fbaf00" : "#4dd0e1", minWidth: "35px", textAlign: "right" }}>
                  {Math.round(score)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Compare() {
  const { user, profile, loading } = useAuth();
  const { invite, responses, busy, createOrRefresh } = usePeerComparison();
  const [selected, setSelected] = useState(null); 

  const own = profile?.resultado;
  
  const ownScores = useMemo(
    () => (own ? Object.fromEntries(Object.entries(own).filter(([k]) => k !== "id")) : null),
    [own]
  );
  
  const ownTop = useMemo(() => (ownScores ? topGiftIds(ownScores, categorias) : []), [ownScores]);

  const active = selected ?? (responses[0] ? [responses[0].id] : []);
  const shown = responses.filter((r) => active.includes(r.id));

  const radarAxes = useMemo(() => {
    if (!ownScores) return [];
    
    const myTop5 = Object.entries(ownScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    const peersTop5 = shown.flatMap((r) => 
      Object.entries(r.scores || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name]) => name)
    );

    const allRelevantNames = [...new Set([...myTop5, ...peersTop5])];
    return allRelevantNames.map((name) => ({ label: name, id: name }));
  }, [ownScores, shown]);

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/" replace />;

  const toggle = (id) => setSelected(active.includes(id) ? active.filter((x) => x !== id) : [...active, id]);
  const colorOf = (id) => PEER_COLORS[responses.findIndex((r) => r.id === id) % PEER_COLORS.length];

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
        <div className="peer-card">
          <p className="peer-muted">Aún nadie ha respondido. Cuando lo hagan, aparecerán aquí.</p>
        </div>
      )}

      {own && responses.length > 0 && (
        <div className="peer-card">
          <h2>Cómo te ven los demás</h2>
          
          <div className="peer-chips">
            {responses.map((r) => (
              <button 
                key={r.id} 
                className={`peer-chip ${active.includes(r.id) ? "on" : ""}`}
                style={{ "--chip-color": colorOf(r.id) }} 
                onClick={() => toggle(r.id)} 
                aria-pressed={active.includes(r.id)}
              >
                {r.evaluatorPhoto ? (
                  <img src={r.evaluatorPhoto} alt="" referrerPolicy="no-referrer" />
                ) : (
                  <span className="chip-fallback" />
                )}
                {r.evaluatorName?.split(" ")[0] || "Anónimo"}
              </button>
            ))}
          </div>

          <CompareRadar series={series} axes={radarAxes} />

          <div className="legend">
            <span><i style={{ background: OWN_COLOR }} />Tú</span>
            {shown.map((r) => (
              <span key={r.id}>
                <i style={{ background: colorOf(r.id) }} />
                {r.evaluatorName?.split(" ")[0]}
              </span>
            ))}
          </div>

          <h2 style={{ marginTop: "24px", marginBottom: "16px" }}>Comparación de dones</h2>
          
          <div style={{ 
            background: "rgba(0,0,0,0.2)", 
            padding: "20px", 
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.05)"
          }}>
            <TopGiftRow label="Tú" scores={ownScores} isMe={true} />
            
            <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "16px 0" }} />
            
            {responses.map((r) => (
              <TopGiftRow 
                key={r.id} 
                label={r.evaluatorName?.split(" ")[0] || "Anónimo"} 
                ids={r.topGifts ?? []} 
                scores={r.scores} 
                isMe={false} 
              />
            ))}
          </div>
          
          <p className="peer-muted" style={{ marginTop: "16px", fontSize: "12px", opacity: 0.7 }}>
            La evaluación externa usa menos preguntas, así que es una referencia, no una medida exacta.
          </p>
        </div>
      )}
    </main>
  );
}