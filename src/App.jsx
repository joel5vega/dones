import React,{Suspense, lazy} from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Loader from "./components/Loader/Loader";
import Home from "./pages/Home/Home";
import "./app.css";
import { BrowserRouter as Router, Route,Routes, Link } from "react-router-dom";

const Preguntas = lazy(() => import("./pages/Prueba/Preguntas"));
const Dones = lazy(() => import("./pages/Dones/Dones"));
function App() {
  return (
    <Router basename="/dones">
      <Suspense fallback={<Loader/>}>
        <Routes  >
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Preguntas />} />
          <Route path="/lista" element={<Dones />} />
        </Routes>
      </Suspense>

      <Footer />
    </Router>
  );
}

export default App;
