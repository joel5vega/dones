import * as React from "react";
import DonesEspirituales from "../assets/pictures/dones-espirituales.svg";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { useAuth } from "../contexts/AuthContext";
import UserProfile from "./auth/UserProfile";
import GoogleSignInButton from "./auth/GoogleSignInButton";

export default function NavBar({ title, onTabClick }) {
  const { user, signInWithGoogle } = useAuth();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      onTabClick("test");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "var(--fondo)",
        position: "fixed",
        zIndex: "1",
        top: "0",
        height: "3rem",
        width: "100%",
        maxWidth: "100%",
        padding: "10px",
      }}
      direction="row"
      spacing={2}
    >
      <Avatar
        className="icon"
        alt="dones"
        src={DonesEspirituales}
        onClick={() => onTabClick("home")}
        sx={{ cursor: "pointer" }}
      />
      <h2>{title}</h2>
      {user ? (
        <UserProfile user={user} onTabClick={onTabClick} />
      ) : (
        <GoogleSignInButton onClick={handleLogin} />
      )}
    </Stack>
  );
}