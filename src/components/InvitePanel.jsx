import { useState } from "react";
import { WhatsappShareButton, WhatsappIcon } from "react-share";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";
import { firstName } from "../utils/peer";
import "./peer.css";

// https://joel5vega.github.io/dones/#/evaluar/CODIGO
export const inviteUrl = (code) =>
  `${window.location.origin}${import.meta.env.BASE_URL}#/evaluar/${code}`;

export default function InvitePanel({ invite, busy, onCreate, canCreate }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(inviteUrl(invite.code));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (!invite) {
    return (
      <div className="peer-card">
        <h2>Pide que alguien más te evalúe</h2>
        <p className="peer-muted">
          Genera un enlace  para que una persona que te conoce responda sobre ti y compara su
          visión con tus resultados.
        </p>
        <button className="btn-finish" onClick={onCreate} disabled={busy || !canCreate}>
          Crear enlace de evaluación
        </button>
        {!canCreate && <p className="peer-muted">Primero completa el test.</p>}
      </div>
    );
  }

  return (
    <div className="peer-card">
      <h2>Tu enlace de evaluación</h2>
      <p className="peer-muted">
        Compártelo con alguien que te conozca bien. Tendra que responder{" "}
        {invite.questionIds?.length} preguntas.
      </p>
      <div className="invite-box">
        <code>{inviteUrl(invite.code)}</code>
      </div>
      <p className="peer-muted">
        Código: <strong className="invite-code">{invite.code}</strong>
      </p>
      <div className="peer-actions">
        <button className="btn-outline" onClick={copy}>
          <FontAwesomeIcon icon={copied ? faCheck : faCopy} /> {copied ? "Copiado" : "Copiar enlace"}
        </button>
        <WhatsappShareButton
          url={inviteUrl(invite.code)}
          title={`${firstName(invite.ownerName)} te pide que lo/la ayudes a descubrir sus dones espirituales:`}
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
     
      </div>
    </div>
  );
}
