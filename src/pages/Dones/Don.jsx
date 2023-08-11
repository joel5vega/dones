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
  d3: pastor,
  d4: enseñanza,
  d5: conocimiento,
  d6: sabiduria,
  d7: profecia,
  d8: evangelismo,
  d9: misionero,
  d10: fe,
  d11: discernimiento,
  d12: exhortacion,
  d13: servicio,
  d14: misericordia,
  d15: dar,
  d16: hospitalidad
};
function Don(props) {
  const { id, name, score, definicion, texto } = props.data;
  return (
    <div className="don" key={id}>
      <div className="don-head">
        <img className="icon" src={iconObj[id]} alt={name} />
        <div className="don-title">
          <h3>{name}</h3>
          <h4>{texto}</h4>
        </div>
      </div>
      <div className="don-definition">
        <p>{definicion}</p>
      </div>
    </div>
  );
}

export default Don;
