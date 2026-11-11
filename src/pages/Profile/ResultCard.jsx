import { Link } from "react-router-dom";
import ExportableResultCard from "../../components/ExportableResultCard";
import categorias from "../../data/categorias";
import iconos from "../../data/iconos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function ResultCard({ profile, isAdmin }) {
  if (!profile.resultado) return null;

  const ranking = Object.entries(profile.resultado)
    .filter(([key]) => key !== "id")
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score);

  const topName = ranking[0]?.name;
  const topCat = categorias.find((c) => c.name === topName);
  const topIcon = topCat ? iconos[topCat.id] : null;

  return (
    <article className="result-card-profile">
      <div className="result-card-header">
        <span className="result-date" style={{ fontSize: "14px", fontWeight: "bold", color: "var(--primario)" }}>
          {isAdmin ? `Resultado de ${profile.name}` : ""}
        </span>
      </div>

      <ExportableResultCard
        ranking={ranking}
        userName={profile.name}
        userPhoto={profile.photo}
        topIcon={topIcon}
      />

   
    </article>
  );
}