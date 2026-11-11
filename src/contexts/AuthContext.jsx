import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { getOrCreateProfile } from "../services/userService";

const AuthContext = createContext(null);
const provider = new GoogleAuthProvider();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // usuario de Firebase Auth
  const [profile, setProfile] = useState(null); // documento users/{uid}
  const [loading, setLoading] = useState(true);

  // Mantiene la sesión al recargar la página
  useEffect(
    () =>
      onAuthStateChanged(auth, async (u) => {
        setUser(u);
        try {
          setProfile(u ? await getOrCreateProfile(u) : null);
        } catch (e) {
          console.error("No se pudo cargar el perfil:", e);
          setProfile(null);
        }
        setLoading(false);
      }),
    []
  );

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isAdmin: Boolean(profile?.admin),
      signInWithGoogle: () => signInWithPopup(auth, provider),
      logout: () => signOut(auth),
      patchProfile: (partial) => setProfile((p) => (p ? { ...p, ...partial } : p)),
    }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
};
