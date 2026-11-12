import React from "react";
import "./loader.css";
// Importamos el SVG desde la carpeta de assets
import logoDones from "../../assets/pictures/dones-espirituales.svg"; 

function Loader() {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="fire-glow"></div>
        
        {/* Usamos la variable importada */}
        <img 
          src={logoDones} 
          alt="Cargando..." 
          className="loader-logo" 
        />
        
        <div className="loading-ring"></div>
      </div>
      <p className="loader-text">Cargando...</p>
    </div>
  );
}

export default Loader;