import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useNetwork } from "../../hooks/useNetwork";
import Loader from "../../components/Loader/Loader";
import NetworkGraph, { STAGE_COLOR } from "../../components/admin/NetworkGraph";
import NodePanel from "../../components/admin/NodePanel";
import FunnelCard from "../../components/admin/FunnelCard";
import InsightList from "../../components/admin/InsightList";
import "./seguimiento.css";

const pct = (v) => (v == null ? "—" : `${Math.round(v * 100)}%`);
const Kpi = ({ label, value, hint }) => (
  <div className="seg-card seg-kpi"><span className="seg-kpi-value">{value}</span><span>{label}</span>{hint && <small className="seg-muted">{hint}</small>}</div>
);

/** Panel admin: embudo, viralidad, listas para reactivar y grafo de relaciones. */
export default function Seguimiento() {
  const { user, isAdmin, loading } = useAuth();
  const { network, loading: busy, error, reload } = useNetwork(isAdmin);
  const [selectedId, setSelectedId] = useState(null);
  const [showIsolated, setShowIsolated] = useState(false);
  const [query, setQuery] = useState("");

  const nodesById = useMemo(() => new Map((network?.nodes ?? []).map((n) => [n.id, n])), [network]);
  const visible = useMemo(() => {
    if (!network) return [];
    const q = query.trim().toLowerCase();
    return network.nodes.filter((n) => (showIsolated || n.given + n.received > 0) && (!q || n.name.toLowerCase().includes(q)));
  }, [network, showIsolated, query]);
  const edges = useMemo(() => {
    const ids = new Set(visible.map((n) => n.id));
    return (network?.edges ?? []).filter((e) => ids.has(e.source) && ids.has(e.target));
  }, [network, visible]);

  if (loading) return <Loader />;
  if (!user || !isAdmin) return <Navigate to="/" replace />;
  if (busy && !network) return <Loader />;
  if (error) return <main className="seg-page"><p>No se pudieron cargar los datos. Revisa las reglas de Firestore para admin.</p><button className="btn" onClick={reload}>Reintentar</button></main>;
  if (!network) return null;

  const { stats, insights } = network;
  return (
    <main className="seg-page">
      <header className="seg-head">
        <div><h2>Seguimiento</h2><p className="seg-muted">Quién completó su test, quién evalúa a quién y dónde se pierde gente.</p></div>
        <div className="seg-actions"><button className="btn" onClick={reload} disabled={busy}>{busy ? "Actualizando…" : "Actualizar"}</button><Link to="/perfil" className="btn">Volver</Link></div>
      </header>

      <div className="seg-kpis">
        <Kpi label="Usuarios" value={stats.users} />
        <Kpi label="Enlaces con respuesta" value={pct(stats.inviteResponseRate)} hint={`${stats.ownersWithInvite} personas compartieron enlace`} />
        <Kpi label="Evaluaciones" value={stats.evaluations} hint={`${stats.withEvaluation} personas evaluadas`} />
        <Kpi label="Evaluadores con test propio" value={pct(stats.conversion)} hint={`de ${stats.evaluators} que evaluaron`} />
        <Kpi label="Evaluaciones mutuas" value={stats.reciprocalPairs} hint={`${stats.groups} grupos conectados`} />
      </div>

      <div className="seg-main">
        <section className="seg-card seg-graph">
          <div className="seg-toolbar">
            <input type="search" placeholder="Buscar persona…" value={query} onChange={(e) => setQuery(e.target.value)} />
            <label><input type="checkbox" checked={showIsolated} onChange={(e) => setShowIsolated(e.target.checked)} /> Mostrar sin conexiones</label>
          </div>
          {visible.length === 0 ? <p className="seg-muted">Aún no hay evaluaciones para mostrar.</p>
            : <NetworkGraph nodes={visible} edges={edges} selectedId={selectedId} onSelect={setSelectedId} />}
          <ul className="seg-legend">
            {[["completo", "Test completo"], ["en-progreso", "Test a medias"], ["nuevo", "Sin empezar"]].map(([k, l]) => (
              <li key={k}><span className="seg-dot" style={{ background: STAGE_COLOR[k] }} />{l}</li>
            ))}
            <li><span className="seg-line ok" />Evaluó (ya hizo su test)</li>
            <li><span className="seg-line pend" />Evaluó (sin test propio)</li>
          </ul>
        </section>
        <NodePanel node={nodesById.get(selectedId)} nodesById={nodesById} edges={network.edges} onSelect={setSelectedId} />
      </div>

      <div className="seg-grid">
        <FunnelCard funnel={stats.funnel} />
        <InsightList title="Evaluaron pero no tienen test" hint="Mejor oportunidad: ya conocen la app."
          items={insights.convert} detail={(n) => `evaluó a ${n.given}`} onSelect={setSelectedId} />
        <InsightList title="Dejaron el test a medias" hint="Empezaron y no volvieron (7+ días)."
          items={insights.stalled} detail={(n) => `${Math.round(n.progress * 100)}% · ${n.idleDays == null ? "sin fecha" : `${n.idleDays} d`}`} onSelect={setSelectedId} />
        <InsightList title="Compartieron enlace sin respuesta" hint="Crearon su enlace y nadie evaluó aún."
          items={insights.unanswered} detail={(n) => (n.tested ? "test completo" : "sin test")} onSelect={setSelectedId} />
        <InsightList title="Completaron y no han invitado" hint="Anímalos a compartir su enlace."
          items={insights.share} detail={(n) => n.top?.name ?? ""} onSelect={setSelectedId} />
      </div>
    </main>
  );
}
