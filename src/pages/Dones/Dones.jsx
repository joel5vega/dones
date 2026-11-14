import { Link } from "react-router-dom";
import categorias from "../../data/categorias";
import Don from "./Don";
import "./dones.css";

export default function Dones() {
    return (
    <main className="dones-page">
      <header className="dones-header">
        <h1>Dones Espirituales</h1>
        <p>
          Dios nos ha dado dones específicos para edificar a la iglesia y servir al prójimo. 
         
        </p>
      </header>

       <section className="dones-list" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {categorias.map((don) => (
          <Don key={don.id} data={don} />
        ))}
      </section>
      <footer className="dones-footer">
        <p>¿Aún no sabes cuáles son tus dones?</p>
        <Link to="/test" className="btn btn-primary">
          Hacer el Test
        </Link>
      </footer>
    </main>
  );
}