import { useMemo } from "react";

export default function RadarChart({ axes, topGiftName }) {
  const center = 150;
  const radius = 100;
  
  // Calcula el ángulo para cada eje
  const angleFor = (i) => (Math.PI * 2 * i) / axes.length - Math.PI / 2;
  
  // Calcula las coordenadas X, Y
  const point = (i, amount) => {
    const a = angleFor(i);
    return {
      x: center + Math.cos(a) * radius * amount,
      y: center + Math.sin(a) * radius * amount
    };
  };
  
  // Genera los puntos del polígono (el área coloreada)
  const resultPoints = axes.map((ax, i) => {
    const p = point(i, ax.score / 100);
    return `${p.x},${p.y}`;
  }).join(" ");

  // ✨ Identificamos los 5 puntajes más altos para mostrarles el badge
  const top5Scores = [...axes]
    .map((ax) => ax.score)
    .sort((a, b) => b - a)
    .slice(0, 5);

  return (
    <div className="radar-wrap">
      <svg viewBox="0 0 300 300" style={{ width: "100%", height: "100%", overflow: "visible" }} role="img" aria-label="Gráfico de dones">
        <defs>
          <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbaf00" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fbaf00" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Líneas de fondo y ejes */}
        {[0.25, 0.5, 0.75, 1].map((lvl) => (
          <polygon 
            key={lvl} 
            points={axes.map((_, i) => {
              const p = point(i, lvl);
              return `${p.x},${p.y}`;
            }).join(" ")} 
            fill="none" 
            stroke="rgba(255,255,255,0.08)" 
            strokeWidth="1" 
          />
        ))}
        
        {axes.map((_, i) => {
          const p = point(i, 1);
          return (
            <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          );
        })}
        
        {/* Polígono de resultados */}
        <polygon points={resultPoints} fill="url(#radarGradient)" stroke="#fbaf00" strokeWidth="2" strokeLinejoin="round" />
        
        {/* Puntos en el gráfico */}
        {axes.map((ax, i) => {
          const p = point(i, ax.score / 100);
          const isTop = ax.label === topGiftName;
          
          return (
            <g key={`dot-${ax.label}`}>
              {isTop && (
                <circle 
                  cx={p.x} cy={p.y} r="12" 
                  fill="rgba(251, 175, 0, 0.2)" 
                  className="pulse-halo" 
                />
              )}
              <circle 
                cx={p.x} cy={p.y} r={isTop ? "6" : "3"} 
                fill={isTop ? "#fbaf00" : "#052f5f"} 
                stroke={isTop ? "#fff" : "#fbaf00"} 
                strokeWidth={isTop ? "2" : "1.5"} 
              />
            </g>
          );
        })}
      </svg>
      
      {/* Nombres de los ejes y Badges de porcentaje */}
      {axes.map((ax, i) => {
        const a = angleFor(i);
        const x = 50 + Math.cos(a) * 48;
        const y = 50 + Math.sin(a) * 48;
        
        const isTop = ax.label === topGiftName;
        // ✨ Verificamos si este don está en el Top 5
        const isTop5 = top5Scores.includes(ax.score);

        return (
          <span 
            key={`label-${ax.label}`} 
            style={{ 
              position: "absolute", 
              top: `${y}%`, 
              left: `${x}%`, 
              transform: "translate(-50%, -50%)",
              width: "90px", 
              textAlign: "center", 
              fontSize: "10px", 
              pointerEvents: "none",
              color: isTop ? "#fbaf00" : "#8fa6c0", 
              fontWeight: isTop ? "bold" : "normal",
              textShadow: "0 1px 2px rgba(0,0,0,0.5)", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              gap: "4px" // Espacio entre el badge y el nombre
            }}
          >
            {/* ✨ BADGE DEL PORCENTAJE (Solo para el Top 5) */}
            {isTop5 && (
              <span style={{ 
                background: isTop ? "#fbaf00" : "rgba(251, 175, 0, 0.15)", 
                color: isTop ? "#052f5f" : "#fbaf00", 
                border: isTop ? "none" : "1px solid rgba(251, 175, 0, 0.5)",
                padding: "2px 6px", 
                borderRadius: "6px", 
                fontSize: "9px", 
                fontWeight: "bold",
                lineHeight: "1"
              }}>
                {ax.score}%
              </span>
            )}
            
            {/* Nombre del don */}
            <span style={{ lineHeight: "1.1" }}>
              {ax.label}
            </span>
          </span>
        );
      })}
    </div>
  );
}