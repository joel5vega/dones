import React,{Suspense, lazy} from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
// import Preguntas from "./components/Prueba/Preguntas";
import Home from "./components/Home/Home";
import "./app.css";
import { BrowserRouter as Router, Route,Routes, Link } from "react-router-dom";
const Preguntas = lazy(() => import("./components/Prueba/Preguntas"));
function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Preguntas />} />
        </Routes>
      </Suspense>

      <Footer />
    </Router>
  );
}

export default App;
