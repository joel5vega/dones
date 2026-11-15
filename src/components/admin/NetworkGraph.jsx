import { useEffect, useMemo, useRef, useState } from "react";
import { forceLayout } from "../../utils/forceLayout";

export const STAGE_COLOR = { completo: "#06a77d", "en-progreso": "#fbaf00", nuevo: "#6b9ac4", fantasma: "#6b7a8c" };
const VB = { w: 1000, h: 700 };
const radius = (n) => 13 + Math.min(n.received, 8) * 2.2;
const initials = (name) => name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

/** Grafo SVG: nodo = persona (color = etapa), flecha = "evaluó a" (punteada si el evaluador no hizo su test). */
export default function NetworkGraph({ nodes, edges, selectedId, onSelect }) {
  const pos = useMemo(() => forceLayout(nodes, edges, { width: VB.w, height: VB.h }), [nodes, edges]);
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const [view, setView] = useState({ k: 1, x: 0, y: 0 });
  const svgRef = useRef(null);
  const drag = useRef(null);

  // Vecinos del nodo seleccionado (el resto se atenúa)
  const focus = useMemo(() => {
    if (!selectedId) return null;
    const s = new Set([selectedId]);
    edges.forEach((e) => {
      if (e.source === selectedId) s.add(e.target);
      if (e.target === selectedId) s.add(e.source);
    });
    return s;
  }, [selectedId, edges]);

  // Zoom con rueda alrededor del cursor (listener no pasivo para poder evitar el scroll)
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return undefined;
    const onWheel = (ev) => {
      ev.preventDefault();
      const r = el.getBoundingClientRect();
      const px = ((ev.clientX - r.left) / r.width) * VB.w, py = ((ev.clientY - r.top) / r.height) * VB.h;
      setView((v) => {
        const k = Math.min(4, Math.max(0.5, v.k * (ev.deltaY < 0 ? 1.12 : 1 / 1.12)));
        return { k, x: px - (px - v.x) * (k / v.k), y: py - (py - v.y) * (k / v.k) };
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const down = (e) => { drag.current = { sx: e.clientX, sy: e.clientY, x: view.x, y: view.y, moved: false }; e.currentTarget.setPointerCapture?.(e.pointerId); };
  const move = (e) => {
    const d = drag.current;
    if (!d) return;
    const r = svgRef.current.getBoundingClientRect();
    const mx = e.clientX - d.sx, my = e.clientY - d.sy;
    if (Math.abs(mx) + Math.abs(my) > 3) d.moved = true;
    setView((v) => ({ ...v, x: d.x + (mx / r.width) * VB.w, y: d.y + (my / r.height) * VB.h }));
  };
  const up = () => { if (drag.current && !drag.current.moved) onSelect(null); drag.current = null; };

  const showLabel = (n) => nodes.length <= 30 || !focus || focus.has(n.id);

  return (
    <svg ref={svgRef} viewBox={`0 0 ${VB.w} ${VB.h}`} width="100%" role="img" aria-label="Grafo de relaciones"
      style={{ display: "block", touchAction: "none", cursor: "grab", background: "rgba(0,0,0,0.18)", borderRadius: 16 }}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={() => (drag.current = null)}>
      <defs>
        {[["ok", "#06a77d"], ["pend", "#fbaf00"]].map(([id, c]) => (
          <marker key={id} id={`arrow-${id}`} viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill={c} />
          </marker>
        ))}
      </defs>
      <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
        {edges.map((e) => {
          let a = pos.get(e.source), b = pos.get(e.target);
          if (!a || !b) return null;
          const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
          const ux = (b.x - a.x) / len, uy = (b.y - a.y) / len;
          // Si hay evaluación mutua, separa las dos flechas para que no se encimen
          const off = e.reciprocal ? 6 : 0;
          const ox = -uy * off, oy = ux * off;
          const rt = radius(byId.get(e.target)) + 5, rs = radius(byId.get(e.source)) + 2;
          const x1 = a.x + ux * rs + ox, y1 = a.y + uy * rs + oy;
          const x2 = b.x - ux * rt + ox, y2 = b.y - uy * rt + oy;
          const on = !focus || e.source === selectedId || e.target === selectedId;
          const c = e.evaluatorTested ? "#06a77d" : "#fbaf00";
          return (
            <line key={e.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={on ? 2.4 : 1.4}
              strokeDasharray={e.evaluatorTested ? undefined : "7 6"} opacity={on ? 0.9 : 0.1}
              markerEnd={`url(#arrow-${e.evaluatorTested ? "ok" : "pend"})`} />
          );
        })}
        {nodes.map((n) => {
          const p = pos.get(n.id);
          if (!p) return null;
          const r = radius(n), sel = n.id === selectedId, dim = focus && !focus.has(n.id);
          return (
            <g key={n.id} transform={`translate(${p.x} ${p.y})`} opacity={dim ? 0.18 : 1} style={{ cursor: "pointer" }}
              onPointerDown={(ev) => ev.stopPropagation()} onClick={(ev) => { ev.stopPropagation(); onSelect(n.id); }}>
              {sel && <circle r={r + 8} fill="none" stroke="#e6efe9" strokeWidth="2.5" />}
              <circle r={r} fill={STAGE_COLOR[n.stage]} stroke="#052f5f" strokeWidth="3"
                strokeDasharray={n.ghost ? "4 3" : undefined} />
              {n.stage === "en-progreso" && (
                <circle r={r + 4} fill="none" stroke="#fbaf00" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * (r + 4) * n.progress} ${2 * Math.PI * (r + 4)}`} transform="rotate(-90)" opacity="0.9" />
              )}
              <text textAnchor="middle" dy="0.35em" fontSize={Math.max(11, r * 0.8)} fontWeight="700" fill="#052f5f"
                fontFamily="Inter, system-ui, sans-serif" pointerEvents="none">{n.ghost ? "?" : initials(n.name)}</text>
              {showLabel(n) && [true, false].map((halo) => (
                <text key={halo ? "h" : "t"} textAnchor="middle" y={r + 18} fontSize="14" fontFamily="Inter, system-ui, sans-serif"
                  fill={halo ? "none" : "#e6efe9"} stroke={halo ? "#052f5f" : "none"} strokeWidth={halo ? 4 : 0}
                  strokeLinejoin="round" pointerEvents="none">{n.name.split(/\s+/)[0]}</text>
              ))}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
