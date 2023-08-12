import React from "react";
import CategoriaData from "../../data/CategoriasData";
import Don from "./Don";
function Dones({onTabClick}) {
  return (
    <section className="resultados">
      <div className="dones">
        {CategoriaData.map((don, index) => (
          <Don key={index} data={don} />
        ))}
      </div>
      <button onClick={() => onTabClick("test")} className="boton">Tomar Test</button>
    </section>
  );
}

export default Dones;
