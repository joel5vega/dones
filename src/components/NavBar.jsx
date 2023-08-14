import * as React from "react";
import DonesEspirituales from "../assets/pictures/dones-espirituales.svg";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { Link, useNavigate } from "react-router-dom";
import UserProfile from "./auth/UserProfile";
import GoogleSignInButton from "./auth/GoogleSignInButton";
export default function ImageAvatars(props) {
  const navigate = useNavigate();
  const onLogin = () => {
    // navigate("/test");
    console.log("login exitoso");
    props.onTabClick("test");
    props.handleGoogleSignIn();
  };
  return (
    <>
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
          onClick={() => props.onTabClick("home")}
        />
        <h2>{props.title}</h2>
        {/* {props.user&&<button onClick={()=>props.onTabClick('test')}>Test</button>} */}
        {props.user ? (
          <UserProfile user={props.user} />
        ) : (
          <GoogleSignInButton onClick={onLogin} />
        )}
      </Stack>
    </>
  );
}
