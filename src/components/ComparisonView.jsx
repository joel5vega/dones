import { useState } from "react";
import categorias from "../data/categorias";

const gift = (id) => categorias.find((c) => c.id === id);
const getGiftName = (idOrName) => {
  const byId = gift(idOrName);
  if (byId) return byId.name;
  const byName = categorias.find((c) => c.name === idOrName);
  return byName ? byName.id : idOrName;
};

export default function ComparisonView({ ownScores, responses }) {
  const [selectedId, setSelectedId] = useState(responses[0]?.id);
  const [showAll, setShowAll] = useState(false);

  // Evaluador seleccionado
  const selected = responses.find((r) => r.id === selectedId) || responses[0];

  if (!selected) return null;

  // Normalizar puntajes a IDs (por si el evaluador los tiene por nombre)
  const peerScores = {};
  Object.entries(selected.scores || {}).forEach(([key, val]) => {
    peerScores[getGiftName(key)] = val;
  });

  // Lista completa de dones ordenada (usando los puntajes de ambos)
  const allGifts = Object.keys({ ...ownScores, ...peerScores }).map((id) => ({
    id,
    name: gift(id)?.name || id,
    own: ownScores[id] || 0,
    peer: peerScores[id] || 0,
    diff: Math.abs((ownScores[id] || 0) - (peerScores[id] || 0)),
  })).sort((a, b) => (b.own + b.peer) - (a.own + a.peer)); // Ordenados por relevancia

  // Hallazgos interpretativos
  const topOwn = allGifts.reduce((prev, curr) => (curr.own > prev.own ? curr : prev), allGifts[0]);
  const topPeer = allGifts.reduce((prev, curr) => (curr.peer > prev.peer ? curr : prev), allGifts[0]);
  
  // Coincidencia más fuerte (ambos altos)
  const bestMatch = allGifts.reduce((prev, curr) => {
    const score = Math.min(curr.own, curr.peer);
    const prevScore = Math.min(prev.own, prev.peer);
    return score > prevScore ? curr : prev;
  }, allGifts[0]);

  // Diferencia más amplia (Oportunidad de conversación)
  const biggestDiff = [...allGifts].sort((a, b) => b.diff - a.diff)[0];

  // Mostrar top 5 o todos
  const visibleGifts = showAll ? allGifts : allGifts.slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginTop: "16px" }}>
      
      {/* 1. SELECTOR DE EVALUADORES */}
      <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
        {responses.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedId(r.id)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
              padding: "12px", minWidth: "90px", borderRadius: "12px",
              background: selectedId === r.id ? "rgba(251,175,0,0.1)" : "rgba(255,255,255,0.03)",
              border: selectedId === r.id ? "2px solid #fbaf00" : "2px solid transparent",
              cursor: "pointer", transition: "all 0.2s"
            }}
          >
            {r.evaluatorPhoto ? (
              <img src={r.evaluatorPhoto} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#2a4d7a", display: "grid", placeItems: "center", fontWeight: "bold" }}>
                {r.evaluatorName?.[0] || "A"}
              </div>
            )}
            <span style={{ fontSize: "12px", fontWeight: selectedId === r.id ? "bold" : "normal", color: "#fff" }}>
              {r.evaluatorName?.split(" ")[0] || "Anónimo"}
            </span>
          </button>
        ))}
      </div>

      {/* 2. PERFILES ENFRENTADOS (HEAD-TO-HEAD) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "16px", alignItems: "center", background: "rgba(0,0,0,0.2)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
        {/* Tu perfil */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "12px", color: "#8fa6c0", marginBottom: "8px", textTransform: "uppercase" }}>Tu perfil</div>
          <div style={{ fontSize: "16px", fontWeight: "bold", color: "#fbaf00", marginBottom: "4px" }}>{gift(topOwn.id)?.name}</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>{topOwn.own}%</div>
        </div>

        {/* VS */}
        <div style={{ fontSize: "14px", fontWeight: "bold", color: "#8fa6c0", background: "rgba(255,255,255,0.1)", padding: "6px 12px", borderRadius: "20px" }}>
          VS
        </div>

        {/* Perfil del evaluador */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "12px", color: "#8fa6c0", marginBottom: "8px", textTransform: "uppercase" }}>{selected.evaluatorName?.split(" ")[0]}</div>
          <div style={{ fontSize: "16px", fontWeight: "bold", color: "#4dd0e1", marginBottom: "4px" }}>{gift(topPeer.id)?.name}</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>{topPeer.peer}%</div>
        </div>
      </div>

      {/* 3. HALLAZGOS INTERPRETADOS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
        <div style={{ background: "rgba(6, 167, 125, 0.1)", borderLeft: "4px solid #06a77d", padding: "12px", borderRadius: "8px" }}>
          <div style={{ fontSize: "11px", color: "#06a77d", fontWeight: "bold", textTransform: "uppercase", marginBottom: "4px" }}>Coincidencia más clara</div>
          <div style={{ fontSize: "14px", color: "#fff" }}>Ambos ven <strong>{gift(bestMatch.id)?.name}</strong> en ti.</div>
        </div>
        <div style={{ background: "rgba(251, 175, 0, 0.1)", borderLeft: "4px solid #fbaf00", padding: "12px", borderRadius: "8px" }}>
          <div style={{ fontSize: "11px", color: "#fbaf00", fontWeight: "bold", textTransform: "uppercase", marginBottom: "4px" }}>Mayor aporte complementario</div>
          <div style={{ fontSize: "14px", color: "#fff" }}>{selected.evaluatorName?.split(" ")[0]} destaca tu <strong>{gift(topPeer.id)?.name}</strong>.</div>
        </div>
        <div style={{ background: "rgba(255, 123, 156, 0.1)", borderLeft: "4px solid #ff7b9c", padding: "12px", borderRadius: "8px" }}>
          <div style={{ fontSize: "11px", color: "#ff7b9c", fontWeight: "bold", textTransform: "uppercase", marginBottom: "4px" }}>Oportunidad para conversar</div>
          <div style={{ fontSize: "14px", color: "#fff" }}>Diferencia de {biggestDiff.diff}% en <strong>{gift(biggestDiff.id)?.name}</strong>.</div>
        </div>
      </div>

      {/* 4. MATRIZ POR DON */}
      <div style={{ background: "rgba(0,0,0,0.2)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {visibleGifts.map((g) => (
            <div key={g.id}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "13px", color: "#e2e8f0", fontWeight: "500" }}>{gift(g.id)?.name}</span>
                <span style={{ fontSize: "11px", color: g.diff > 30 ? "#ff7b9c" : "#8fa6c0" }}>
                  {g.diff > 0 ? `+${g.diff}% dif.` : "Igual"}
                </span>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {/* Tu barra */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "20px", fontSize: "10px", color: "#8fa6c0" }}>Tú</span>
                  <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "4px" }}>
                    <div style={{ width: `${g.own}%`, height: "100%", background: "#fbaf00", borderRadius: "4px", transition: "width 0.4s" }} />
                  </div>
                  <span style={{ width: "30px", fontSize: "11px", color: "#fbaf00", textAlign: "right", fontWeight: "bold" }}>{Math.round(g.own)}%</span>
                </div>
                {/* Barra del evaluador */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "20px", fontSize: "10px", color: "#8fa6c0" }}>{selected.evaluatorName?.[0] || "?"}</span>
                  <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "4px" }}>
                    <div style={{ width: `${g.peer}%`, height: "100%", background: "#4dd0e1", borderRadius: "4px", transition: "width 0.4s" }} />
                  </div>
                  <span style={{ width: "30px", fontSize: "11px", color: "#4dd0e1", textAlign: "right", fontWeight: "bold" }}>{Math.round(g.peer)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setShowAll(!showAll)}
          style={{ marginTop: "20px", width: "100%", padding: "10px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#8fa6c0", fontSize: "12px", cursor: "pointer" }}
        >
          {showAll ? "Mostrar solo el Top 5" : "Mostrar todos los dones"}
        </button>
      </div>

      <p style={{ marginTop: "8px", fontSize: "11px", opacity: 0.6, textAlign: "center", color: "#8fa6c0" }}>
        La percepción externa usa menos preguntas que tu autoevaluación. Úsala como punto de conversación, no como una medida exacta.
      </p>
    </div>
  );
}