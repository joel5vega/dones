// utils/scale.js

const MAX_PER_ITEM = 4;

// Plantillas por tipo. Cada una devuelve 4 frases (valor 1–4).
const TEMPLATES = {
  habilidad: [
    "Nunca lo hago",
    "Lo hago pocas veces",
    "Lo hago casi siempre",
    "Siempre lo hago",
  ],
  disfrute: [
    "No lo disfruto",
    "Lo disfruto poco",
    "Lo disfruto bastante",
    "Lo disfruto mucho",
  ],
  sensibilidad: [
    "No lo noto",
    "Lo noto pocas veces",
    "Lo noto casi siempre",
    "Siempre lo noto",
  ],
  frecuencia: [
    "Nunca lo hago",
    "Lo hago pocas veces",
    "Lo hago casi siempre",
    "Siempre lo hago",
  ],
  identidad: [
    "No me describe",
    "Me describe poco",
    "Me describe bastante",
    "Me describe totalmente",
  ],
};

// Mismas escalas en tercera persona (evaluador externo). "le" evita marcar género.
const TEMPLATES_PEER = {
  habilidad: ["Nunca lo hace", "Lo hace pocas veces", "Lo hace casi siempre", "Siempre lo hace"],
  disfrute: ["No lo disfruta", "Lo disfruta poco", "Lo disfruta bastante", "Lo disfruta mucho"],
  sensibilidad: ["No lo nota", "Lo nota pocas veces", "Lo nota casi siempre", "Siempre lo nota"],
  frecuencia: ["Nunca lo hace", "Lo hace pocas veces", "Lo hace casi siempre", "Siempre lo hace"],
  identidad: ["No le describe", "Le describe poco", "Le describe bastante", "Le describe totalmente"],
};

// Etiqueta corta para el círculo (1–2 palabras), siempre la misma para no saturar
const SHORT_LABELS = ["Nunca", "Poco", "Bastante", "Siempre"];

/** perspective: "self" (primera persona) | "peer" (tercera persona) */
export function scaleFor(tipo, perspective = "self") {
  const templates = perspective === "peer" ? TEMPLATES_PEER : TEMPLATES;
  const phrases = templates[tipo] ?? templates.habilidad;
  return phrases.map((phrase, i) => ({
    value: i + 1,
    label: SHORT_LABELS[i],
    phrase,
  }));
}

export { MAX_PER_ITEM };