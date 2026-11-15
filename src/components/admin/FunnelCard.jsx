/** Embudo: cuántos avanzan de una etapa a la siguiente. */
export default function FunnelCard({ funnel }) {
  const top = funnel[0]?.count || 1;
  return (
    <section className="seg-card">
      <h3>Embudo del test</h3>
      {funnel.map((s, i) => {
        const prev = i ? funnel[i - 1].count : null;
        return (
          <div key={s.key} className="seg-funnel-row">
            <div className="seg-funnel-head">
              <span>{s.label}</span>
              <strong>{s.count}{prev ? <small> · {Math.round((s.count / (prev || 1)) * 100)}% del paso anterior</small> : null}</strong>
            </div>
            <div className="seg-bar"><div style={{ width: `${(s.count / top) * 100}%` }} /></div>
          </div>
        );
      })}
    </section>
  );
}
