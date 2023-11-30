import * as React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export default function MensajeExito({texto}) {
  return (
    <div className="contenedorMensaje">
      <Stack sx={{ width: "100%" }} spacing={2}>
        <Alert variant="filled" severity="success">
          {texto}
        </Alert>
      </Stack>
    </div>
  );
}
