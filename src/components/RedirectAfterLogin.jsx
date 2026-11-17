import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loader from "./Loader/Loader";

export default function RedirectAfterLogin() {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // returnTo puede venir por state (Link) o por sessionStorage (persistido)
  const returnTo =
    location.state?.returnTo ||
    (typeof sessionStorage !== "undefined" ? sessionStorage.getItem("returnTo") : null);

  console.log("[RedirectAfterLogin] render →", {
    loading,
    hasUser: !!user,
    uid: user?.uid,
    hasProfile: !!profile,
    tieneResultado: !!profile?.resultado,
    returnTo,
  });

  if (loading) {
    console.log("[RedirectAfterLogin] → Loader (loading=true)");
    return <Loader />;
  }

  // Prioridad: si venimos de un enlace profundo, volvemos ahí
  if (returnTo) {
    try { sessionStorage.removeItem("returnTo"); } catch {}
    console.log("[RedirectAfterLogin] → returnTo:", returnTo);
    return <Navigate to={returnTo} replace />;
  }

  if (!user) {
    console.log("[RedirectAfterLogin] → / (sin user)");
    return <Navigate to="/" replace />;
  }
  if (!profile?.resultado) {
    console.log("[RedirectAfterLogin] → /test (sin resultado)");
    return <Navigate to="/test" replace />;
  }
  console.log("[RedirectAfterLogin] → /perfil (con resultado)");
  return <Navigate to="/perfil" replace />;
}