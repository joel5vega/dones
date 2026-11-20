import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loader from "../../components/Loader/Loader";
import { MINISTRY_STARTERS } from "../../data/ministerios";
import { TAXONOMY_LABELS } from "../../data/intereses";
import { DEFAULT_MINISTRY_TAXONOMY, getMinistryTaxonomy, addMinistryCategory } from "../../services/taxonomyService";
import {
  createMinistry, getAdminMinistries, getPendingMinistries, importStarterMinistry,
  removeMinistryLogo, reviewMinistry, setMinistryStatus, updateMinistry, uploadMinistryLogo,
} from "../../services/ministerioService";
import "./ministerios.css";

const CATEGORY_LABELS = { gifts:"Dones relacionados", interests:"Intereses", skills:"Habilidades", causes:"Causas" };
const empty = { name:"", description:"", scope:"church", websiteUrl:"", whatsappPhone:"", gifts:[], interests:[], skills:[], causes:[], activities:[], commitment:"", requirements:[], taxonomySuggestions:{} };
const split = (value) => String(value || "").split(",").map((v) => v.trim()).filter(Boolean);
const join = (value) => Array.isArray(value) ? value.join(", ") : "";
const fromMinistry = (item) => ({ ...empty, ...item, gifts:item.gifts || [], interests:item.interests || [], skills:item.skills || [], causes:item.causes || [], activities:item.activities || [], requirements:item.requirements || [] });

function ImageField({ file, setFile, currentUrl }) {
  const preview = useMemo(() => file ? URL.createObjectURL(file) : currentUrl, [file, currentUrl]);
  useEffect(() => () => { if (preview && file) URL.revokeObjectURL(preview); }, [preview, file]);
  return <div className="ministry-image-field"><div className="ministry-image-preview">{preview ? <img src={preview} alt="Vista previa del logotipo" /> : <span>Sin imagen</span>}</div><div><label className="admin-file-label">Foto o logotipo<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e)=>setFile(e.target.files?.[0] || null)}/></label><small>JPG, PNG o WebP. Máximo 3 MB. Recomendado: imagen cuadrada.</small>{file && <button type="button" className="admin-text-button" onClick={()=>setFile(null)}>Quitar selección</button>}</div></div>;
}


function CategoryPicker({ category, options = [], value = [], onChange }) {
 const toggle=(item)=>onChange(value.includes(item)?value.filter((entry)=>entry!==item):[...value,item]);
 return <fieldset className="admin-category-picker"><legend>{CATEGORY_LABELS[category]}</legend><div className="admin-category-options">{options.map((item)=><button type="button" key={item} className={value.includes(item)?"admin-category-chip selected":"admin-category-chip"} aria-pressed={value.includes(item)} onClick={()=>toggle(item)}>{item}</button>)}</div></fieldset>;
}

