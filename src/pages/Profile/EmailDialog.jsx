import { useMemo, useState } from "react";
import Dialog from "@mui/material/Dialog";
import { queueEmails } from "../../services/mailService";
import { buildResultsEmail } from "../../utils/emailTemplate";
import { summarizeUser } from "../../utils/userSummary";

/** Vista previa + confirmación de envío. `recipients`: perfiles ya validados (canEmail). */
export default function EmailDialog({ open, onClose, recipients }) {
  const [state, setState] = useState("idle"); // idle | sending | done | error

  const messages = useMemo(
    () =>
      recipients.map((u) => {
        const mail = buildResultsEmail({ name: u.name, top: summarizeUser(u).top });
        return { uid: u.uid, to: u.email, ...mail };
      }),
    [recipients]
  );

  const send = async () => {
    setState("sending");
    try {
      await queueEmails(messages);
      setState("done");
    } catch (e) {
      console.error(e);
      setState("error");
    }
  };

  const close = () => { setState("idle"); onClose(); };
  const sample = messages[0];

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="md">
      <div className="email-dialog">
        <h2>Enviar resultados actualizados</h2>
        {state === "done" ? (
          <p>✅ {messages.length} correos en cola. Se enviarán en unos minutos; el estado de cada uno aparece en la colección <code>mail</code>.</p>
        ) : (
          <>
            <p>Se enviará un correo personalizado a <strong>{messages.length}</strong> persona(s). Vista previa (para {recipients[0]?.name}):</p>
            {sample && <iframe title="Vista previa" sandbox="" srcDoc={sample.html} className="email-preview" />}
            {state === "error" && <p className="peer-error">No se pudo encolar. Revisa las reglas de Firestore y la sesión de administrador.</p>}
          </>
        )}
        <div className="email-actions">
          <button className="btn btn-secondary" onClick={close}>{state === "done" ? "Cerrar" : "Cancelar"}</button>
          {state !== "done" && (
            <button className="btn btn-primary" onClick={send} disabled={state === "sending" || !messages.length}>
              {state === "sending" ? "Enviando…" : `Enviar a ${messages.length}`}
            </button>
          )}
        </div>
      </div>
    </Dialog>
  );
}
