import { useCallback, useEffect, useState } from "react";
import preguntas from "../data/preguntas";
import categorias from "../data/categorias";
import { useAuth } from "../contexts/AuthContext";
import { saveProgress, saveResult } from "../services/userService";
import { calculateScores, mergeAnswers, toResultado } from "../utils/scoring";

/** Estado completo del test: respuestas, resultado y persistencia (si hay sesión). */
export function useTest() {
  const { user, profile, patchProfile } = useAuth();
  const [answers, setAnswers] = useState(() => mergeAnswers(preguntas, profile?.answers));
  const [result, setResult] = useState(null); // { ranking, resultado }

  // Al iniciar sesión, carga las respuestas guardadas
  useEffect(() => {
    if (profile?.uid) setAnswers(mergeAnswers(preguntas, profile.answers));
  }, [profile?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  const setAnswer = useCallback(
    (id, respuesta) =>
      setAnswers((prev) => prev.map((a) => (a.id === id ? { ...a, respuesta } : a))),
    []
  );

  const save = useCallback(async () => {
    if (!user) return;
    try { await saveProgress(user.uid, answers); }
    catch (e) { console.error("No se pudo guardar el progreso:", e); }
  }, [user, answers]);

  const finish = useCallback(async () => {
    const ranking = calculateScores(answers, categorias);
    const resultado = toResultado(ranking);
    setResult({ ranking, resultado });
    if (!user) return;
    try {
      await saveResult(user.uid, answers, resultado);
      patchProfile({ resultado });
    } catch (e) {
      console.error("No se pudo guardar el resultado:", e);
    }
  }, [answers, user, patchProfile]);

  return { answers, setAnswer, save, finish, result };
}
