import React from "react";
import PreguntasData from "../data/PreguntasData";
import Home from "../pages/Home/Home";
import Dones from "../pages/Dones/Dones";
import Test from "../pages/Prueba/Test";
import Results from "../pages/Prueba/Results";
import Users from "../pages/admin/Users";
const PageContent = ({
  activeTab,
  user,
  handleSaveProgress,
  answers,
  setAnswers,
  setDones,
  setResultado,
  resultado,
  handleSaveResultado,
  loggedIn,
  onTabClick,
  handleGoogleSignIn,db
}) => {
  switch (activeTab) {
    case "home":
      return (
        <Home
          onTabClick={onTabClick}
          user={user}
          handleGoogleSignIn={handleGoogleSignIn}
        />
      );
    case "dones":
      return (
        <Dones
          onTabClick={onTabClick}
          user={user}
          handleGoogleSignIn={handleGoogleSignIn}
        />
      );
    case "test":
      return (
        <Test
          user={user}
          handleSaveProgress={handleSaveProgress}
          answers={answers ? answers : PreguntasData}
          setAnswers={setAnswers}
          setDones={setDones}
          setResultado={setResultado}
          resultado={resultado ? resultado : []}
          handleSaveResultado={handleSaveResultado}
          loggedIn={loggedIn}
          onTabClick={onTabClick}
        />
      );
    case "results":
      return <Results onTabClick={onTabClick} />;
    case "user":
      return <Users db={db} onTabClick={onTabClick} user={user}/>;
    default:
      return null;
  }
};

export default PageContent;
