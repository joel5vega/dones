import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Button from "@mui/material/Button";
const GoogleSignInButton = ({ onClick }) => {
  return (
    <button variant="contained" onClick={onClick} className="boton">
      <div className="boton-con-logo">
        <FontAwesomeIcon className="boton-icon" icon={faGoogle} />
        <div className="boton-descripcion">Iniciar sesión</div>
      </div>
    </button>
  );
};

export default GoogleSignInButton;
