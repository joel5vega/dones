import { useEffect } from "react";
import ResultCard from "../../pages/Profile/ResultCard";

/** Ventana con la tarjeta completa de una persona (se renderiza solo una a la vez). */
export default function UserDetail({ profile, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  if (!profile) return null;
  return (
    <div className="adm-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="adm-modal-body" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="adm-close" onClick={onClose} aria-label="Cerrar">✕</button>
        {profile.resultado ? <ResultCard profile={profile} isAdmin /> : <p className="adm-muted">{profile.name} aún no completó el test.</p>}
        {profile.email && <p className="adm-muted">{profile.email}</p>}
      </div>
    </div>
  );
}
