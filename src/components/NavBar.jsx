import * as React from "react";
import DonesEspirituales from "../assets/pictures/dones-espirituales.png";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { Button } from "@mui/material";
import Popover from "./Popover";
import { height } from "@mui/system";

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
          maxWidth: "100%",
        }}
        direction="row"
        spacing={2}
      >
        <Button href="/">
          <Avatar alt="Remy Sharp" src={DonesEspirituales} />
        </Button>
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

          <a className="boton" variant="contained" href="test" >
         Nuevo Test
        </a>
        )}
      </Stack>
    </>
  );
}
