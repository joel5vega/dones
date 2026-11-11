import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; 
import Popover from "../../components/Popover";
import referencias from "../../data/referencias";
import logo from "../../assets/pictures/dones-espirituales.svg";
import portada from "../../assets/pictures/praying-and-bible.webp";
import "./home.css"; // Asegúrate de crear este archivo

function Acciones() {
  const { user } = useAuth();

  return (
    <div className="home-actions">
      <Link to="/test" className="btn btn-primary">
        {user ? "Repetir Test" : "Hacer el Test"}
      </Link>
      <Link to="/dones" className="btn btn-secondary">Ver Dones</Link>
      
      {/* ✨ BOTÓN CONDICIONAL PARA EL PERFIL */}
      {user && (
        <Link to="/perfil" className="btn btn-secondary" style={{ borderColor: "var(--resaltar)", color: "var(--resaltar)" }}>
          Mi Perfil
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <main className="home-page">
      {/* SECCIÓN HERO */}
      <section className="home-hero">
        <div className="hero-content">
          <img src={logo} alt="Dones Espirituales" className="hero-logo" />
          <h1 className="hero-title">Descubre tus Dones Espirituales</h1>
          <p className="hero-subtitle">
            "Pero a cada uno se le da la manifestación del Espíritu para el bien común."
            <br />
            <span className="hero-cita">1 Corintios 12:7 (LBLA)</span>
          </p>
          <Acciones />
        </div>
        <div className="hero-image-wrapper">
          <img src={portada} alt="Orando con la Biblia" className="hero-image" />
        </div>
      </section>

      {/* TARJETA DE INFORMACIÓN */}
      <section className="home-info-card">
        <div className="info-text">
          <p>
            Un don espiritual es una manifestación soberana del Espíritu Santo en la vida del
            creyente que lo capacita para poder servir a Dios y a su prójimo.
          </p>
          <p>
            📝 Adapté este{" "}
            <a
              href="https://www.accounseling.org/wp-content/uploads/2018/04/Spiritual_Gifts_Survey-_spanish.pdf"
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              test original
            </a>{" "}
            para simplificar el proceso y hacerlo más accesible.
          </p>
        </div>

        <div className="info-divider"></div>

        <div className="info-references">
          <h3 className="references-title">Pasajes bíblicos</h3>
          <div className="references-stack">
            {referencias.map((r) => (
              <Popover key={r.title} {...r} />
            ))}
          </div>
        </div>

        <div className="info-footer">
          <p>🤓 Recuerda que los resultados son simplemente una guía, pero espero pueda serte de mucha ayuda en tu caminar cristiano.</p>
          <p>😇 ¡Que Dios te bendiga!</p>
        </div>
      </section>
    </main>
  );
}