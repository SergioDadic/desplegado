import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";

const Cronometro = ({ buttonClicked }) => {
  const [segundos, setSegundos] = useState(0);
  const [activo, setActivo] = useState(false); //al revés?

  useEffect(() => {
    if (buttonClicked) setActivo(true);
    else setActivo(false);
  }, [buttonClicked]);

  useEffect(() => {
    let intervalo;

    if (buttonClicked) {
      intervalo = setInterval(() => {
        setSegundos((prevSegundos) => prevSegundos + 1);
      }, 1000);
    } else {
      clearInterval(intervalo);
    }

    return () => {
      clearInterval(intervalo);
    };
  }, [buttonClicked]);

  const handleIniciarDetener = () => {
    setActivo((prevActivo) => !prevActivo);
  };

  const handleReiniciar = () => {
    setSegundos(0);
    setActivo(false);
  };

  const formatoTiempo = (tiempo) => {
    const minutos = Math.floor(tiempo / 60);
    const segundos = tiempo % 60;

    return `${minutos}:${segundos < 10 ? "0" : ""}${segundos}`;
  };

  return (
    <div>
      <TextField
        label="Tiempo real"
        size="small"
        style={{ width: "100%" }}
        InputProps={{
          readOnly: true,
        }}
        value={formatoTiempo(segundos)}
      />
    </div>
  );
};

export default Cronometro;