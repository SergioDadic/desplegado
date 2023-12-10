import * as React from "react";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";

function TiempoActual({ simulacionEnCurso, fechaSeleccionada}) {
  // let tiempo = 0;
  // if (simulacionEnCurso) tiempo = 504;
  const minutosSimuladosPorSemana = 10080; // Una semana tiene 10080 minutos
  const minutosReales = 25; // Representar una semana en 25 minutos reales
  const velocidadSimulacion = minutosSimuladosPorSemana / minutosReales;

  const [tiempoInicial, setTiempoInicial] = useState(fechaSeleccionada || new Date());
  const tiempoActual = new Date();
  const tiempoTranscurrido = (tiempoActual.getTime() - tiempoInicial.getTime())*velocidadSimulacion;
  const tiempoSimulado = new Date(tiempoInicial.getTime() + tiempoTranscurrido);
 
  useEffect(() => {
    let intervalo;
    if (simulacionEnCurso) {
      const minutosSimuladosPorSemana = 7 * 24 * 60; // 7 días
      const minutosReales = 20;
      const velocidadSimulacion = minutosSimuladosPorSemana / minutosReales;
  
      const milisegundosPorMinuto = 1000 * 60;
      const intervaloTiempo = milisegundosPorMinuto / velocidadSimulacion;
  
      intervalo = setInterval(() => {
        setTiempoInicial((prevTiempo) => {
          const tiempoSimulado = new Date(prevTiempo.getTime() + milisegundosPorMinuto);
          return tiempoSimulado;
        });
      }, intervaloTiempo);
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
        label="Fecha Simulación"
        value={tiempoInicial.toLocaleDateString()}
        size="small"
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        id="outlined-read-only-input"
        label="Hora Simulación"
        // value={tiempoActual.toLocaleTimeString()}
        value={tiempoInicial.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        size="small"
        InputProps={{
          readOnly: true,
        }}
      />
    </div>
  );
}

export default TiempoActual;

