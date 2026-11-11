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

// Etiqueta corta para el círculo (1–2 palabras), siempre la misma para no saturar
const SHORT_LABELS = ["Nunca", "Poco", "Bastante", "Siempre"];

export function scaleFor(tipo) {
  const phrases = TEMPLATES[tipo] ?? TEMPLATES.habilidad;
  return phrases.map((phrase, i) => ({
    value: i + 1,
    label: SHORT_LABELS[i],
    phrase,
  }));
}

export { MAX_PER_ITEM };