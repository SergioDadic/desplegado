import React from "react";
import BarraSuperior from "../components/barraSuperior/barraSuperior";
import Box from "@mui/material/Box";
import colores from "../colors/colores";
import Container from "@mui/material/Container";
import BotonVerde from "../components/botonVerde/botonVerde";
import BotonBordeado from "../components/botonVerde/botonBordeado";
import ContenedorRegistro from "../components/contenedorRegistro/contenedorRegistro";

const estiloContenedorBotones = {
    // backgroundColor: colores.blanco,
    padding: "25px",
    borderRadius: "10px",
    width: "100%",
    display: "flex",
    justifyContent: "end",
  };

function registroMantenimiento() {
  return (
    <div
      style={{
        backgroundColor: colores.fondo,
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <Box sx={{ display: "flex" }}>
        <BarraSuperior />
        <Box component="main" sx={{ flexGrow: 1, p: 3, paddingTop: 8 }}>
          <h2 className="tituloPagina">NUEVO MANTENIMIENTO</h2>
          <ContenedorRegistro
            numero={"1"}
            titulo={"Datos del Mantenimiento"}
            tipoRegistro={"mantenimiento"}
          />
          <Container sx={estiloContenedorBotones}>
            <BotonBordeado texto={"cancelar"} camino={"NuevoMantenimiento"} />
            <BotonVerde texto={"registrar"} camino={"Mantenimiento"} />
          </Container>
        </Box>
      </Box>
    </div>
  )
}

export default registroMantenimiento