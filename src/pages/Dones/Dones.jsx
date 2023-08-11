import React from "react";
import CategoriaData from "../../data/CategoriasData";
import Don from "./Don";
function Dones() {
  return (
    <div className="resultados">
      <div className="dones">
        {CategoriaData.map((don, index) => (
          <Don key={index} data={don} />
        ))}
      </div>
    </div>
  );
}

export default Dones;
