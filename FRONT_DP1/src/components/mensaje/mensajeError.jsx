import * as React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export default function MensajeError({texto}) {
  return (
    <div className="contenedorMensaje">
      <Stack sx={{ width: "100%" }} spacing={2}>
        <Alert variant="filled" severity="error">
          {texto}
        </Alert>
      </Stack>
    </div>
  );
}
