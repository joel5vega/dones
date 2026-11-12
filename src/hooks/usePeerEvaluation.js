import { useCallback, useEffect, useMemo, useState } from "react";
import preguntas from "../data/preguntas";
import categorias from "../data/categorias";
import { useAuth } from "../contexts/AuthContext";
import { getInvite, getMyResponse, submitResponse } from "../services/peerService";
import { buildPeerQuestions, calculatePartialScores, peerText } from "../utils/peer";

/**
 * Flujo del evaluador: cargar invitación → responder → elegir 3 dones → enviar.
 * status: loading | notFound | self | ready | done
 * step:   questions | pick
 */
export function usePeerEvaluation(code) {
  const { user, loading: authLoading } = useAuth();
  const [invite, setInvite] = useState(null);
  const [status, setStatus] = useState("loading");
  const [step, setStep] = useState("questions");
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    getInvite(code)
      .then((inv) => {
        if (cancelled) return;
        setInvite(inv);
        if (!inv) return setStatus("notFound");
        setAnswers(buildPeerQuestions(inv.questionIds, preguntas));
        setStatus("ready");
      })
      .catch((e) => { console.error(e); if (!cancelled) setStatus("notFound"); });
    return () => { cancelled = true; };
  }, [code]);

  // Con sesión: ¿es el propio dueño? ¿ya respondió antes?
  const [previous, setPrevious] = useState(null);
  useEffect(() => {
    if (!user || !invite) return;
    if (invite.ownerUid === user.uid) return setStatus("self");
    getMyResponse(code, user.uid).then(setPrevious).catch(console.error);
  }, [user, invite, code]);

  const setAnswer = useCallback(
    (id, respuesta) => setAnswers((prev) => prev.map((a) => (a.id === id ? { ...a, respuesta } : a))),
    []
  );

  const submit = useCallback(
    async (topGifts) => {
      setError(null);
      try {
        await submitResponse(code, user, {
          answers,
          topGifts,
          scores: calculatePartialScores(answers, categorias),
        });
        setStatus("done");
      } catch (e) {
        console.error(e);
        setError("No se pudo enviar tu evaluación. Inténtalo de nuevo.");
      }
    },
    [code, user, answers]
  );

  const ownerName = invite?.ownerName ?? "";
  const textFor = useMemo(() => (q) => peerText(q.id, ownerName), [ownerName]);

  return {
    user, authLoading, invite, status, step, setStep, answers, setAnswer, submit,
    error, previous, textFor,
  };
}
