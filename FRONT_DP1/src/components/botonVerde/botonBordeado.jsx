import React from "react";
import Button from "@mui/material/Button";
import "./botonVerde.css";
import { useNavigate } from "react-router-dom";

export default function BotonBordeado(props) {
  const navigate = useNavigate();
  const camino = props.camino;
  function removeDiacritics(text) {
    if (text === "Seguimiento") {
      return "";
    }
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  return (
    <div className="contenedorBotonVerde">
      <Button
        variant="outlined"
        color="success"
        onClick={() => navigate("/" + removeDiacritics(camino))}
      >
        {props.texto}
      </Button>
    </div>
  );
}
