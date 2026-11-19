import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import CodeEntry from "../../components/CodeEntry";
import GiftPicker from "../../components/GiftPicker";
import Questions from "../Test/Questions";
import SuccessAnimation from "../../components/SuccessAnimation";
import { usePeerEvaluation } from "../../hooks/usePeerEvaluation";
import { firstName, normalizeCode } from "../../utils/peer";
import { useAuth } from "../../contexts/AuthContext";
import "../../components/peer.css";

export default function Evaluate() {
  const { code } = useParams();
  if (!code || code === "undefined") {
    return (
      <main className="peer-page">
        <div className="peer-card">
          <h2>Enlace incompleto</h2>
          <p className="peer-muted">Falta el código de evaluación en la URL.</p>
          <Link to="/evaluar" className="btn-outline">Escribir código manualmente</Link>
        </div>
      </main>
    );
  }
  return <EvaluateFlow code={normalizeCode(code)} />;
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

function externalBrowserUrl(url) {
  return `https://www.google.com/url?q=${encodeURIComponent(url)}`;
}

function EvaluateFlow({ code }) {
  const { signInWithGoogle } = useAuth();
  const ev = usePeerEvaluation(code);
  const { status, invite, user, authLoading } = ev;

  const [skippedHalfway, setSkippedHalfway] = useState(false);

  // ✨ Subir scroll cuando haya éxito o cuando pase a la pantalla final
  useEffect(() => {
    if (status === "done" || ev.step === "pick") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [status, ev.step]);

  if (status === "loading" || authLoading) return <Loader />;

  if (status === "notFound")
    return (
      <Shell>
        <div className="peer-card">
          <h2>Enlace no válido</h2>
          <p className="peer-muted">No encontramos esa invitación. Revisa el enlace o el código.</p>
          <Link to="/evaluar" className="btn-outline">Escribir otro código</Link>
        </div>
      </Shell>
    );

  if (status === "self")
    return (
      <Shell>
        <div className="peer-card">
          <h2>Esta es tu propia invitación</h2>
          <p className="peer-muted">Compártela con otra persona. Tus resultados los ves en la comparación.</p>
          <Link to="/evaluaciones" className="btn-outline">Ver evaluaciones</Link>
        </div>
      </Shell>
    );

  // ✨ PANTALLA DE ÉXITO
  if (status === "done") {
    return (
      <Shell>
        <div className="peer-card" style={{ textAlign: "center", padding: "40px 20px" }}>
          <SuccessAnimation />
          <h2 style={{ color: "var(--resaltar)", marginTop: 20 }}>¡Evaluación enviada!</h2>
          <p className="peer-muted" style={{ fontSize: "16px", marginBottom: "24px" }}>
            Gracias por tomarte el tiempo de evaluar a {firstName(invite.ownerName)}.
            <br />Tu opinión es muy valiosa y ya le ha llegado.
          </p>
          <Link to="/" className="btn-primary" style={{ display: "inline-block", marginTop: 16 }}>
            Volver al inicio
          </Link>
        </div>
      </Shell>
    );
  }

  const answeredCount = ev.answers.filter(a => a.respuesta > 0).length;
  const half = Math.floor(ev.answers.length / 2) || 5; 
  
  const showHalfwayWall = !user && answeredCount >= half && !skippedHalfway && ev.step !== "pick";

  if (showHalfwayWall) {
    return (
      <Shell>
        <div className="peer-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚀</div>
          <h2>¡Vas por la mitad!</h2>
          <p className="peer-muted" style={{ fontSize: "16px", marginBottom: "24px" }}>
            Inicia sesión ahora para no perder tu progreso y que {firstName(invite.ownerName)} pueda ver tu evaluación.
          </p>
          
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <GoogleSignInButton onClick={() => signInWithGoogle().catch(console.error)} />
            <a
              href={externalBrowserUrl(window.location.href)}
              target="_blank"
              rel="noopener noreferrer"
              className="peer-muted"
              style={{ fontSize: "13px", textDecoration: "underline" }}
            >
              ¿Problemas para iniciar sesión? Abrir en navegador
            </a>
            <button 
              onClick={() => setSkippedHalfway(true)}
              style={{ background: "none", border: "none", color: "var(--primario)", fontSize: "12px", cursor: "pointer", opacity: 0.6, marginTop: 8 }}
            >
              Continuar sin guardar (no recomendado)
            </button>
          </div>
        </div>
      </Shell>
    );
  }

  // PANTALLA FINAL (Soft Wall)
  if (ev.step === "pick") {
    if (!user) {
      return (
        <Shell>
          <div className="peer-card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
            <h2>¡Has terminado las preguntas!</h2>
            <p className="peer-muted" style={{ fontSize: "16px", marginBottom: "24px" }}>
              Solo falta un paso para enviarle tu evaluación a {firstName(invite.ownerName)}.
              <br /><br />
              <em>Inicia sesión para guardar tus respuestas de forma segura.</em>
            </p>
            
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <GoogleSignInButton onClick={() => signInWithGoogle().catch(console.error)} />
              <a
                href={externalBrowserUrl(window.location.href)}
                target="_blank"
                rel="noopener noreferrer"
                className="peer-muted"
                style={{ fontSize: "13px", textDecoration: "underline" }}
              >
                ¿Problemas para iniciar sesión? Abrir en navegador
              </a>
            </div>
          </div>
        </Shell>
      );
    }
    
    return (
      <Shell>
        <GiftPicker
          ownerName={firstName(invite.ownerName)}
          questionsTotal={ev.answers.length}
          error={ev.error}
          onBack={() => ev.setStep("questions")}
          onSubmit={ev.submit}
        />
      </Shell>
    );
  }

  const firstPending = ev.answers.findIndex(a => a.respuesta === 0);
  const initialStep = firstPending !== -1 ? firstPending : 0;

  return (
    <>
      {ev.previous && (
        <p className="peer-muted" style={{ textAlign: "center", paddingTop: 20 }}>
          Ya evaluaste a {firstName(invite.ownerName)}. Si envías de nuevo, se reemplazará tu respuesta.
        </p>
      )}
      
      <Questions
        key={user ? "logged" : "guest"}
        answers={ev.answers}
        onChange={ev.setAnswer}
        onFinish={() => ev.setStep("pick")}
        perspective="peer"
        textFor={ev.textFor}
        milestoneAt={null}
        extraSteps={1}
        finishLabel="Continuar"
        initialStep={initialStep}
      />
    </>
  );
}