import * as React from "react";
import DonesEspirituales from "../assets/pictures/dones-espirituales.png";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { Button } from "@mui/material";
import Popover from "./Popover";
import { Link } from "react-router-dom";
import GoogleSignInButton from "./GoogleSignInButton";

const LoginPage = () => {
  const handleGoogleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        // User is signed in
        const user = result.user;
      })
      .catch((error) => {
        // Handle error
      });
  };


export default function ImageAvatars(props) {
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
          maxWidth: "100%"
        }}
        direction="row"
        spacing={2}
      >
        <Link to="/">
          <Avatar alt="dones" src={DonesEspirituales} />
        </Link>
        <h2>{props.title}</h2>
        <GoogleSignInButton onClick={handleGoogleSignIn} />
        {!props.result ? (
          <Popover
            title="?"
            content={
              <div className="instruccioness">
                <p>Responde honestamente </p>
                <p>No: Totalmente en desacuerdo</p>
                <p>Si: Totalmente de acuerdo</p>
              </div>
            }
          />
        ) : (
          <Link to="/test">
            <div className="boton" variant="contained" onClick={props.action}>
              Nuevo Test
            </div>
          </Link>
        )}
        
      </Stack>
    </>
  );
}
