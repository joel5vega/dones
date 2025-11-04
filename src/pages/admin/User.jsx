import React from "react";
import SpiderChart from "../Prueba/SpiderChart";
import { doc, setDoc } from "firebase/firestore";
import db from "./services/Firebase";
function User({ user }) {
  useEffect(() => {
    // save user.resultado into the same user document in Firestore
    if (!user || !user.uid || !user.resultado) return;

    const saveResultado = async () => {
      try {
        const ref = doc(db, "users", user.uid);
        // merge:true so other fields on the user doc are preserved
        await setDoc(ref, { resultado: user.resultado }, { merge: true });
      } catch (err) {
        console.error("Failed to save resultado:", err);
      }
    };

    saveResultado();
  }, [user?.resultado, user?.uid]);
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
