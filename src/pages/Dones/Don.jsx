import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faBookOpen, faTimes } from "@fortawesome/free-solid-svg-icons";
import iconos from "../../data/iconos";
import referencias from "../../data/referencias";

function Don({ data }) {
  const { id, name, definicion, texto } = data;
  const [isOpen, setIsOpen] = useState(false);
  const [showVerse, setShowVerse] = useState(false);

  // Búsqueda exacta de la referencia
  const fullReference = referencias.find((ref) => 
    ref.title.toLowerCase() === texto.toLowerCase()
  );

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (isOpen) setShowVerse(false);
  };

  return (
    <div className={`don-card ${isOpen ? "is-open" : ""}`}>
      {/* CABECERA */}
      <div className="don-header-clickable" onClick={toggleOpen}>
        <div className="don-icon-wrapper">
          <img className="don-icon" src={iconos[id]} alt={name} />
        </div>
        
        <h3 className="don-title-text">{name}</h3>
        
        <div className="don-toggle-icon">
          <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
        </div>
      </div>

      {/* CONTENIDO */}
      {isOpen && (
        <div className="don-content">
          <p className="don-definition">{definicion}</p>
          
          <div className="don-actions">
            {fullReference ? (
              <button 
                className={`btn-verse ${showVerse ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowVerse(!showVerse);
                }}
              >
                <FontAwesomeIcon icon={showVerse ? faTimes : faBookOpen} />
                {showVerse ? "Ocultar versículo" : "Leer versículo"}
              </button>
            ) : (
              <span style={{ fontSize: "12px", color: "var(--informacion)" }}>
                Cita bíblica
              </span>
            )}
            
            <span className="don-ref-tag">{texto}</span>
          </div>

          {showVerse && fullReference && (
            <div className="verse-box">
              <p className="verse-text">
                "{fullReference.content}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Don;