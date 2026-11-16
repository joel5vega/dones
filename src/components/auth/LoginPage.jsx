import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // ajusta la ruta si hace falta
import GoogleSignInButton from "./GoogleSignInButton";
import UserProfile from "./UserProfile";

const LoginPage = () => {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/entrar"); // RedirectAfterLogin decide perfil vs test
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      {user ? (
        <UserProfile user={user} />
      ) : (
        <GoogleSignInButton onClick={handleGoogleSignIn} />
      )}
    </div>
  );
};

export default LoginPage;