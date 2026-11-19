import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loader from "../../components/Loader/Loader";
import { INTEREST_OPTIONS, SKILL_OPTIONS, CONTEXT_OPTIONS, AVAILABILITY_OPTIONS, CAUSE_OPTIONS } from "../../data/intereses";
import { MINISTRY_STARTERS } from "../../data/ministerios";
import { recommendMinistries } from "../../utils/ministryMatcher";
import { saveDiscernment } from "../../services/discernmentService";
import { getMyMinistryProposals, getPendingMinistries, getPublishedMinistries, proposeMinistry, reviewMinistry } from "../../services/ministerioService";
import "./servicio.css";

const blankMinistry = { name:"", description:"", scope:"church", gifts:[], interests:[], skills:[], causes:[], activities:"", commitment:"", requirements:"" };
const giftNames = ["Liderazgo","Administración","Enseñanza","Conocimiento","Sabiduría","Profecía","Discernimiento","Exhortación","Pastoreo","Fe","Evangelismo","Apostolado","Servicio / Ayuda","Misericordia","Dar","Hospitalidad"];

function ChipGroup({ title, options, value, onChange, hint }) {
  const toggle = (item) => onChange(value.includes(item) ? value.filter((entry) => entry !== item) : [...value, item]);
  return <fieldset className="service-fieldset"><legend>{title}</legend>{hint && <p className="service-hint">{hint}</p>}<div className="service-chips">{options.map((item) => <button type="button" key={item} className={value.includes(item) ? "service-chip selected" : "service-chip"} aria-pressed={value.includes(item)} onClick={() => toggle(item)}>{item}</button>)}</div></fieldset>;
}

