import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext";
import { getAllProfiles, saveRadarImage } from "../../services/userService";
import Loader from "../../components/Loader/Loader";
import ResultCard from "./ResultCard";
import AdminUsers from "./AdminUsers";
import "./profile.css";

export default function Profile() {
  const { user, profile, isAdmin, loading } = useAuth();
  const [all, setAll] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    if (isAdmin) getAllProfiles().then(setAll).catch(console.error);
  }, [isAdmin]);

  // Genera y guarda la imagen del radar si falta
  useEffect(() => {
    if (loading || !profile?.resultado || profile.radarImageBase64) return;
    if (!chartRef.current) return;

    const timer = setTimeout(async () => {
      try {
        const { imgURI } = await chartRef.current.dataURI({ scale: 2 });
        const base64 = imgURI.split(",")[1];
        await saveRadarImage(profile.uid, base64);
        console.log("Radar guardado para", profile.uid);
      } catch (e) {
        console.error("No se pudo guardar el radar:", e);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [loading, profile]);

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/" replace />;

  const list = isAdmin ? all.filter(Boolean) : profile ? [profile] : [];
  const completed = isAdmin
    ? all.filter((p) => p.resultado).length
    : profile?.resultado
      ? 1
      : 0;

  return (
    <main className="profile-page">
      {isAdmin && (
        <div className="admin-stats">
          <div className="stat-card">
            <span className="stat-number">{all.length}</span>
            <span className="stat-label">Usuarios registrados</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{completed}</span>
            <span className="stat-label">Tests completados</span>
          </div>
        </div>
      )}

      <section className="profile-content">
        {isAdmin ? (
          <AdminUsers users={all} />
        ) : list.length === 0 ? (
          <div className="empty-state">
            <FontAwesomeIcon icon={faClockRotateLeft} className="empty-icon" />
            <h2>Aún no tienes resultados guardados</h2>
            <p>Completa el test de dones para ver tu perfil y gráfico aquí.</p>
            <Link to="/test" className="btn btn-primary">
              Comenzar Test
            </Link>
          </div>
        ) : (
          <div className="results-list">
            {list.map((p) => (
              <ResultCard
                key={p.uid}
                profile={p}
                isAdmin={isAdmin}
                ref={p.uid === profile?.uid ? chartRef : null}
              />
            ))}
          </div>
        )}
      </section>

      <Link to="/test" className="btn btn-primary">
        {profile?.resultado ? "Repetir el Test" : "Hacer el Test"}
      </Link>
      {profile?.resultado && (
        <Link to="/evaluaciones" className="btn btn-primary">
          Evaluación de otros
        </Link>
      )}
    </main>
  );
}