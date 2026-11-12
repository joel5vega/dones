import { Link, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
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

function EvaluateFlow({ code }) {
  const { signInWithGoogle } = useAuth();
  const ev = usePeerEvaluation(code);
  const { status, invite, user, authLoading } = ev;

  if (status === "loading" || authLoading) return <Loader />;

  if (status === "notFound")
    return <Shell><div className="peer-card"><h2>Enlace no válido</h2>
      <p className="peer-muted">No encontramos esa invitación. Revisa el enlace o el código.</p>
      <Link to="/evaluar" className="btn-outline">Escribir otro código</Link></div></Shell>;

  if (status === "self")
    return <Shell><div className="peer-card"><h2>Esta es tu propia invitación</h2>
      <p className="peer-muted">Compártela con otra persona. Tus resultados los ves en la comparación.</p>
      <Link to="/evaluaciones" className="btn-outline">Ver evaluaciones</Link></div></Shell>;

  if (!user)
    return <Shell><div className="peer-card"><OwnerHeader invite={invite} />
      <p className="peer-muted">
        Responderás {invite.questionIds.length} preguntas cortas (≈ 2 min) sobre cómo ves a{" "}
        {firstName(invite.ownerName)}. Inicia sesión para guardar tu evaluación.
      </p>
      <GoogleSignInButton onClick={() => signInWithGoogle().catch(console.error)} />
    </div></Shell>;

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
