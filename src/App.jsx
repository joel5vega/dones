import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Preguntas from "./components/Preguntas";
import "./app.css";

function App() {
  return (
    <div>
      <Header />
      <div className="body">
        <Preguntas />
      </div>
      <Footer />
    </div>
  );
}

export default App;
