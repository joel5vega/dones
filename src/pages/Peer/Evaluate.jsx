import { Link, useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import CodeEntry from "../../components/CodeEntry";
import GiftPicker from "../../components/GiftPicker";
import Questions from "../Test/Questions";
import { usePeerEvaluation } from "../../hooks/usePeerEvaluation";
import { firstName, normalizeCode } from "../../utils/peer";
import { useAuth } from "../../contexts/AuthContext";
import "../../components/peer.css";

/** /evaluar → pide el código · /evaluar/:code → flujo del evaluador */
export default function Evaluate() {
  const { code } = useParams();
  return code ? <EvaluateFlow code={normalizeCode(code)} /> : <EnterCode />;
}

function EnterCode() {
  return (
    <main className="peer-page">
      <div className="peer-card"><CodeEntry title="Evaluar a alguien" /></div>
    </main>
  );
}

function Shell({ children }) {
  return <main className="peer-page">{children}</main>;
}

function OwnerHeader({ invite }) {
  return (
    <div className="peer-owner">
      {invite.ownerPhoto && <img src={invite.ownerPhoto} alt="" referrerPolicy="no-referrer" />}
      <h2>{firstName(invite.ownerName)} te pidió una evaluación</h2>
    </div>
  );
}

/**
 * Detecta si estamos dentro de un iframe o WebView in-app
 * (Facebook, Instagram, Messenger, etc.), donde Firebase Auth
 * falla por storage particionado.
 */
function useInAppOrIframe() {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
  const isInApp = /FBAN|FBAV|Instagram|Messenger|Line|WhatsApp|Twitter/i.test(ua);
  const isIframe = typeof window !== "undefined" && window.self !== window.top;
  return isInApp || isIframe;
}

function EvaluateFlow({ code }) {
  const { signInWithGoogle } = useAuth();
  const ev = usePeerEvaluation(code);
  const { status, invite, user, authLoading } = ev;
  const inAppOrIframe = useInAppOrIframe();

  if (status === "loading" || authLoading) return <Loader />;

  if (status === "notFound")
    return <Shell><div className="peer-card"><h2>Enlace no válido</h2>
      <p className="peer-muted">No encontramos esa invitación. Revisa el enlace o el código.</p>
      <Link to="/evaluar" className="btn-outline">Escribir otro código</Link></div></Shell>;

  if (status === "self")
    return <Shell><div className="peer-card"><h2>Esta es tu propia invitación</h2>
      <p className="peer-muted">Compártela con otra persona. Tus resultados los ves en la comparación.</p>
      <Link to="/evaluaciones" className="btn-outline">Ver evaluaciones</Link></div></Shell>;

  if (!user) {
    // Si venimos de un iframe / WebView (Facebook, etc.),
    // el login con Google aquí va a fallar por storage particionado.
    if (inAppOrIframe) {
      const returnTo = `/evaluar/${code}`;
      const currentUrl = typeof window !== "undefined" ? window.location.href : "";
      const externalUrl = `https://www.google.com/url?q=${encodeURIComponent(currentUrl)}`;

      const handleGoLogin = () => {
        try { sessionStorage.setItem("returnTo", returnTo); } catch {}
      };

      return (
        <Shell>
          <div className="peer-card">
            <OwnerHeader invite={invite} />
            <p className="peer-muted">
              Responderás {invite.questionIds.length} preguntas cortas (≈ 2 min) sobre cómo ves a{" "}
              {firstName(invite.ownerName)}.
            </p>
            <p className="peer-muted">
              Para iniciar sesión con Google, abre este enlace en tu navegador habitual
              (Chrome, Safari, etc.). El navegador integrado de Facebook bloquea el login.
            </p>

            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              onClick={handleGoLogin}
            >
              Abrir en navegador
            </a>

            <p className="peer-muted" style={{ marginTop: 12, fontSize: 13 }}>
              ¿Ya lo abriste en tu navegador? Puedes intentar iniciar sesión aquí de todos modos:
            </p>
            <button
              type="button"
              onClick={() => signInWithGoogle().catch(console.error)}
              className="link-btn"
            >
              Iniciar sesión aquí
            </button>
          </div>
        </Shell>
      );
    }

    // Navegador normal: login con Google en el sitio, como antes
    return (
      <Shell>
        <div className="peer-card">
          <OwnerHeader invite={invite} />
          <p className="peer-muted">
            Responderás {invite.questionIds.length} preguntas cortas (≈ 2 min) sobre cómo ves a{" "}
            {firstName(invite.ownerName)}. Inicia sesión para guardar tu evaluación.
          </p>
          <GoogleSignInButton onClick={() => signInWithGoogle().catch(console.error)} />
        </div>
      </Shell>
    );
  }

  if (status === "done")
    return <Shell><div className="peer-card"><h2>¡Gracias!</h2>
      <p className="peer-muted">{firstName(invite.ownerName)} podrá ver tu evaluación.</p>
      <Link to="/test" className="btn-outline">Descubre tus propios dones</Link></div></Shell>;

  if (ev.step === "pick")
    return <Shell><GiftPicker ownerName={firstName(invite.ownerName)} questionsTotal={ev.answers.length} error={ev.error}
      onBack={() => ev.setStep("questions")} onSubmit={ev.submit} /></Shell>;

  return (
    <>
      {ev.previous && (
        <p className="peer-muted" style={{ textAlign: "center", paddingTop: 80 }}>
          Ya evaluaste a {firstName(invite.ownerName)}. Si envías de nuevo, se reemplazará tu respuesta.
        </p>
      )}
      <Questions
        answers={ev.answers}
        onChange={ev.setAnswer}
        onFinish={() => ev.setStep("pick")}
        perspective="peer"
        textFor={ev.textFor}
        milestoneAt={null}
        extraSteps={1}
        finishLabel="Continuar"
      />
    </>
  );
}