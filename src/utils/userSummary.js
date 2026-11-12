import categorias from "../data/categorias";
import { scoringStatus } from "./migration";
import { topGiftIds } from "./peer";

/** Resumen de un perfil para el panel de administrador y el correo. */
export function summarizeUser(user) {
  const status = scoringStatus(user); // none | legacy | current
  const { id: date, ...scores } = user.resultado ?? {};
  const top = user.resultado
    ? topGiftIds(scores, categorias).map((id) => {
        const gift = categorias.find((c) => c.id === id);
        return { id, name: gift.name, definicion: gift.definicion, score: scores[gift.name] };
      })
    : [];
  return {
    status, date: date ?? null, top,
    // Solo se envía correo con resultados ya recalculados y con dirección
    canEmail: status === "current" && Boolean(user.email),
  };
}
