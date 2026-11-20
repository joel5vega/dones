import { lazy, useEffect } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home/Home";
import "./app.css";

const Dones = lazy(() => import("./pages/Dones/Dones"));
const Test = lazy(() => import("./pages/Test/Test"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const Compare = lazy(() => import("./pages/Peer/Compare"));
const Evaluate = lazy(() => import("./pages/Peer/Evaluate")); // Evaluación comunitaria
const Servicio = lazy(() => import("./pages/Servicio/Servicio"));
const AdminMinisterios = lazy(() => import("./pages/admin/Ministerios"));
const Seguimiento = lazy(() => import("./pages/admin/Seguimiento"));
const RedirectAfterLogin = lazy(() => import("./components/RedirectAfterLogin"));

export default function App() {
  // ✅ dentro del componente
  useEffect(() => {
    try { sessionStorage.removeItem("returnTo"); } catch {}
  }, []);

  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="dones" element={<Dones />} />
            <Route path="test" element={<Test />} />
            <Route path="perfil" element={<Profile />} />
            <Route path="servicio" element={<Servicio />} />
            <Route path="admin/ministerios" element={<AdminMinisterios />} />
            <Route path="evaluaciones" element={<Compare />} />
            <Route path="evaluar" element={<Evaluate />} />             {/* ✅ AÑADIDO */}
            <Route path="evaluar/:code" element={<Evaluate />} />       {/* ✅ AÑADIDO */}
            <Route path="seguimiento" element={<Seguimiento />} />
            <Route path="entrar" element={<RedirectAfterLogin />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}