import categorias from "../data/categorias";
import iconos from "../data/iconos";

/** Ícono (PNG) de un don por su nombre, o null. */
export const giftIcon = (name) => {
  const c = categorias.find((x) => x.name === name);
  return c ? iconos[c.id] ?? null : null;
};