export default function AdminMinisterios() {
  const { user, isAdmin, loading } = useAuth();
  const [items, setItems] = useState([]);
  const [pending, setPending] = useState([]);
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(empty);
  const [logoFile, setLogoFile] = useState(null);
  const [currentLogo, setCurrentLogo] = useState("");
  const [search, setSearch] = useState("");
  const [taxonomy, setTaxonomy] = useState(DEFAULT_MINISTRY_TAXONOMY);
  const [newCategory, setNewCategory] = useState({ type:"interests", label:"" });

  const refresh = useCallback(async () => {
    setBusy(true);
    try { const [all, queue, categories] = await Promise.all([getAdminMinistries(), getPendingMinistries(), getMinistryTaxonomy()]); setItems(all); setPending(queue); setTaxonomy(categories); }
    catch (error) { console.error(error); setMessage("No se pudieron cargar los ministerios. Comprueba los permisos de Firestore."); }
    finally { setBusy(false); }
  }, []);
  useEffect(() => { if (isAdmin) refresh(); }, [isAdmin, refresh]);

  const startNew = () => { setEditingId("new"); setDraft(empty); setCurrentLogo(""); setLogoFile(null); setMessage(""); };
  const startEdit = (item) => { setEditingId(item.id); setDraft(fromMinistry(item)); setCurrentLogo(item.logoUrl || ""); setLogoFile(null); setMessage(""); };
  const cancel = () => { setEditingId(null); setDraft(empty); setCurrentLogo(""); setLogoFile(null); };
  const set = (key, value) => setDraft((current) => ({ ...current, [key]:value }));

  const save = async (event) => {
    event.preventDefault(); setSaving(true); setMessage("");
    try {
      const payload = { ...draft, name:draft.name.trim(), description:draft.description.trim(), websiteUrl:(draft.websiteUrl || "").trim(), whatsappPhone:(draft.whatsappPhone || "").trim(), taxonomySuggestions:Object.fromEntries(Object.entries(draft.taxonomySuggestions || {}).map(([key,value])=>[key,String(value).trim()]).filter(([,value])=>value)) };
      let id = editingId;
      if (editingId === "new") { const created = await createMinistry(payload); id = created.id; }
      else await updateMinistry(editingId, payload);
      if (logoFile) { const logoUrl = await uploadMinistryLogo(id, logoFile); await updateMinistry(id, { logoUrl }); }
      setMessage("Ministerio guardado correctamente."); cancel(); await refresh();
    } catch (error) { console.error(error); setMessage(error.message || "No se pudo guardar el ministerio."); }
    finally { setSaving(false); }
  };

  const importStarter = async (starter) => {
    if (items.some((item) => item.starterId === starter.id)) { setMessage("Esta plantilla ya fue incorporada al catálogo."); return; }
    try { await importStarterMinistry(starter); setMessage("Plantilla incorporada. Ya puedes editarla y añadir su logotipo."); await refresh(); }
    catch (error) { console.error(error); setMessage("No se pudo incorporar la plantilla."); }
  };

  const filtered = items.filter((item) => `${item.name} ${item.description}`.toLowerCase().includes(search.toLowerCase()));
  const active = filtered.filter((item) => item.status === "active");
  const inactive = filtered.filter((item) => item.status === "inactive" || item.status === "rejected");
  if (loading) return <Loader />;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  return <main className="admin-ministries-page">
    <header className="admin-ministries-head"><div><span className="service-eyebrow">ADMINISTRACIÓN</span><h1>Ministerios y sodalidades</h1><p>Administra el catálogo, revisa propuestas y añade una identidad visual a cada iniciativa.</p></div><div className="admin-ministries-actions"><Link className="service-button secondary" to="/servicio">Ver como usuario</Link><button className="service-button" onClick={startNew}>＋ Nuevo ministerio</button></div></header>
    {message && <p className="admin-ministries-message" role="status">{message}</p>}
    {editingId && <form className="admin-ministry-form" onSubmit={save}>
      <div className="admin-form-title"><h2>{editingId === "new" ? "Crear ministerio" : "Editar ministerio"}</h2><button type="button" className="admin-text-button" onClick={cancel}>Cerrar</button></div>
      <ImageField file={logoFile} setFile={setLogoFile} currentUrl={currentLogo}/>
      {currentLogo && !logoFile && <button type="button" className="admin-text-button" onClick={async()=>{try{await removeMinistryLogo(editingId);await updateMinistry(editingId,{logoUrl:""});setCurrentLogo("");setMessage("Logotipo eliminado.");}catch(e){setMessage("No se pudo eliminar el logotipo.");}}}>Eliminar logotipo actual</button>}
      <label>Nombre<input required maxLength="90" value={draft.name} onChange={(e)=>set("name",e.target.value)}/></label>
      <label>Descripción y propósito<textarea required minLength="20" maxLength="700" rows="3" value={draft.description} onChange={(e)=>set("description",e.target.value)}/></label>
      <label>Ámbito<select value={draft.scope} onChange={(e)=>set("scope",e.target.value)}><option value="church">Iglesia local</option><option value="society">Sociedad / comunidad</option><option value="both">Iglesia y sociedad</option></select></label>
      <details className="admin-form-details"><summary>Contacto (opcional)</summary><div className="admin-form-details-body"><label>Sitio web<input type="url" value={draft.websiteUrl || ""} onChange={(e)=>set("websiteUrl",e.target.value)} placeholder="https://ejemplo.org"/></label><label>WhatsApp<input type="tel" value={draft.whatsappPhone || ""} onChange={(e)=>set("whatsappPhone",e.target.value)} placeholder="+591 70000000"/></label></div></details>
      <details className="admin-form-details"><summary>Dones e intereses relacionados</summary><div className="admin-form-details-body">{Object.keys(DEFAULT_MINISTRY_TAXONOMY).map((category)=><CategoryPicker key={category} category={category} options={taxonomy[category]||[]} value={draft[category]||[]} onChange={(value)=>set(category,value)}/>)}</div></details>
      <details className="admin-form-details"><summary>Actividades y requisitos</summary><div className="admin-form-details-body"><label>Actividades<textarea rows="2" value={join(draft.activities)} onChange={(e)=>set("activities",split(e.target.value))}/></label><label>Dedicación estimada<input value={draft.commitment||""} onChange={(e)=>set("commitment",e.target.value)}/></label><label>Requisitos y cuidados<textarea rows="2" value={join(draft.requirements)} onChange={(e)=>set("requirements",split(e.target.value))}/></label></div></details>
      <div className="admin-form-actions"><button className="service-button" disabled={saving}>{saving ? "Guardando…" : "Guardar ministerio"}</button><button type="button" className="service-button secondary" onClick={cancel}>Cancelar</button></div>
    </form>}

    <details className="admin-ministry-section admin-collapsible"><summary><span>Propuestas pendientes</span><b className="admin-count">{pending.length}</b></summary><p>Revisa las propuestas antes de publicarlas.</p>
      {busy ? <Loader/> : pending.length === 0 ? <p className="admin-ministry-empty">No hay propuestas pendientes.</p> : <div className="admin-ministry-grid">{pending.map((item)=><article className="admin-ministry-card" key={item.id}><h3>{item.name}</h3><p>{item.description}</p><small>Propuesta de {item.ownerName || "Usuario"}</small><div className="admin-card-actions"><button className="service-button" onClick={async()=>{await reviewMinistry(item.id,"active");await refresh();}}>Aprobar</button><button className="service-button secondary" onClick={()=>startEdit(item)}>Editar</button><button className="admin-text-button" onClick={async()=>{await reviewMinistry(item.id,"rejected");await refresh();}}>Rechazar</button></div></article>)}</div>}
    </details>

    <details className="admin-ministry-section admin-collapsible" open><summary><span>Catálogo de ministerios</span><b className="admin-count">{active.length}</b></summary><p>Ministerios que aparecen en las recomendaciones.</p><input className="admin-ministry-search" type="search" placeholder="Buscar ministerio…" value={search} onChange={(e)=>setSearch(e.target.value)}/>
      {busy ? <Loader/> : <div className="admin-ministry-grid">{active.map((item)=><article className="admin-ministry-card" key={item.id}>{item.logoUrl && <img className="admin-ministry-logo" src={item.logoUrl} alt={`Logotipo de ${item.name}`}/>}<h3>{item.name}</h3><p>{item.description}</p>{item.websiteUrl && <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer">Visitar sitio web ↗</a>}{item.whatsappPhone && <a className="admin-whatsapp-link" href={`https://wa.me/${item.whatsappPhone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>}<small>{item.scope === "society" ? "Sociedad" : item.scope === "both" ? "Iglesia y sociedad" : "Iglesia local"}</small><div className="admin-card-actions"><button className="service-button" onClick={()=>startEdit(item)}>Editar</button><button className="service-button secondary" onClick={async()=>{if(window.confirm(`¿Desactivar "${item.name}"? Dejará de recomendarse, pero no se borrará.`)){await setMinistryStatus(item.id,"inactive");await refresh();}}}>Desactivar</button></div></article>)}</div>}
    </details>

    <details className="admin-ministry-section admin-collapsible"><summary><span>Plantillas iniciales</span><b className="admin-count">{MINISTRY_STARTERS.length}</b></summary><p>Opciones de partida para crear ministerios.</p><div className="admin-starter-list">{MINISTRY_STARTERS.map((starter)=><div key={starter.id}><span>{starter.name}</span><button className="admin-text-button" disabled={items.some((item)=>item.starterId===starter.id)} onClick={()=>importStarter(starter)}>{items.some((item)=>item.starterId===starter.id) ? "Ya incorporado" : "Incorporar y editar"}</button></div>)}</div></section>
  </main>;
}
