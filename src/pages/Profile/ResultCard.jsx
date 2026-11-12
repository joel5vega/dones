import { forwardRef } from "react";
import ExportableResultCard from "../../components/ExportableResultCard";
import categorias from "../../data/categorias";
import iconos from "../../data/iconos";

const ResultCard = forwardRef(function ResultCard({ profile, isAdmin }, chartRef) {
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
        <span
          className="result-date"
          style={{ fontSize: "14px", fontWeight: "bold", color: "var(--primario)" }}
        >
          {isAdmin ? `Resultado de ${profile.name}` : ""}
        </span>
      </div>

      <ExportableResultCard
        ref={chartRef}
        ranking={ranking}
        userName={profile.name}
        userPhoto={profile.photo}
        topIcon={topIcon}
      />
    </article>
  );
});

export default ResultCard;