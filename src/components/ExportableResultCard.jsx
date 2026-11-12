import { forwardRef, useRef, useState, useMemo } from "react";
import { toJpeg } from "html-to-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faUser } from "@fortawesome/free-solid-svg-icons";
import RadarChart from "./RadarChart";
import "./exportable-card.css";

const SITE_URL = "https://joel5vega.github.io/dones";

const ExportableResultCard = forwardRef(function ExportableResultCard(
  { ranking, userName, userPhoto, topIcon },
  chartRef
) {
  const exportRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const top = ranking[0];

    const top8Axes = useMemo(() => {
    return ranking.slice(0, 7).map((g) => ({ 
      id: g.id, 
      label: g.name, 
      score: g.score 
    }));
  }, [ranking]);

  const radarAxes = ranking.map((g) => ({ id: g.id, label: g.name, score: g.score }));

  const download = async () => {
    if (!exportRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      await new Promise((r) => setTimeout(r, 150));
      const dataUrl = await toJpeg(exportRef.current, {
        quality: 0.95,
        backgroundColor: "#052f5f",
        pixelRatio: 2,
        skipFonts: true,
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `dones-${userName || "test"}.jpg`;
      a.click();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="exportable-card-wrapper">
      <div className="exportable-header">
        <span>Perfil de dones</span>
        <button
          className={`icon-btn ${isDownloading ? "loading" : ""}`}
          onClick={download}
          disabled={isDownloading}
          title="Descargar imagen"
        >
          <FontAwesomeIcon icon={faDownload} />
        </button>
      </div>

      <div ref={exportRef} className="radar-export-area">
        <div className="export-user-header">
          <div className="export-user-info">
            {userPhoto ? (
              <img
                src={userPhoto}
                alt={userName}
                className="export-avatar"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="export-avatar-placeholder">
                <FontAwesomeIcon icon={faUser} />
              </div>
            )}
            <div>
              <span className="export-name">{userName || "Invitado"}</span>
            </div>
          </div>
          {top && topIcon && (
            <div className="export-top-gift">
              <img src={topIcon} alt="Don principal" />
            </div>
          )}
        </div>

        {/* <RadarChart ref={chartRef} axes={radarAxes} topGiftName={top?.name} /> */}
      <RadarChart axes={top8Axes} topGiftName={top?.name} />
      
        <div className="chart-source">
          Fuente:{" "}
          <a href={SITE_URL} target="_blank" rel="noopener noreferrer">
            {SITE_URL.replace("https://", "")}
          </a>
        </div>
      </div>
    </div>
  );
});

export default ExportableResultCard;