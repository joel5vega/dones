import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export default function GoogleSignInButton({ onClick, label = "Iniciar sesión" }) {
  return (
    <button onClick={onClick} className="boton">
      <div className="boton-con-logo">
        <FontAwesomeIcon className="boton-icon" icon={faGoogle} />
        <div className="boton-descripcion">{label}</div>
      </div>
    </button>
  );
}
