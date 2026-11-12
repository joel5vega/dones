import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { createOrRefreshInvite, getInvite, getResponses } from "../services/peerService";

/** Invitación del usuario + evaluaciones recibidas. */
export function usePeerComparison() {
  const { user, profile, patchProfile } = useAuth();
  const [invite, setInvite] = useState(null);
  const [responses, setResponses] = useState([]);
  const [busy, setBusy] = useState(false);

  const code = profile?.inviteCode;

  useEffect(() => {
    if (!code) return;
    getInvite(code).then(setInvite).catch(console.error);
    getResponses(code).then(setResponses).catch(console.error);
  }, [code]);

  const createOrRefresh = useCallback(async () => {
    setBusy(true);
    try {
      const inv = await createOrRefreshInvite(user);
      setInvite(inv);
      patchProfile({ inviteCode: inv.code });
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }, [user, patchProfile]);

  return { invite, responses, busy, createOrRefresh };
}
