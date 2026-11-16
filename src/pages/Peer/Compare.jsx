import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import InvitePanel from "../../components/InvitePanel";
import CompareRadar from "../../components/CompareRadar";
import categorias from "../../data/categorias";
import { useAuth } from "../../contexts/AuthContext";
import { usePeerComparison } from "../../hooks/usePeerComparison";
import "../../components/peer.css";

const OWN_COLOR = "#fbaf00";
const PEER_COLORS = ["#4dd0e1", "#ff7b9c", "#8bc34a", "#b388ff", "#ff9e57", "#80cbc4"];
const gift = (id) => categorias.find((c) => c.id === id);

// Función auxiliar para sacar el Top 4 de cualquier diccionario de puntajes
const getTop4 = (scores) => {
  return Object.entries(scores || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name]) => name);
};

// ✨ NUEVO COMPONENTE DE COMPARACIÓN CON DIFERENCIA
function ComparisonRow({ id, name, ownScore, peerScore, isSelected, evaluatorName }) {
  // Calculamos la diferencia
  const diff = Math.abs(ownScore - peerScore);
  
  // Lógica para mostrar quién tiene el puntaje más alto en este don
  let diffLabel = "Igual";
  let diffColor = "#8fa6c0"; // Color gris para "Igual"
  
  if (diff > 0) {
    if (ownScore > peerScore) {
      diffLabel = `+${Math.round(diff)}% Tú`;
      diffColor = OWN_COLOR;
    } else {
      diffLabel = `+${Math.round(diff)}% ${evaluatorName}`;
      diffColor = "#4dd0e1"; // Color del evaluador
    }
  }

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column",
      gap: "6px",
      padding: "12px",
      background: "rgba(255,255,255,0.02)",
      borderRadius: "10px",
      border: isSelected ? "1px solid rgba(251,175,0,0.3)" : "1px solid rgba(255,255,255,0.05)"
    }}>
      {/* Encabezado de la fila: Nombre del don y diferencia */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "13px", fontWeight: "bold", color: "#e2e8f0" }}>
          {gift(id)?.name || name}
        </span>
        <span style={{ 
          fontSize: "11px", 
          fontWeight: "bold", 
          color: diffColor,
          background: `${diffColor}15`, // Fondo sutil del mismo color
          padding: "2px 8px",
          borderRadius: "12px"
        }}>
          {diffLabel}
        </span>
      </div>

      {/* Barras de comparación */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
        {/* Tu barra */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "20px", fontSize: "10px", color: "#8fa6c0" }}>Tú</span>
          <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "4px" }}>
            <div style={{ width: `${ownScore}%`, height: "100%", background: OWN_COLOR, borderRadius: "4px", transition: "width 0.3s" }} />
          </div>
          <span style={{ width: "35px", fontSize: "11px", color: OWN_COLOR, textAlign: "right", fontWeight: "bold" }}>
            {Math.round(ownScore)}%
          </span>
        </div>
        
        {/* Barra del evaluador */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "20px", fontSize: "10px", color: "#8fa6c0" }}>{evaluatorName?.[0] || "?"}</span>
          <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "4px" }}>
            <div style={{ width: `${peerScore}%`, height: "100%", background: "#4dd0e1", borderRadius: "4px", transition: "width 0.3s" }} />
          </div>
          <span style={{ width: "35px", fontSize: "11px", color: "#4dd0e1", textAlign: "right", fontWeight: "bold" }}>
            {Math.round(peerScore)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Compare() {
  const { user, profile, loading } = useAuth();
  const { invite, responses, busy, createOrRefresh } = usePeerComparison();
  const [selected, setSelected] = useState(null); 
  const [showAll, setShowAll] = useState(false); // Para el botón de ver todos

  const own = profile?.resultado;
  
  // 1. Tus puntajes
  const ownScores = useMemo(
    () => (own ? Object.fromEntries(Object.entries(own).filter(([k]) => k !== "id")) : null),
    [own]
  );

  // 2. Filtro de evaluador activo
  const active = selected ?? (responses[0] ? [responses[0].id] : []);
  const shown = responses.filter((r) => active.includes(r.id));
  const activePeer = shown[0]; // Tomamos el primero para la tabla de abajo

  // 3. LÓGICA DEL RADAR: Solo mostrar Top 4 de ambos
  const radarAxes = useMemo(() => {
    if (!ownScores) return [];
    
    const myTop4 = getTop4(ownScores);
    const peersTop4 = activePeer ? getTop4(activePeer.scores) : [];
    
    const allRelevantNames = [...new Set([...myTop4, ...peersTop4])];
    
    return allRelevantNames.map((name) => ({ label: name, id: name }));
  }, [ownScores, activePeer]);

  // 4. LÓGICA DE LA TABLA: Calcular diferencias
  const comparisonData = useMemo(() => {
    if (!ownScores || !activePeer) return [];
    
    // Unir todos los dones evaluados
    const allKeys = [...new Set([...Object.keys(ownScores), ...Object.keys(activePeer.scores || {})])];
    
    return allKeys.map((name) => {
      const ownScore = ownScores[name] || 0;
      // Intentar buscar por nombre o por ID
      const peerScore = activePeer.scores?.[name] || activePeer.scores?.[gift(name)?.name] || 0;
      
      return {
        id: name,
        name: gift(name)?.name || name,
        ownScore,
        peerScore,
        diff: Math.abs(ownScore - peerScore)
      };
    })
    .sort((a, b) => b.diff - a.diff); // Ordenar por mayor diferencia
  }, [ownScores, activePeer]);

  // Mostrar top 5 diferencias o todos
  const visibleComparisons = showAll ? comparisonData : comparisonData.slice(0, 5);

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
          <Link to="/test" className="btn-outline">
  {profile?.resultado ? "Repetir el Test" : "Hacer el Test"}
</Link>
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
                onClick={() => setSelected([r.id])} // Forzamos selección única para la tabla
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

          {/* El radar dibujado con el Top 4 */}
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

          <h2 style={{ marginTop: "24px", marginBottom: "4px" }}>Diferencia por don</h2>
          <p style={{ fontSize: "12px", color: "#8fa6c0", marginBottom: "16px" }}>
            Ordenados por la mayor brecha entre tu autoevaluación y la de {activePeer?.evaluatorName?.split(" ")[0] || "tu evaluador"}.
          </p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {visibleComparisons.map((c) => (
              <ComparisonRow 
                key={c.id} 
                id={c.id} 
                name={c.name} 
                ownScore={c.ownScore} 
                peerScore={c.peerScore} 
                evaluatorName={activePeer?.evaluatorName?.split(" ")[0] || "Evaluador"}
                isSelected={c.diff > 30} // Resaltar si la diferencia es mayor a 30%
              />
            ))}
          </div>

          <button 
            onClick={() => setShowAll(!showAll)}
            style={{ 
              marginTop: "16px", padding: "10px", background: "transparent", 
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", 
              color: "#8fa6c0", fontSize: "12px", cursor: "pointer" 
            }}
          >
            {showAll ? "Mostrar solo las mayores diferencias" : "Mostrar todos los dones"}
          </button>
          
          <p className="peer-muted" style={{ marginTop: "16px", fontSize: "12px", opacity: 0.7 }}>
            La evaluación externa usa menos preguntas, así que es una referencia, no una medida exacta.
          </p>
        </div>
      )}
    </main>
  );
}