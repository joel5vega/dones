// Layout de fuerzas (Fruchterman-Reingold) puro y determinista: sin dependencias.
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Devuelve Map<id, {x, y}> dentro de [pad, width-pad] x [pad, height-pad]. */
export function forceLayout(nodes, edges, { width = 1000, height = 700, iterations = 300, seed = 7, pad = 60 } = {}) {
  const n = nodes.length;
  const out = new Map();
  if (!n) return out;
  const rnd = mulberry32(seed);
  const idx = new Map(nodes.map((nd, i) => [nd.id, i]));
  const links = edges.map((e) => [idx.get(e.source), idx.get(e.target)]).filter(([a, b]) => a != null && b != null);
  const cx = width / 2, cy = height / 2;
  const k = Math.sqrt((width * height) / n) * 0.6; // distancia ideal entre nodos
  const x = new Float64Array(n), y = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2, r = Math.min(width, height) * 0.35 * Math.sqrt(rnd());
    x[i] = cx + Math.cos(a) * r; y[i] = cy + Math.sin(a) * r;
  }
  let temp = width / 8;
  const dx = new Float64Array(n), dy = new Float64Array(n);
  for (let it = 0; it < iterations; it++) {
    dx.fill(0); dy.fill(0);
    for (let i = 0; i < n; i++) {           // repulsión entre todos los pares
      for (let j = i + 1; j < n; j++) {
        let ux = x[i] - x[j], uy = y[i] - y[j];
        const d2 = ux * ux + uy * uy + 0.01, d = Math.sqrt(d2), f = (k * k) / d2;
        ux /= d; uy /= d;
        dx[i] += ux * f * d; dy[i] += uy * f * d; dx[j] -= ux * f * d; dy[j] -= uy * f * d;
      }
    }
    for (const [a, b] of links) {           // atracción por aristas
      const ux = x[a] - x[b], uy = y[a] - y[b], d = Math.sqrt(ux * ux + uy * uy) + 0.01, f = d / k;
      dx[a] -= ux * f; dy[a] -= uy * f; dx[b] += ux * f; dy[b] += uy * f;
    }
    for (let i = 0; i < n; i++) {           // gravedad al centro + limitar por temperatura
      dx[i] += (cx - x[i]) * 0.06; dy[i] += (cy - y[i]) * 0.06;
      const d = Math.sqrt(dx[i] * dx[i] + dy[i] * dy[i]) + 0.01, m = Math.min(d, temp);
      x[i] += (dx[i] / d) * m; y[i] += (dy[i] / d) * m;
    }
    temp *= 0.985;
  }
  // Ajusta al área visible manteniendo proporción
  const minX = Math.min(...x), maxX = Math.max(...x), minY = Math.min(...y), maxY = Math.max(...y);
  const s = Math.min((width - 2 * pad) / (maxX - minX || 1), (height - 2 * pad) / (maxY - minY || 1), 3);
  nodes.forEach((nd, i) => out.set(nd.id, {
    x: cx + (x[i] - (minX + maxX) / 2) * s, y: cy + (y[i] - (minY + maxY) / 2) * s,
  }));
  return out;
}
