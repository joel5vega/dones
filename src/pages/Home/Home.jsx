<<<<<<< HEAD
import React from "react";
import Popover from "../../components/Popover";
import DonesEspirituales from "../../assets/pictures/dones-espirituales.svg";
import PrayBible from "../../assets/pictures/praying-and-bible.webp";
const Referencias = [
  {
    title: "Romanos 12:6-8",
    content:
      "Dios, en su gracia, nos ha dado dones diferentes para hacer bien determinadas cosas. \n Por lo tanto, si Dios te dio la capacidad de profetizar, habla con toda la fe que Dios te haya concedido. Si tu don es servir a otros, sírvelos bien. Si eres maestro, enseña bien. Si tu don consiste en animar a otros, anímalos. Si tu don es dar, hazlo con generosidad. Si Dios te ha dado la capacidad de liderar, toma la responsabilidad en serio. Y si tienes el don de mostrar bondad a otros, hazlo con gusto. Romanos 12:6-8 (NTV)"
  },
  {
    title: "1 Corintios 12:8-10",
    content:
      "A uno el Espíritu le da la capacidad de dar consejos sabios; a otro el mismo Espíritu le da un mensaje de conocimiento especial. A otro el mismo Espíritu le da gran fe y a alguien más ese único Espíritu le da el don de sanidad. A uno le da el poder para hacer milagros y a otro, la capacidad de profetizar. A alguien más le da la capacidad de discernir si un mensaje es del Espíritu de Dios o de otro espíritu. Todavía a otro se le da la capacidad de hablar en idiomas desconocidos,mientras que a otro se le da la capacidad de interpretar lo que se está diciendo. Primera Carta a los Corintios 12:8-10 (NTV)"
  },
  {
    title: "1 Corintios 12:28-30",
    content:
      "A continuación hay algunas de las partes que Dios ha designado para la iglesia: en primer lugar, los apóstoles; en segundo lugar, los profetas; en tercer lugar, los maestros; luego los que hacen milagros, los que tienen el don de sanidad, los que pueden ayudar a otros, los que tienen el don de liderazgo, los que hablan en idiomas desconocidos. ¿Acaso somos todos apóstoles? ¿Somos todos profetas? ¿Somos todos maestros? ¿Tenemos todos el poder de hacer milagros? ¿Tenemos todos el don de sanidad? ¿Tenemos todos la capacidad de hablar en idiomas desconocidos? ¿Tenemos todos la capacidad de interpretar idiomas desconocidos? ¡Por supuesto que no! Primera Carta a los  Corintios 12:28-30"
  },
  ,
  {
    title: "Efesios 4:11-13",
    content:
      "Ahora bien, Cristo dio los siguientes dones a la iglesia: los apóstoles, los profetas, los evangelistas, y los pastores y maestros. Ellos tienen la responsabilidad de preparar al pueblo de Dios para que lleve a cabo la obra de Dios y edifique la iglesia, es decir, el cuerpo de Cristo. Ese proceso continuará hasta que todos alcancemos tal unidad en nuestra fe y conocimiento del Hijo de Dios que seamos maduros en el Señor, es decir, hasta que lleguemos a la plena y completa medida de Cristo. Efesios 4:11-13 (NTV)"
  },
  {
    title: "1 Pedro 4:9-11",
    content:
      "Abran las puertas de su hogar con alegría al que necesite un plato de comida o un lugar donde dormir. Dios, de su gran variedad de dones espirituales, les ha dado un don a cada uno de ustedes. Úsenlos bien para servirse los unos a los otros. ¿Has recibido el don de hablar en público? Entonces, habla como si Dios mismo estuviera hablando por medio de ti. ¿Has recibido el don de ayudar a otros? Ayúdalos con toda la fuerza y la energía que Dios te da. Así, cada cosa que hagan traerá gloria a Dios por medio de Jesucristo. ¡A él sea toda la gloria y todo el poder por siempre y para siempre! Amén. 1 Pedro 4:9-11 (NTV)"
  }
];
function Home(props) {
  return (
    <section>
      <img src={PrayBible} alt="dones espirituales" className="portada" />
      <article className="home">
        <p className="versiculo">
          "Pero a cada uno se le da la manifestación del Espíritu para el bien
          común."
        </p>
        <p className="versiculo-cita">1 Corintios 12:7 (LBLA)</p>
        <div className="stack">
          <button
            onClick={() => {
              if (!props.user) {
                console.log("aun no ingresa");
                props.handleGoogleSignIn();
              }
              props.onTabClick("test");
            }}
            className="boton"
          >
            Hacer el Test
          </button>
          <button
            onClick={() => props.onTabClick("dones")}
            className="boton-info"
          >
            Ver Dones
          </button>
        </div>

        <p>
          Un don espiritual es una manifestación soberana del Espíritu Santo en
          la vida del creyente que lo capacita para poder servir a Dios y a su
          prójimo.
        </p>

        {/* <p>En la Biblia los encontramos en estos pasajes:</p> */}
        <div className="stack">
          {Referencias.map((referencia, index) => (
            <Popover key={index} {...referencia} />
          ))}
        </div>

        <p>
          📝 Adapté este{" "}
          <a
            href="https://www.accounseling.org/wp-content/uploads/2018/04/Spiritual_Gifts_Survey-_spanish.pdf"
            target="_blank"
          >
            test
          </a>{" "}
          , para simplificar el proceso.
        </p>
        <p>
          {" "}
          🤓Recuerda que los resultados son simplemente una guía pero espero
          pueda serte de mucha ayuda en tu caminar cristiano.
        </p>
        <p>😇 ¡Que Dios te bendiga!</p>
      </article>
      <img
        src={DonesEspirituales}
        alt="dones espirituales"
        className="portada"
      />
      <div className="stack">
        <button
          onClick={() => {
            if (!props.user) {
              console.log("aun no ingresa");
              props.handleGoogleSignIn();
            }
            props.onTabClick("test");
          }}
          className="boton"
        >
          Hacer el Test
        </button>
        <button
          onClick={() => props.onTabClick("dones")}
          className="boton-info"
        >
          Ver Dones
        </button>
      </div>
    </section>
  );
}

export default Home;
=======
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
>>>>>>> refactor
