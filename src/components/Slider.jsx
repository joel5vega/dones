import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGrimace,
  faSmile,
  faGrin,
  faFaceSmileBeam,
} from "@fortawesome/free-solid-svg-icons";
import "./slider.css";

const ICONS = [faGrimace, faSmile, faGrin, faFaceSmileBeam];
const LABELS = ["Poco", "A veces", "Casi siempre", "Mucho"];

export { ICONS as SCALE_ICONS };

export default function Slider({ id, value, onChange, pregunta }) {
  const fillPercent = (value / 3) * 100;

  return (
    <div className="slider-card">
      <p className="slider-question">{pregunta}</p>

      <div className="slider-control">
        <FontAwesomeIcon
          icon={ICONS[value]}
          className="slider-icon"
          aria-hidden="true"
        />
        <div className="slider-track-wrapper">
          <input
            id={id}
            type="range"
            min="0"
            max="3"
            step="1"
            value={value}
            aria-label={pregunta}
            aria-valuetext={LABELS[value]}
            onChange={(e) => onChange(id, Number(e.target.value))}
            style={{ "--fill": `${fillPercent}%` }}
            className="slider-input"
          />
          <div className="slider-labels">
            <span>Poco</span>
            <span>Mucho</span>
          </div>
        </div>
        <span className="slider-value-label">{LABELS[value]}</span>
      </div>
    </div>
  );
}