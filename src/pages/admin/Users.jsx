import React, { useState, useEffect } from "react";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import User from "./User";
const Users = ({ db, user, onTabClick }) => {
  const [data, setData] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [exito, setExito] = useState(0);
  const [intentos, setIntentos] = useState(0);
  const [total, setTotal] = useState(0);
  const getDatos = async () => {
    // console.log("buscando user data");
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    setUsuario(docSnap.data());
    // console.log("usuario", usuario);
    if (docSnap.data().admin) {
      //   console.log("es admin");
      setAdmin(true);
      const querySnapshot = await getDocs(collection(db, "users"));
      const allDocs = querySnapshot.docs.map((doc) => doc.data());
      setData(allDocs);
      //   console.log(allDocs);
      const count = Object.values(allDocs).reduce((acc, curr) => {
        if (curr.hasOwnProperty("resultado")) {
          acc += 1;
        }
        return acc;
      }, 0);
      setTotal(Object.keys(allDocs).length);
      setExito(count);
      setIntentos(Object.keys(allDocs).length - count);
    } else {
      //   console.log("no es admin");
      const querySnapshot = await getDocs(collection(db, "users"));
      const allDocs = querySnapshot.docs.map((doc) => doc.data());
      const filtered = allDocs.filter((item) => item.email === user.email);
      setData(filtered);
      //   console.log(filtered);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      getDatos();
    };
    fetchData();
  }, []);

  return (
    <section className="usuarios">
      {admin && (
        <h1>
          Total: {total} -- Exito: {exito}{" "}
        </h1>
      )}
      <div className="usuarios-resultado">
        {data &&
          data.map((item, index) => (
            <div key={index}>
              <User user={item} />
            </div>
          ))}
      </div>
      {!admin && (
        <button
          onClick={() => {
            onTabClick("test");
          }}
          className="boton"
        >
         Tomar Test
        </button>
      )}
    </section>
  );
};

export default Users;
