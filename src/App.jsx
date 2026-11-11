import { lazy } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home/Home";
import "./app.css";

// Páginas pesadas (gráficos, Firebase) se cargan bajo demanda
const Dones = lazy(() => import("./pages/Dones/Dones"));
const Test = lazy(() => import("./pages/Test/Test"));
const Profile = lazy(() => import("./pages/Profile/Profile"));

// HashRouter: las rutas funcionan en GitHub Pages sin 404.html ni redirects
export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="dones" element={<Dones />} />
            <Route path="test" element={<Test />} />
            <Route path="perfil" element={<Profile />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
