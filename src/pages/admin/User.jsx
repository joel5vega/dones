import React from "react";
import SpiderChart from "../Prueba/SpiderChart";
function User({ user }) {
  return (
    <div>
      {user.resultado  ? (
        <div className="perfil-usuario">
          <img src={user.photo} alt="user" className="user-pic" />
          <SpiderChart
            className="spider"
            title={user.name}
            data={user.resultado}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default User;
