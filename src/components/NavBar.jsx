import * as React from "react";
import DonesEspirituales from "../assets/pictures/dones-espirituales.png";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { Button } from "@mui/material";
import Popover from "./Popover";
import { Link } from "react-router-dom";
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
        <Link
          style={{
            margin: "2rem",
            color: "var(--fondo)",
            background: "var(--activo)"
          }}
          to="/"
        >
          <Avatar alt="dones" src={DonesEspirituales} />
        </Link>
        <h2>{props.title}</h2>
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
          <a className="boton" variant="contained" href="test">
            Nuevo Test
          </a>
        )}
      </Stack>
    </>
  );
}
