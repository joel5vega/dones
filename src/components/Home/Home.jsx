import React from "react";
import Popover from "../Popover";
import DonesEspirituales from "../../assets/pictures/dones-espirituales.png";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { padding } from "@mui/system";
const Referencias = [
  {
    title: "Romanos 12:6-8",
    content:
      "6 De manera que, teniendo diferentes dones, según la gracia que nos es dada, si el de profecía, úsese conforme a la medida de la fe; 7 o si de servicio, en servir; o el que enseña, en la enseñanza; 8 el que exhorta, en la exhortación; el que reparte, con liberalidad; el que preside, con solicitud; el que hace misericordia, con alegría."
  },
  {
    title: "1 Corintios 12:8-10",
    content:
      "8 Porque a este es dada por el Espíritu palabra de sabiduría; a otro, palabra de ciencia según el mismo Espíritu; 9 a otro, fe por el mismo Espíritu; y a otro, dones de sanidades por el mismo Espíritu. 10 A otro, el hacer milagros; a otro, profecía; a otro, discernimiento de espíritus; a otro, diversos géneros de lenguas; y a otro, interpretación de lenguas."
  },
  {
    title: "1 Corintios 12:28-30",
    content:
      "28 Y a unos puso Dios en la iglesia, primeramente apóstoles, luego profetas, lo tercero maestros, luego los que hacen milagros, después los que sanan, los que ayudan, los que administran, los que tienen don de lenguas. 29 ¿Son todos apóstoles?, ¿son todos profetas?, ¿todos maestros?, ¿hacen todos milagros? 30 ¿Tienen todos dones de sanidad?, ¿hablan todos lenguas?, ¿interpretan todos?"
  },
  ,
  {
    title: "1 Pedro 4:9-11",
    content:
      "9 Hospedaos los unos a los otros sin murmuraciones. 10 Cada uno según el don que ha recibido, minístrelo a los otros, como buenos administradores de la multiforme gracia de Dios. 11 Si alguno habla, hable conforme a las palabras de Dios; si alguno ministra, ministre conforme al poder que Dios da, para que en todo sea Dios glorificado por Jesucristo, a quien pertenecen la gloria y el imperio por los siglos de los siglos. Amén."
  }
];
function Home() {
  return (
    <section>
      <h1>Dones espirituales</h1>
      <img src={DonesEspirituales} alt="dones espirituales" />
      <article>
        <p className="versiculo">
          "Pero a cada uno se le da la manifestación del Espíritu para el bien
          común."
        </p>
        <p className="versiculo-cita">1 Corintios 12:7 (LBLA)</p>
        <p>
          Un don espiritual es una manifestación del Espíritu Santo en la vida
          del creyente que lo capacita para poder servir a Dios y a su prójimo.
        </p>
        <p>Podemos encontrar una lista de los diferentes dones en:</p>
        <div className="stack">
          {Referencias.map((referencia, index) => (
            <Popover key={index} {...referencia} />
          ))}
        </div>

        <p>
          Encontré un artículo interesante acerca del{" "}
          <a
            href="https://www.coalicionporelevangelio.org/articulo/dones-espirituales-proposito/"
            target="_blank"
          >
            propósito
          </a>{" "}
          de los dones espirituales, que resalta el hecho de que los dones son
          para la edificación de la iglesia.
        </p>
        <p>
          Dios da los dones, de manera soberana y nos los provee con un
          propósito.
        </p>
        <p>
          Según mi criterio, la mejor manera de conocer que Dios nos ha dado un
          don es ejerciendo el don y recibiendo la confirmación de Dios, de
          nuestra iglesia y comunidad y en nosotros mismos.
        </p>
        <p>
          Sin embargo, muchas veces no sabemos por donde empezar. El presente
          test es un intento de apoyar y orientar a los cristianos a conocer los
          dones espirituales para así poder ejercerlos en beneficio de la
          iglesia.{" "}
        </p>
        <p>
          Fue diseñado por Recurso Cristianos, puedes encontrar el artículo{" "}
          <a
            href="https://www.accounseling.org/wp-content/uploads/2018/04/Spiritual_Gifts_Survey-_spanish.pdf"
            target="_blank"
          >
            aquí
          </a>
          .{" "}
        </p>
        <p>
          Mi labor fue automatizar el cuestionario y mostrarlo de una manera más
          sencilla para que pueda ser accedido por muchas personas.
        </p>
        <p>¡Que Dios te bendiga!</p>
      </article>
      <Link
        style={{
          margin: "2rem",
          color: "var(--fondo)",
          background: "var(--activo)", padding:"1rem",
          minHeight:"1rem ",
          borderRadius:"1rem"
        }}
        to="/test"
      >
        Ir al Test de dones
      </Link>

      <Link
        to="/lista"
        style={{
          margin: "2rem",
          color: "var(--fondo)",
          background: "var(--activo)",
          padding:"1rem",
          minHeight:"1rem ",
          borderRadius:"1rem"
        }}
      >
        Ver lista de dones
      </Link>
    </section>
  );
}

export default Home;
