import React from "react";
import CategoriaData from "../../data/CategoriasData";
import Don from "./Don";
function Dones({user,onTabClick,handleGoogleSignIn}) {
  return (
    <section className="resultados">
      <div className="dones">
        {CategoriaData.map((don, index) => (
          <Don key={index} data={don} />
        ))}
      </div>
      <button
          onClick={() => {
            if (!user) {
              console.log("aun no ingresa")
              handleGoogleSignIn();
            }
            onTabClick("test");
          }}
          className="boton"
        >
          Tomar Test
        </button>
      {/* <button onClick={() => onTabClick("test")} className="boton">Tomar Test</button> */}
    </section>
  );
}

export default Dones;
