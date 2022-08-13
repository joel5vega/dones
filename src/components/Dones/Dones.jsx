import React from "react";
import CategoriaData from "../../data/CategoriasData";
import Don from "./Don";
import NavBar from "../NavBar";
function Dones() {
  return (
    <div className="resultados">
      <NavBar title="Lista de Dones" result={true} />
      {/* <h1>Listado de dones</h1> */}
      <div className="dones">
        {CategoriaData.map((don, index) => (
          <Don key={index} data={don} />
        ))}
      </div>
    </div>
  );
}

export default Dones;
