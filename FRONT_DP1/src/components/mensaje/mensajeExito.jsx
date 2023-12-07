import * as React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export default function MensajeExito({ texto }) {
  const [mostrarMensaje, setMostrarMensaje] = React.useState(true);

  React.useEffect(() => {
    // Configura un temporizador para ocultar el mensaje después de 5 segundos
    const timeoutId = setTimeout(() => {
      setMostrarMensaje(false);
    }, 5000);

    // Limpia el temporizador cuando el componente se desmonta o cuando texto cambia
    return () => clearTimeout(timeoutId);
  }, [texto]);
  return (
    <div className={`contenedorMensaje ${mostrarMensaje ? "" : "oculto"}`}>
      <Stack sx={{ width: "100%" }} spacing={2}>
        <Alert variant="filled" severity="success">
          {texto}
        </Alert>
      </Stack>
    </div>
  );
}

