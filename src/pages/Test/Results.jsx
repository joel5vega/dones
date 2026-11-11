import { Link } from "react-router-dom";
import { WhatsappShareButton, WhatsappIcon } from "react-share";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
import iconos from "../../data/iconos";
import ExportableResultCard from "../../components/ExportableResultCard";
import "./results.css";

const SITE_URL = "https://joel5vega.github.io/dones";

export default function Results({ ranking, userName, userPhoto, onRestart }) {
  const top = ranking[0];

  return (
    <div className="results-view">
      <section className="results-hero">
        <div className="results-intro">
          <h1>{userName ? `${userName}, hay una forma única en la que aportas.` : "Hay una forma única en la que aportas."}</h1>
          <p className="results-subtitle">
            Tus respuestas muestran los dones con mayor fuerza. No son etiquetas: son
            una guía para reconocer dónde puedes servir mejor.
          </p>
          {top && (
            <div className="primary-gift">
              <span className="gift-rank">01</span>
              <span className="gift-icon">
                <img src={iconos[top.id]} alt="" aria-hidden="true" />
              </span>
              <span>
                <small>Tu don más fuerte</small>
                <br/>
                <strong>{top.name}</strong>
              </span>
              <b>{top.score}%</b>
            </div>
          )}
        </div>

        {/* REUTILIZAMOS LA TARJETA EXPORTABLE */}
        <ExportableResultCard 
          ranking={ranking}
          userName={userName}
          userPhoto={userPhoto}
          topIcon={top ? iconos[top.id] : null}
        />
      </section>

      <section className="gift-section">
        <div className="section-heading">
          <div>
            <h2 className="eyebrow">Tus 3 dones principales</h2>
          </div>
        </div>
        <div className="gift-grid">
          {ranking.slice(0, 3).map((gift, index) => (
            <div className="gift-card" key={gift.id}>
              <span className="gift-card-top">
                <span className="gift-card-icon">
                  <img src={iconos[gift.id]} alt="" aria-hidden="true" />
                </span>
                <span className="gift-number">0{index + 1}</span>
              </span>
              <span className="gift-card-copy">
                <small>{index === 0 ? "Tu don principal" : `Don ${index + 1}`}</small>
                <strong>{gift.name}</strong>
                <em>{gift.texto}</em>
                <span className="gift-description">{gift.definicion}</span>
              </span>
              <span className="gift-score">
                <span><i style={{ width: `${gift.score}%` }} /></span>
                <b>{gift.score}%</b>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="results-action">
        <div>
          <p className="eyebrow">El siguiente paso</p>
          <h2>Observa dónde estos dones ya están dando fruto.</h2>
          <p>
            Conversa sobre el resultado con alguien que te conozca bien y busca una oportunidad
            concreta para poner uno de estos dones al servicio de otros.
          </p>
        </div>
        <div className="stack">
          <button className="restart-button" onClick={onRestart}>
            Volver a realizar el test
            <FontAwesomeIcon icon={faArrowRotateRight} />
          </button>
          <Link to="/dones" className="btn-outline">Ver Dones</Link>
          <WhatsappShareButton url={SITE_URL} title="Mira esta app para conocer tus dones espirituales!">
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </div>
      </section>
    </div>
  );
}