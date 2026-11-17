import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loader from "./Loader/Loader";

export default function RedirectAfterLogin() {
  const { user, profile, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/" replace />;
  if (!profile?.resultado) return <Navigate to="/test" replace />;
  return <Navigate to="/perfil" replace />;
}