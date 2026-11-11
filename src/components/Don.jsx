import iconos from "../data/iconos";

export default function Don({ data: { id, name, definicion, texto } }) {
  return (
    <article className="don-card">
      <header className="don-header">
        <div className="don-icon-wrapper">
          <img src={iconos[id]} alt={name} className="don-icon" />
        </div>
        <div className="don-title">
          <h3>{name}</h3>
          <span className="don-reference">{texto}</span>
        </div>
      </header>
      <div className="don-body">
        <p>{definicion}</p>
      </div>
    </article>
  );
}