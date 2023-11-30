import * as React from "react";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";

function TiempoActual({ simulacionEnCurso, fechaSeleccionada}) {
  // let tiempo = 0;
  // if (simulacionEnCurso) tiempo = 504;
  const minutosSimulados = 10080;
  const minutosReales = 20;
  const velocidadSimulacion = minutosSimulados/minutosReales;

  const [tiempoInicial, setTiempoInicial] = useState(fechaSeleccionada || new Date());
  const tiempoActual = new Date();
  const tiempoTranscurrido = (tiempoActual.getTime() - tiempoInicial.getTime())*velocidadSimulacion;
  const tiempoSimulado = new Date(tiempoInicial.getTime() + tiempoTranscurrido);
  useEffect(() => {
    let intervalo;

    // if (simulacionEnCurso) {
    //   intervalo = setInterval(() => {
    //     setTiempoInicial((prevTiempo) => new Date(prevTiempo.getTime() + 1000));
    //   }, 1000 - 1000 * tiempo);
    // } 
    if (simulacionEnCurso) {
      intervalo = setInterval(() => {
        setTiempoInicial((prevTiempo) => new Date(prevTiempo.getTime() + 1000 * velocidadSimulacion));
      }, 1000);
    } 

    return () => {
      clearInterval(intervalo);
    };
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
        label="Fecha"
        value={tiempoInicial.toLocaleDateString()}
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        id="outlined-read-only-input"
        label="Hora"
        // value={tiempoActual.toLocaleTimeString()}
        value={tiempoInicial.toLocaleTimeString()}
        InputProps={{
          readOnly: true,
        }}
      />
    </div>
  );
}

export default TiempoActual;
