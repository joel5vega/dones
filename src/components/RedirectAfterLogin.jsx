import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loader from "./Loader/Loader";

export default function RedirectAfterLogin() {
  const { user, profile, loading } = useAuth();

  if (loading) return <Loader />;                            // espera a que cargue el perfil
  if (!user) return <Navigate to="/" replace />;             // no logueado → home
  if (!profile?.resultado) return <Navigate to="/test" replace />; // sin test → test
  return <Navigate to="/perfil" replace />;                  // con test → perfil
}