// Clasifica la "forma" de un documento users/{uid} para entender por qué no tiene resultado.
import categorias from "../src/data/categorias.js";

const RELEVANT = new Set(categorias.flatMap((c) => c.valores)); // las 48 preguntas que puntúan

export function shapeOf(data) {
  const answers = (data.answers ?? []).filter((a) => RELEVANT.has(a.id) && typeof a.respuesta === "number");
  const answered = answers.length;                          // con campo `respuesta`
  const nonZero = answers.filter((a) => a.respuesta > 0).length; // 0 también es válido en la escala antigua
  const donesScored = (data.dones ?? []).some((d) => d.score > 0);

  let group;
  if (data.resultado) group = "con resultado";
  else if (donesScored) group = "sin `resultado`, pero `dones` con puntajes";
  else if (nonZero >= 30) group = "sin `resultado`, respuestas casi completas";
  else if (nonZero > 0) group = "sin `resultado`, respuestas parciales";
  else group = "sin `resultado`, sin respuestas (nunca avanzó)";
  return { group, answered, nonZero, keys: Object.keys(data).sort() };
}
