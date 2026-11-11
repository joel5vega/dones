<<<<<<< HEAD
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
=======
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/pictures/dones-espirituales.svg";
import { useAuth } from "../contexts/AuthContext";
import GoogleSignInButton from "./GoogleSignInButton";

const barSx = {
  justifyContent: "space-between",
  alignItems: "center",
  background: "var(--fondo)",
  position: "fixed",
  zIndex: 100,
  top: 0,
  height: "64px",
  width: "100%",
  padding: "0 24px",
  borderBottom: "1px solid rgba(230, 239, 233, 0.1)",
  backdropFilter: "blur(8px)",
};

export default function NavBar({ title }) {
  const { user, signInWithGoogle, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const login = async () => {
    try {
      await signInWithGoogle();
      navigate("/test");
    } catch (e) {
      console.error("Login failed:", e);
    }
  };

  const handleLogout = async () => {
    handleClose();
    try {
      await logout();
      navigate("/"); // Redirige al inicio al salir
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

 return (
    <Stack sx={barSx} direction="row" spacing={2}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
        <Avatar alt="dones" src={logo} sx={{ width: 40, height: 40 }} />
        <h2 style={{ fontSize: "18px", fontWeight: "700", margin: 0, color: "var(--primario)" }}>
          {title || "Dones Espirituales"}
        </h2>
      </Link>
      
      <div>
        {user ? (
          <>
            <button 
              onClick={handleClick} 
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
              aria-label="Opciones de usuario"
            >
              {/* ✨ AQUÍ ESTÁ EL CAMBIO: Si no hay foto, usamos un Avatar con el icono */}
              <Avatar 
                src={user.photoURL} 
                sx={{ 
                  width: 36, 
                  height: 36, 
                  border: "2px solid var(--resaltar)",
                  bgcolor: "var(--fondo-suave)",
                  color: "var(--primario)"
                }}
              >
                <FontAwesomeIcon icon={faUser} size="sm" />
              </Avatar>
            </button>

            {/* Menú desplegable */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  backgroundColor: "#0a3d6b", // Un tono un poco más claro que el fondo
                  color: "var(--primario)",
                  border: "1px solid rgba(230, 239, 233, 0.1)",
                  "& .MuiMenuItem-root": {
                    fontSize: "14px",
                    fontWeight: 500,
                    gap: "10px",
                    "&:hover": { backgroundColor: "rgba(230, 239, 233, 0.05)" }
                  }
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <div style={{ padding: "8px 16px 4px", fontSize: "12px", color: "var(--informacion)" }}>
                {user.displayName || "Usuario"}
              </div>
              <Divider sx={{ borderColor: "rgba(230, 239, 233, 0.1)", mb: 1 }} />
              
              <MenuItem onClick={() => navigate("/perfil")}>
                <ListItemIcon sx={{ color: "var(--primario)", minWidth: "auto !important" }}>
                  <FontAwesomeIcon icon={faUser} size="sm" />
                </ListItemIcon>
                Mi Perfil
              </MenuItem>
              
              <MenuItem onClick={handleLogout} sx={{ color: "#ff7b7b !important" }}>
                <ListItemIcon sx={{ color: "#ff7b7b", minWidth: "auto !important" }}>
                  <FontAwesomeIcon icon={faArrowRightFromBracket} size="sm" />
                </ListItemIcon>
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </>
        ) : (
          <GoogleSignInButton onClick={login} />
        )}
      </div>
>>>>>>> refactor
    </Stack>
  );
}