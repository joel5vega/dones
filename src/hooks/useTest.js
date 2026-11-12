import { useCallback, useEffect, useRef, useState } from "react";
import preguntas from "../data/preguntas";
import categorias from "../data/categorias";
import { useAuth } from "../contexts/AuthContext";
import { saveProgress, saveResult } from "../services/userService";
import { calculateScores, mergeAnswers, toResultado } from "../utils/scoring";

const AUTOSAVE_DELAY = 800; // ms de pausa tras la última respuesta

/** Estado completo del test: respuestas, autoguardado y resultado. */
export function useTest() {
  const { user, profile, loading, patchProfile } = useAuth();
  const [answers, setAnswers] = useState(() => mergeAnswers(preguntas, profile?.answers));
  const [result, setResult] = useState(null); // { ranking, resultado }
  const [hydrated, setHydrated] = useState(false);
  const dirty = useRef(false); // hay cambios sin guardar
  const latest = useRef(answers);
  latest.current = answers;

  // Al iniciar sesión, carga las respuestas guardadas (sin marcarlas como "cambios")
  useEffect(() => {
    if (!profile?.uid) return;
    setAnswers(mergeAnswers(preguntas, profile.answers));
    dirty.current = false;
    setHydrated(true);
  }, [profile?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  const flush = useCallback(async () => {
    if (!user || !dirty.current) return;
    dirty.current = false;
    try {
      await saveProgress(user.uid, latest.current);
    } catch (e) {
      dirty.current = true; // reintenta en el siguiente cambio
      console.error("No se pudo guardar el progreso:", e);
    }
  }, [user]);

  // Autoguardado con debounce
  useEffect(() => {
    if (!hydrated || !dirty.current) return;
    const t = setTimeout(flush, AUTOSAVE_DELAY);
    return () => clearTimeout(t);
  }, [answers, hydrated, flush]);

  // Si se cierra o se oculta la pestaña, guarda de inmediato
  useEffect(() => {
    const onHide = () => document.visibilityState === "hidden" && flush();
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [flush]);

  const setAnswer = useCallback((id, respuesta) => {
    dirty.current = true;
    setAnswers((prev) => prev.map((a) => (a.id === id ? { ...a, respuesta } : a)));
  }, []);

  /** Borra todas las respuestas para empezar de nuevo (se guarda con el autoguardado). */
  const reset = useCallback(() => {
    dirty.current = true;
    setAnswers((prev) => prev.map((a) => ({ ...a, respuesta: 0 })));
  }, []);

  const finish = useCallback(async () => {
    const ranking = calculateScores(answers, categorias);
    const resultado = toResultado(ranking);
    setResult({ ranking, resultado });
    if (!user) return;
    try {
      dirty.current = false;
      await saveResult(user.uid, answers, resultado);
      patchProfile({ resultado });
    } catch (e) {
      console.error("No se pudo guardar el resultado:", e);
    }
  }, [answers, user, patchProfile]);

  // Listo para mostrar preguntas: sin sesión, o con las respuestas ya cargadas
  const ready = !loading && (!user || hydrated || !profile);

  return { answers, setAnswer, reset, finish, result, ready };
}
