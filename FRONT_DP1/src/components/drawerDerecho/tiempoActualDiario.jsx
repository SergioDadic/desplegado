import * as React from "react";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";

function TiempoActualDiario({ simulacionEnCurso, fechaSeleccionada}) {
  const [fechaHora, setFechaHora] = useState(fechaSeleccionada || new Date());

  useEffect(() => {
    if(simulacionEnCurso){
      const intervalId = setInterval(() => {
        setFechaHora((prevFechaHora) => new Date(prevFechaHora.getTime() + 1000));
      }, 1000);

    return () => clearInterval(intervalId);
  }

  }, [simulacionEnCurso]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row", //antes estaba column
        alignItems: "start",
        gap: "15px",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginTop: "10px",
      }}
    >
      <TextField
        id="outlined-read-only-input"
        label="Fecha Simulación"
        value={fechaHora.toLocaleDateString()}
        size="small"
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        id="outlined-read-only-input"
        label="Hora Simulación"
        // value={tiempoActual.toLocaleTimeString()}
        size="small"
        value={fechaHora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        InputProps={{
          readOnly: true,
        }}
      />
    </div>
  );
}

export default TiempoActualDiario;

