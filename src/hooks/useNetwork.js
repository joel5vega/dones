import { useCallback, useEffect, useMemo, useState } from "react";
import preguntas from "../data/preguntas";
import { getNetworkData } from "../services/networkService";
import { buildNetwork } from "../utils/network";

/** Carga usuarios + evaluaciones y construye el grafo (solo si `enabled`). */
export function useNetwork(enabled) {
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true); setError(null);
    try { setRaw(await getNetworkData()); }
    catch (e) { console.error(e); setError(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (enabled) reload(); }, [enabled, reload]);

  const network = useMemo(
    () => (raw ? buildNetwork(raw.users, raw.evaluations, { totalQuestions: preguntas.length, invites: raw.invites }) : null),
    [raw]
  );
  return { network, loading, error, reload };
}