function MinistryCard({ ministry, proposed = false }) {
  return <article className="ministry-card">
    <div className="ministry-card-top"><span className="service-tag">{ministry.scope === "society" ? "Sociedad" : ministry.scope === "both" ? "Iglesia y sociedad" : "Iglesia local"}</span>{proposed ? <span className="service-status">{ministry.status === "rejected" ? "No aprobada" : "Pendiente de revisión"}</span> : Number.isFinite(ministry.matchScore) ? <span className="service-match">{ministry.matchScore}% de afinidad orientativa</span> : null}</div>
    <h3>{ministry.name}</h3><p>{ministry.description}</p>
    {!proposed && ministry.reasons?.length > 0 && <div className="service-reasons"><strong>Por qué podría encajar:</strong><ul>{ministry.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></div>}
    <div className="service-meta"><span><strong>Dones relacionados:</strong> {(ministry.gifts || []).join(", ") || "Por definir"}</span><span><strong>Intereses:</strong> {(ministry.interests || []).join(", ") || "Por definir"}</span><span><strong>Dedicación:</strong> {ministry.commitment || "A conversar"}</span></div>
    {ministry.requirements?.length > 0 && <p className="service-hint"><strong>Consideraciones:</strong> {ministry.requirements.join(" · ")}</p>}
    {!proposed && <p className="service-disclaimer">Esta sugerencia es un punto de partida para conversar y probar; no es una asignación ni una confirmación de un don.</p>}
  </article>;
}

export default function Servicio() {
  const { user, profile, loading, patchProfile, isAdmin } = useAuth();
  const [form, setForm] = useState({ interests:[], skills:[], causes:[], context:"both", availability:[] });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [remote, setRemote] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [pendingReview, setPendingReview] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [draft, setDraft] = useState(blankMinistry);
  const [submitting, setSubmitting] = useState(false);
  const [reviewing, setReviewing] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!profile) return;
    setForm({ interests:profile.discernment?.interests || [], skills:profile.discernment?.skills || [], causes:profile.discernment?.causes || [], context:profile.discernment?.context || "both", availability:profile.discernment?.availability || [] });
  }, [profile?.uid, profile?.discernment]);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const [published, mine, pending] = await Promise.all([getPublishedMinistries(), getMyMinistryProposals(user.uid), isAdmin ? getPendingMinistries() : Promise.resolve([])]);
      setRemote(published); setProposals(mine.filter((item) => item.status !== "active")); setPendingReview(pending);
    } catch (error) { console.error("No se pudieron cargar los ministerios", error); setNotice("No fue posible cargar el catálogo comunitario. Puedes seguir explorando las sugerencias iniciales."); }
    finally { setLoadingData(false); }
  }, [user, isAdmin]);

  useEffect(() => { refresh(); }, [refresh]);

  const catalog = useMemo(() => [...MINISTRY_STARTERS, ...remote], [remote]);
  const recommendations = useMemo(() => recommendMinistries(catalog, form, profile?.resultado || {}), [catalog, form, profile?.resultado]);

  const update = (key, value) => { setForm((current) => ({ ...current, [key]:value })); setSaved(false); };
  const save = async (event) => {
    event.preventDefault(); setSaving(true); setNotice("");
    try { const clean = await saveDiscernment(user.uid, form); patchProfile({ discernment:clean }); setSaved(true); setNotice("Tus intereses y preferencias quedaron guardados."); }
    catch (error) { console.error(error); setNotice("No se pudo guardar. Revisa tu conexión e inténtalo de nuevo."); }
    finally { setSaving(false); }
  };

  const submitProposal = async (event) => {
    event.preventDefault(); setSubmitting(true); setNotice("");
    try {
      const payload = { ...draft, gifts:draft.gifts, interests:draft.interests, skills:draft.skills, causes:draft.causes, activities:draft.activities.split("
").map((v)=>v.trim()).filter(Boolean), requirements:draft.requirements.split("
").map((v)=>v.trim()).filter(Boolean) };
      await proposeMinistry(user.uid, profile, payload);
      setDraft(blankMinistry); setShowCreate(false); await refresh(); setNotice("Propuesta enviada. Quedará pendiente de revisión antes de publicarse.");
    } catch (error) { console.error(error); setNotice("No se pudo enviar la propuesta. Inténtalo nuevamente."); }
    finally { setSubmitting(false); }
  };

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/" replace />;

  return <main className="service-page">
    <header className="service-hero"><span className="service-eyebrow">DISCERNIMIENTO Y SERVICIO</span><h1>Mi servicio</h1><p>Conecta lo que te interesa, lo que sabes hacer y lo que la comunidad necesita. Explora posibilidades y conversa con otros antes de comprometerte.</p><div className="service-steps"><span>01 · Conócete</span><span>02 · Explora</span><span>03 · Conversa y prueba</span></div></header>

    {!profile?.resultado && <div className="service-callout"><strong>Aún no has completado el test de dones.</strong><p>Puedes completar tu perfil de intereses ahora; cuando tengas resultados, las sugerencias también podrán considerar esa información.</p><Link to="/test" className="service-button">Hacer el test</Link></div>}

    <section className="service-section"><div className="service-section-heading"><div><span className="service-eyebrow">ETAPA 1</span><h2>Gustos, intereses y habilidades</h2><p>No hay respuestas correctas. Marca aquello que genuinamente disfrutas o te gustaría explorar.</p></div></div>
      <form onSubmit={save} className="service-form">
        <ChipGroup title="¿Qué temas o personas despiertan tu interés?" options={INTEREST_OPTIONS} value={form.interests} onChange={(v)=>update("interests",v)} hint="Puedes elegir varias opciones."/>
        <ChipGroup title="¿Qué necesidades o causas te conmueven?" options={CAUSE_OPTIONS} value={form.causes} onChange={(v)=>update("causes",v)}/>
        <ChipGroup title="¿Qué habilidades o experiencias puedes aportar?" options={SKILL_OPTIONS} value={form.skills} onChange={(v)=>update("skills",v)}/>
        <div className="service-fieldset"><label htmlFor="service-context">¿Dónde te gustaría servir?</label><select id="service-context" value={form.context} onChange={(e)=>update("context",e.target.value)}>{CONTEXT_OPTIONS.map((o)=><option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
        <ChipGroup title="¿Cuándo sueles tener disponibilidad?" options={AVAILABILITY_OPTIONS} value={form.availability} onChange={(v)=>update("availability",v)}/>
        <div className="service-form-footer"><span className="service-hint">Puedes volver y actualizar esta información cuando cambien tus intereses o disponibilidad.</span><button className="service-button" disabled={saving}>{saving ? "Guardando…" : "Guardar mis preferencias"}</button></div>
      </form>
      {saved && <p className="service-success" role="status">Preferencias guardadas.</p>}
    </section>

    <section className="service-section"><div className="service-section-heading"><div><span className="service-eyebrow">ETAPA 2</span><h2>Ministerios y formas de servir que podrías explorar</h2><p>Las coincidencias son orientativas. El porcentaje solo resume afinidad entre los datos que compartiste y el perfil de cada ministerio.</p></div></div>
      {loadingData ? <Loader/> : recommendations.length ? <div className="ministry-grid">{recommendations.map((m)=><MinistryCard key={m.id} ministry={m}/>)}</div> : <div className="service-empty">Aún no hay coincidencias suficientes. Selecciona algunos intereses o habilidades para descubrir opciones.</div>}
      <div className="service-note"><strong>Importante:</strong> los dones no determinan por sí solos tu lugar de servicio. Considera también tu carácter, madurez, circunstancias, formación, confirmación comunitaria y conversación con los responsables de tu iglesia.</div>
    </section>

    <section className="service-section"><div className="service-section-heading"><div><span className="service-eyebrow">ETAPA 3</span><h2>Proponer un ministerio o modalidad de servicio</h2><p>¿No encuentras una opción que responda a una necesidad real? Puedes proponer una nueva iniciativa, sodalidad o ministerio.</p></div><button className="service-button secondary" type="button" onClick={()=>setShowCreate((v)=>!v)}>{showCreate ? "Cerrar formulario" : "＋ Crear propuesta"}</button></div>
      {showCreate && <form className="service-form ministry-create-form" onSubmit={submitProposal}>
        <label>Nombre del ministerio<input required maxLength="90" value={draft.name} onChange={(e)=>setDraft({...draft,name:e.target.value})} placeholder="Ej. Acompañamiento a familias"/></label>
        <label>Propósito y descripción<textarea required minLength="25" maxLength="700" rows="3" value={draft.description} onChange={(e)=>setDraft({...draft,description:e.target.value})} placeholder="¿Qué necesidad busca atender y a quiénes servirá?"/></label>
        <label>Ámbito<select value={draft.scope} onChange={(e)=>setDraft({...draft,scope:e.target.value})}><option value="church">Iglesia local</option><option value="society">Sociedad / comunidad</option><option value="both">Ambos ámbitos</option></select></label>
        <ChipGroup title="Dones que podrían contribuir (orientativo)" options={giftNames} value={draft.gifts} onChange={(v)=>setDraft({...draft,gifts:v})}/>
        <ChipGroup title="Intereses relacionados" options={INTEREST_OPTIONS} value={draft.interests} onChange={(v)=>setDraft({...draft,interests:v})}/>
        <ChipGroup title="Necesidades o causas que busca atender" options={CAUSE_OPTIONS} value={draft.causes} onChange={(v)=>setDraft({...draft,causes:v})}/>
        <ChipGroup title="Habilidades necesarias" options={SKILL_OPTIONS} value={draft.skills} onChange={(v)=>setDraft({...draft,skills:v})}/>
        <label>Actividades principales (una por línea)<textarea rows="3" value={draft.activities} onChange={(e)=>setDraft({...draft,activities:e.target.value})} placeholder={"Visitar familias
Organizar encuentros
Preparar recursos"}/></label>
        <label>Dedicación estimada<input value={draft.commitment} onChange={(e)=>setDraft({...draft,commitment:e.target.value})} placeholder="Ej. Dos sábados al mes"/></label>
        <label>Requisitos, formación o cuidados (uno por línea)<textarea rows="2" value={draft.requirements} onChange={(e)=>setDraft({...draft,requirements:e.target.value})}/></label>
        <p className="service-hint">La propuesta se guardará como pendiente y no aparecerá en el catálogo hasta que sea revisada por un administrador.</p>
        <button className="service-button" disabled={submitting}>{submitting ? "Enviando…" : "Enviar propuesta para revisión"}</button>
      </form>}
      {isAdmin && pendingReview.length > 0 && <div className="service-proposals"><h3>Propuestas por revisar</h3><div className="ministry-grid">{pendingReview.map((p)=><article className="ministry-card" key={p.id}><MinistryCard ministry={p} proposed/><p className="service-hint">Propuesta de: {p.ownerName || "Usuario"}</p><div className="service-steps"><button className="service-button" disabled={!!reviewing} onClick={async()=>{setReviewing(p.id);try{await reviewMinistry(p.id,"active");await refresh();setNotice("Ministerio aprobado y publicado.");}catch(e){setNotice("No se pudo aprobar la propuesta.");}finally{setReviewing("");}}}>Aprobar y publicar</button><button className="service-button secondary" disabled={!!reviewing} onClick={async()=>{setReviewing(p.id);try{await reviewMinistry(p.id,"rejected");await refresh();setNotice("Propuesta marcada como no aprobada.");}catch(e){setNotice("No se pudo actualizar la propuesta.");}finally{setReviewing("");}}}>No aprobar</button></div></article>)}</div></div>}
      {proposals.length > 0 && <div className="service-proposals"><h3>Mis propuestas</h3><div className="ministry-grid">{proposals.map((p)=><MinistryCard key={p.id} ministry={p} proposed/>)}</div></div>}
    </section>
    {notice && <p className="service-notice" role="status">{notice}</p>}
    <footer className="service-footer">“Cada uno según el don que ha recibido, minístrelo a los otros…” · 1 Pedro 4:10<Link to="/evaluaciones">Ver mis evaluaciones comunitarias</Link></footer>
  </main>;
}
