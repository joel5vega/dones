import { useMemo, useState } from "react";
import { groupByTopGift } from "../../utils/adminUsers";
import { giftIcon } from "../../utils/giftIcon";

/** Una tarjeta por don principal con cuántas personas lo tienen; al tocar se despliega la lista. */
export default function GiftGroups({ rows, onOpen }) {
  const groups = useMemo(() => groupByTopGift(rows), [rows]);
  const [open, setOpen] = useState(null);
  const max = groups[0]?.count || 1;
  const tested = rows.filter((r) => r.tested).length;

  return (
    <section>
      <p className="adm-muted">
        {tested} personas con test. Quien tenga un empate en el puntaje más alto aparece en cada don empatado.
      </p>
      <div className="adm-groups">
        {groups.map((g) => {
          const isOpen = open === g.gift;
          const icon = giftIcon(g.gift);
          return (
            <div key={g.gift} className={`adm-card adm-group ${isOpen ? "open" : ""}`}>
              <button
                type="button"
                className="adm-group-head"
                onClick={() => setOpen(isOpen ? null : g.gift)}
                aria-expanded={isOpen}
              >
                {icon && <img src={icon} alt="" className="adm-gift-icon" />}
                <span className="adm-group-title">
                  <strong>{g.gift}</strong>
                  <small>{Math.round((g.count / (tested || 1)) * 100)}% del total</small>
                </span>
                <span className="adm-count">{g.count}</span>
              </button>
              <div className="adm-bar">
                <div style={{ width: `${(g.count / max) * 100}%` }} />
              </div>
              {isOpen && (
                <ul className="adm-list adm-members">
                  {g.members.map((m) => (
                    <li key={m.uid}>
                      <button
                        type="button"
                        className="adm-row adm-row-sm"
                        onClick={() => onOpen(m.uid)}
                      >
                        <span className="adm-who">
                          <strong>{m.name}</strong>
                        </span>
                        {m.tops.length > 1 && <span className="adm-chip">empate</span>}
                        <span className="adm-gift">
                          <em>{m.top.score}%</em>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}