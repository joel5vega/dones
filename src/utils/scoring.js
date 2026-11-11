// Lógica de puntaje: funciones puras, sin React ni Firebase.

const MAX_PER_ITEM = 4; // Escala 1-4

/** 
 * Convierte la respuesta lineal (1,2,3,4) en un peso cuadrático.
 * 1 -> 1, 2 -> 4, 3 -> 9, 4 -> 16.
 * Esto hace que las respuestas altas tengan mucho más impacto.
 */
const weight = (value) => {
  if (!value) return 0;
  return Math.pow(value, 2);
};

/** Combina las preguntas base con las respuestas guardadas ([{id, respuesta}]). */
export function mergeAnswers(questions, saved = []) {
  const byId = new Map(saved.map((a) => [a.id, a.respuesta]));
  return questions.map((q) => ({ ...q, respuesta: byId.get(q.id) ?? 0 }));
}

/**
 * Suma las respuestas ponderadas de cada don y las normaliza a 0-100.
 */
export function calculateScores(answers, categorias) {
  const byId = new Map(answers.map((a) => [a.id, a.respuesta ?? 0]));

  return categorias
    .map((c) => {
      // Calculamos el puntaje ponderado
      const raw = c.valores.reduce((sum, qId) => sum + weight(byId.get(qId) ?? 0), 0);
      
      // El máximo posible ahora es: cantidad de preguntas * (4 al cuadrado = 16)
      const max = c.valores.length * Math.pow(MAX_PER_ITEM, 2);
      
      // Normalizamos a 100
      const score = max > 0 ? Math.round((raw / max) * 100) : 0;
      
      return { ...c, raw, score };
    })
    .sort((a, b) => b.score - a.score);
}

/** Formato guardado en Firestore: { id: "YYYY-MM-DD", [nombreDon]: puntaje (0-100) } */
export function toResultado(ranking, date = new Date()) {
  return {
    id: date.toISOString().slice(0, 10),
    ...Object.fromEntries(ranking.map((d) => [d.name, d.score])),
  };
}