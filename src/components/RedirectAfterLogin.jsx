import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loader from "./Loader/Loader";

export default function RedirectAfterLogin() {
  const { user, profile, loading } = useAuth();

  console.log("[RedirectAfterLogin] render →", {
    loading,
    hasUser: !!user,
    uid: user?.uid,
    hasProfile: !!profile,
    tieneResultado: !!profile?.resultado,
  });

  if (loading) {
    console.log("[RedirectAfterLogin] → Loader (loading=true)");
    return <Loader />;
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