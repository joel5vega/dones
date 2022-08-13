import * as React from "react";
import DonesEspirituales from "../assets/pictures/dones-espirituales.png";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { Button } from "@mui/material";
import Popover from "./Popover";
import { height } from "@mui/system";

export default function ImageAvatars() {
  return (
    <Stack
      sx={{
        alignItems: "center",
        background: "var(--fondo)",
        position: "fixed",
        zIndex: "1",
        top: "0",
        height:"3rem"
      }}
      direction="row"
      spacing={2}
    >
      <Button href="/">
        <Avatar alt="Remy Sharp" src={DonesEspirituales} />
      </Button>
      <h2>Test de dones</h2>
      <Popover
        title="Instrucciones"
        content={
          <div className="instruccioness">
            <p>Responde honestamente </p>
            <p>1:Totalmente en desacuerdo</p>
            <p>5:Totalmente de acuerdo</p>
          </div>
        }
      />
    </Stack>
  );
}
