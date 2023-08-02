import React from "react";
import liderazgo from "../../assets/icons/liderazgo.png";
import administracion from "../../assets/icons/administracion.png";
import enseñanza from "../../assets/icons/enseñanza.png";
import conocimiento from "../../assets/icons/conocimiento.png";
import sabiduria from "../../assets/icons/sabiduria.png";
import profecia from "../../assets/icons/profecia.png";
import discernimiento from "../../assets/icons/discernimiento.png";
import exhortacion from "../../assets/icons/exhortacion.png";
import pastor from "../../assets/icons/pastor.png";
import fe from "../../assets/icons/fe.png";
import evangelismo from "../../assets/icons/evangelismo.png";
import misionero from "../../assets/icons/misionero.png";
import servicio from "../../assets/icons/servicio.png";
import misericordia from "../../assets/icons/misericordia.png";
import dar from "../../assets/icons/dar.png";
import hospitalidad from "../../assets/icons/hospitalidad.png";

const iconObj = {
  d1: liderazgo,
  d2: administracion,
  d3: enseñanza,
  d4: conocimiento,
  d5: sabiduria,
  d6: profecia,
  d7: discernimiento,
  d8: exhortacion,
  d9: pastor,
  d16: fe,
  d10: evangelismo,
  d11: misionero,
  d12: servicio,
  d13: misericordia,
  d14: dar,
  d15: hospitalidad
};
function Don(props) {
  const { id, name, score, definicion, texto } = props.data;
  return (
    <div className="don" key={id}>
      <div>
        <h3>{name}</h3>
        <img className="icon" src={iconObj[id]} alt={name} />
      </div>
      <div>
        <p>{definicion}</p>
        <h4>{texto}</h4>
      </div>
    </div>
  );
}

export default Don;
