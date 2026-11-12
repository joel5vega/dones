import categorias from "../data/categorias";
import "./peer.css";

const CENTER = 150;
const RADIUS = 100;
const names = categorias.map((c) => c.name); // eje fijo para todas las series

const angle = (i) => (Math.PI * 2 * i) / names.length - Math.PI / 2;
const point = (i, ratio) =>
  `${CENTER + Math.cos(angle(i)) * RADIUS * ratio},${CENTER + Math.sin(angle(i)) * RADIUS * ratio}`;

/**
 * series: [{ key, color, scores: { [nombreDon]: 0-100 }, dashed? }]
 * Dibuja todas las series superpuestas sobre los mismos ejes.
 */
export default function CompareRadar({ series }) {
  return (
    <div className="radar-wrap">
      <svg viewBox="0 0 300 300" style={{ width: "100%", height: "100%", overflow: "visible" }} role="img" aria-label="Comparación de dones">
        {[0.25, 0.5, 0.75, 1].map((lvl) => (
          <polygon key={lvl} points={names.map((_, i) => point(i, lvl)).join(" ")} fill="none" stroke="rgba(255,255,255,0.08)" />
        ))}
        {names.map((_, i) => {
          const [x, y] = point(i, 1).split(",");
          return <line key={i} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" />;
        })}

        {series.map((s) => (
          <polygon
            key={s.key}
            points={names.map((n, i) => point(i, (s.scores[n] ?? 0) / 100)).join(" ")}
            fill={s.color}
            fillOpacity="0.12"
            stroke={s.color}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeDasharray={s.dashed ? "5 3" : undefined}
          />
        ))}
      </svg>

      {names.map((n, i) => (
        <span
          key={n}
          className="radar-axis-label"
          style={{ top: `${50 + Math.sin(angle(i)) * 42}%`, left: `${50 + Math.cos(angle(i)) * 42}%` }}
        >
          {n}
        </span>
      ))}
    </div>
  );
}
