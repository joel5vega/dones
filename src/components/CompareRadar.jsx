// CompareRadar.jsx
import "./peer.css";

const CENTER = 150;
const RADIUS = 100;

export default function CompareRadar({ series, axes = [] }) {
  const names = axes.map((ax) => ax.label);
  const totalAxes = names.length;

  if (totalAxes === 0) return null;

  const angle = (i) => (Math.PI * 2 * i) / totalAxes - Math.PI / 2;
  const point = (i, ratio) => ({
    x: CENTER + Math.cos(angle(i)) * RADIUS * ratio,
    y: CENTER + Math.sin(angle(i)) * RADIUS * ratio
  });

  return (
    <div className="radar-wrap">
      <svg viewBox="0 0 300 300" style={{ width: "100%", height: "100%", overflow: "visible" }} role="img" aria-label="Comparación de dones">
        {/* Líneas de fondo */}
        {[0.25, 0.5, 0.75, 1].map((lvl) => (
          <polygon 
            key={lvl} 
            points={names.map((_, i) => `${point(i, lvl).x},${point(i, lvl).y}`).join(" ")} 
            fill="none" 
            stroke="rgba(255,255,255,0.08)" 
          />
        ))}
        
        {/* Ejes radiales */}
        {names.map((_, i) => {
          const p = point(i, 1);
          return <line key={i} x1={CENTER} y1={CENTER} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.08)" />;
        })}

        {/* Series */}
        {series.map((s) => {
          // Calculamos los puntos del polígono
          const polyPoints = names.map((n, i) => {
            const p = point(i, (s.scores[n] ?? 0) / 100);
            return `${p.x},${p.y}`;
          }).join(" ");

          return (
            <g key={s.key}>
              {/* El relleno ahora es casi transparente (0.05) para evitar colores turbios */}
              <polygon
                points={polyPoints}
                fill={s.color}
                fillOpacity="0.05"
                stroke={s.color}
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeDasharray={s.dashed ? "6 4" : undefined}
              />
              {/* Puntos en los vértices para mayor claridad */}
              {names.map((n, i) => {
                const p = point(i, (s.scores[n] ?? 0) / 100);
                return (
                  <circle key={i} cx={p.x} cy={p.y} r="3" fill={s.color} />
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Etiquetas */}
      {names.map((n, i) => (
        <span
          key={n}
          className="radar-axis-label"
          style={{ 
            top: `${50 + Math.sin(angle(i)) * 48}%`, 
            left: `${50 + Math.cos(angle(i)) * 48}%`,
            transform: "translate(-50%, -50%)",
            width: "80px",
            textAlign: "center",
            lineHeight: "1.1"
          }}
        >
          {n}
        </span>
      ))}
    </div>
  );
}