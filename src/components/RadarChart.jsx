import { useMemo } from "react";

export default function RadarChart({ axes, topGiftName }) {
  const center = 150;
  const radius = 100;
  
  const angleFor = (i) => (Math.PI * 2 * i) / axes.length - Math.PI / 2;
  
  const point = (i, amount) => {
    const a = angleFor(i);
    return `${center + Math.cos(a) * radius * amount},${center + Math.sin(a) * radius * amount}`;
  };
  
  const resultPoints = axes.map((ax, i) => point(i, ax.score / 100)).join(" ");

  return (
    <div className="radar-wrap">
      <svg viewBox="0 0 300 300" style={{ width: "100%", height: "100%", overflow: "visible" }} role="img" aria-label="Gráfico de dones">
        <defs>
          <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbaf00" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fbaf00" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75, 1].map((lvl) => (
          <polygon key={lvl} points={axes.map((_, i) => point(i, lvl)).join(" ")} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        ))}
        {axes.map((_, i) => (
          <line key={i} x1={center} y1={center} x2={point(i, 1).split(",")[0]} y2={point(i, 1).split(",")[1]} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        ))}
        
        <polygon points={resultPoints} fill="url(#radarGradient)" stroke="#fbaf00" strokeWidth="2" strokeLinejoin="round" />
        
        {axes.map((ax, i) => {
          const [cx, cy] = point(i, ax.score / 100).split(",");
          
          // ✨ COMPARAMOS POR NOMBRE EN LUGAR DE ID
          const isTop = ax.label === topGiftName;
          
          return (
            <g key={ax.label}>
              {isTop && <circle cx={cx} cy={cy} r="12" fill="rgba(251, 175, 0, 0.2)" className="pulse-halo" />}
              <circle 
                cx={cx} cy={cy} r={isTop ? "6" : "3"} 
                fill={isTop ? "#fbaf00" : "#052f5f"} 
                stroke={isTop ? "#fff" : "#fbaf00"} 
                strokeWidth={isTop ? "2" : "1.5"} 
              />
              
              {/* El porcentaje SOLO se dibuja si es el don principal */}
              {isTop && (
                <g transform={`translate(${cx}, ${cy - 15})`}>
                  <rect x="-35" y="-12" width="70" height="18" rx="4" fill="#fbaf00" />
                  <text x="0" y="0" textAnchor="middle" fill="#052f5f" fontSize="9" fontWeight="bold" dy=".3em">
                    {ax.score}%
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
      
      {axes.map((ax, i) => {
        const a = angleFor(i);
        const x = 50 + Math.cos(a) * 42;
        const y = 50 + Math.sin(a) * 42;
        
        const isTop = ax.label === topGiftName;
        
        return (
          <span 
            key={ax.label} 
            style={{ 
              position: "absolute", top: `${y}%`, left: `${x}%`, transform: "translate(-50%, -50%)",
              width: "80px", textAlign: "center", fontSize: "9px", pointerEvents: "none",
              color: isTop ? "#fbaf00" : "#8fa6c0", fontWeight: isTop ? "bold" : "normal",
            }}
          >
            {ax.label}
          </span>
        );
      })}
    </div>
  );
}