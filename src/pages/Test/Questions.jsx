import { useMemo, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faMugHot, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { scaleFor } from "../../utils/scale";
import "./questions.css";

export default function Questions({ answers, onChange, onFinish }) {
  const [step, setStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [milestone, setMilestone] = useState(null);

  const total = answers.length;
  const question = answers[step];
  const isLast = step === total - 1;
  const selected = question ? question.respuesta : 0;

  const scale = useMemo(() => scaleFor(question?.tipo ?? "habilidad"), [question?.tipo]);
  
  const answeredCount = answers.filter((a) => a.respuesta > 0).length;
  const progress = Math.round((answeredCount / total) * 100);

  const selectAnswer = (value) => {
    if (!question || isTransitioning) return;
    
    onChange(question.id, value);

    if (isLast) return;

    setIsTransitioning(true);
    window.setTimeout(() => {
      const completed = step + 1;
      
      // ✨ AQUI CAMBIAMOS LA LÓGICA DEL DESCANSO: Cada 18 preguntas
      if (completed === 18) {
        // Calculamos el porcentaje basado en las respuestas dadas (18 de total)
        const currentProgress = Math.round((18 / total) * 100);
        setMilestone({ completed, percentage: currentProgress });
        setIsTransitioning(false);
        return;
      }
      
      setStep((current) => current + 1);
      setIsTransitioning(false);
    }, 350);
  };

  const goBack = () => {
    if (step === 0 || isTransitioning) return;
    setStep((current) => current - 1);
  };

  useEffect(() => {
    const handleKey = (event) => {
      if (milestone || isTransitioning) return;
      const number = Number(event.key);
      if (number >= 1 && number <= scale.length) selectAnswer(number);
      if (event.key === "ArrowLeft") goBack();
      if (event.key === "Enter" && selected && isLast) onFinish();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  if (!question) return null;

  return (
    <div className="quiz-page-wrapper">
      <div className="progress-bar-top">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      {milestone ? (
        // ✨ PANTALLA DE DESCANSO REDISEÑADA
        <div className="milestone-screen">
          <div className="milestone-icon-wrapper">
            <FontAwesomeIcon icon={faMugHot} className="milestone-icon" />
          </div>
          
          <h2>Buen trabajo!</h2>
          <p className="milestone-subtitle">
            Has completado <strong>{milestone.completed} preguntas</strong>. 
            Ya llevas el <strong>{milestone.percentage}%</strong> del test.
          </p>

          <div className="milestone-progress-ring">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="ring-bg" />
              <circle 
                cx="50" cy="50" r="45" 
                className="ring-fill" 
                strokeDasharray={`${milestone.percentage * 2.83} 283`} 
              />
            </svg>
            <span>{milestone.percentage}%</span>
          </div>

          <p className="milestone-message">
            No nos cansemos de hacer el bien, porque a su debido tiempo cosecharemos si no nos damos por vencidos.
          </p>
          <p className="milestone-quote">
            <em>Gálatas 6:9</em>
          </p>

          <button 
            onClick={() => { setMilestone(null); setStep(s => s + 1); }} 
            className="btn-continue"
          >
            Continuar con el test <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      ) : (
        <div className="quiz-container">
          <div className="quiz-header">
            {/* <span className="quiz-step">Pregunta {step + 1} de {total}</span> */}
            <h1 className="quiz-question">{question.pregunta}</h1>
            <p className="quiz-hint">Elige la respuesta más honesta y continúa a tu ritmo.</p>
          </div>

          <div className="quiz-options-list" role="radiogroup">
            {scale.map((option) => {
              const active = selected === option.value;
              return (
                <button
                  key={option.value}
                  className={`quiz-option-card ${active ? "selected" : ""}`}
                  onClick={() => selectAnswer(option.value)}
                  role="radio"
                  aria-checked={active}
                  disabled={isTransitioning}
                >
                  <span className="option-number">{option.value}</span>
                  <span className="option-content">
                    {/* ✨ AQUI QUITAMOS LA REDUNDANCIA: Solo mostramos la frase larga */}
                    <strong>{option.phrase}</strong>
                  </span>
                  <span className="option-radio">
                    <span className="radio-inner" />
                  </span>
                </button>
              );
            })}
          </div>

          <footer className="quiz-footer">
            <button className="back-btn" onClick={goBack} disabled={step === 0}>
              <FontAwesomeIcon icon={faChevronLeft} /> Anterior
            </button>
            
            <div className="quiz-footer-hint">
              {isLast ? (
                <button 
                  className="btn-finish" 
                  onClick={onFinish} 
                  disabled={!selected}
                >
                  Ver resultados <FontAwesomeIcon icon={faCheckCircle} />
                </button>
              ) : (
                <span className="auto-hint">Avance automático</span>
              )}
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}