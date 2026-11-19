import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTest } from "../../hooks/useTest";
import Loader from "../../components/Loader/Loader";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import Questions from "./Questions";
import Results from "./Results";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud, faChartLine, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import "./test.css";

export default function Test() {
  const { user, signInWithGoogle } = useAuth();
  const { answers, setAnswer, reset, finish, result, ready } = useTest();
  const [started, setStarted] = useState(false);
  const [resumeAt, setResumeAt] = useState(0);

  // ✨ Subir scroll cuando haya resultados
  useEffect(() => {
    if (result) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [result]);

  if (!ready) return <Loader />;

  if (result) {
    return (
      <Results
        ranking={result.ranking}
        resultado={result.resultado}
        userName={user?.displayName?.split(" ")[0]}
        userPhoto={user?.photoURL}
        onRestart={() => window.location.reload()}
      />
    );
  }

  if (!user) {
    const login = async () => {
      try {
        await signInWithGoogle();
      } catch (e) {
        console.error("Login failed:", e);
      }
    };

    return (
      <div className="auth-welcome-wrapper">
        <div className="auth-card">
          <div className="auth-icon-header">
            <FontAwesomeIcon icon={faCloud} />
          </div>
          <h1 className="auth-title">Antes de comenzar...</h1>
          <p className="auth-description">
            El test tiene <strong>48 preguntas</strong> y toma unos <strong>8-10 minutos</strong>. 
            Para que no pierdas tu progreso si cierras la página o te quedas sin batería, 
            te recomendamos crear una cuenta.
          </p>

          <div className="auth-benefits">
            <div className="benefit-item">
              <FontAwesomeIcon icon={faShieldHalved} className="benefit-icon" />
              <span>Guarda tus respuestas automáticamente.</span>
            </div>
            <div className="benefit-item">
              <FontAwesomeIcon icon={faChartLine} className="benefit-icon" />
              <span>Consulta tus resultados en cualquier momento desde tu perfil.</span>
            </div>
          </div>

          <div className="auth-actions">
            <GoogleSignInButton onClick={login} className="btn-google-large" />
            
            <p className="auth-skip">
              <button onClick={login} className="link-btn">
                Entra con Google, es rápido y gratis
              </button>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const answered = answers.filter((a) => a.respuesta > 0).length;
  const firstPending = answers.findIndex((a) => a.respuesta === 0);
  if (!started && answered > 0 && firstPending !== -1) {
    return (
      <div className="auth-welcome-wrapper">
        <div className="auth-card">
          <h1 className="auth-title">Tienes un test en progreso</h1>
          <p className="auth-description">
            Llevas <strong>{answered} de {answers.length}</strong> preguntas respondidas.
            Puedes continuar desde la pregunta <strong>{firstPending + 1}</strong>.
          </p>
          <div className="auth-actions">
            <button
              className="btn-continue"
              onClick={() => { setResumeAt(firstPending); setStarted(true); }}
            >
              Continuar desde la pregunta {firstPending + 1}
            </button>
            <p className="auth-skip">
              <button className="link-btn" onClick={() => { reset(); setResumeAt(0); setStarted(true); }}>
                Empezar de nuevo
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Questions
      answers={answers}
      onChange={setAnswer}
      onFinish={finish}
      initialStep={resumeAt}
    />
  );
}