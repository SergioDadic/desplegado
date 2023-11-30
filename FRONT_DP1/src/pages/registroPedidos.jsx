import React, { useState } from "react";
import BarraSuperior from "../components/barraSuperior/barraSuperior";
import Box from "@mui/material/Box";
import colores from "../colors/colores";
import Container from "@mui/material/Container";
import BotonVerde from "../components/botonVerde/botonVerde";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import BotonBordeado from "../components/botonVerde/botonBordeado";
import ContenedorRegistro from "../components/contenedorRegistro/contenedorRegistro";
import { axiosSetPedido } from "../api/AxiosPedido";
import MensajeExito from "../components/mensaje/mensajeExito";
import MensajeError from "../components/mensaje/mensajeError";

const estiloContenedorBotones = {
  // backgroundColor: colores.blanco,
  padding: "25px",
  borderRadius: "10px",
  width: "100%",
  display: "flex",
  justifyContent: "end",
};
const estiloVerde = {
  backgroundColor: colores.secundario,
  padding: "1px",
  borderRadius: "25px 25px 0px 0px",
  width: "100%",
  marginTop: "20px",
  color: colores.blanco,
};
const estiloBlanco = {
  backgroundColor: colores.blanco,
  padding: "20px",
  borderRadius: "0px 0px 25px 25px",
  width: "100%",
};

function RegistroPedidos() {
  const [idCliente, setIdCliente] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [tiempoLim, setTiempoLim] = useState(0);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);

  //Snackbars
  const [snackbarPosi, setSnackbarPosi] = useState(false);
  const [snackbarNega, setSnackbarNega] = useState(false);

  const fechaActual = new Date();
  const fechaLim = new Date();

  let nuevaHora = parseInt(fechaActual.getHours()) + parseInt(tiempoLim);
  fechaLim.setHours(nuevaHora);

  const fechaAString =
    fechaActual.toLocaleDateString() +
    " " +
    fechaActual.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const fechaLString =
    fechaLim.toLocaleDateString() +
    " " +
    fechaLim.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const estructura = {
      idPedido: idCliente,
      cantidadPedido: parseFloat(cantidad),
      fechaRecibida: fechaAString,
      horaEstimadaDeEntregaMaxima: fechaLString,
      pos_x: parseFloat(posX),
      pos_y: parseFloat(posY),
    };
    console.log(estructura);
    try {
      const response = await axiosSetPedido(estructura);
      setSnackbarPosi(true);
      console.log("Se ha insertado el pedido");
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      setSnackbarNega(true);
    }
  };

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
          <h2 className="tituloPagina">NUEVO PEDIDO</h2>
          <form onSubmit={handleSubmit}>
            <Container sx={estiloVerde}>
              <h3 style={{ margin: "5px" }}>Datos del Pedido</h3>
            </Container>
            <Container sx={estiloBlanco}>
              <div className="distribucionRegistro">
                <TextField
                  required
                  id="outlined-required"
                  type="text"
                  label="ID Cliente (c-1)"
                  onChange={(e) => setIdCliente(e.target.value)}
                />
                <TextField
                  required
                  id="outlined-required"
                  type="text"
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*[.,]?[0-9]*",
                  }}
                  label="Cantidad (m3)"
                  onChange={(e) => setCantidad(e.target.value)}
                />
                <TextField
                  required
                  id="outlined-required"
                  type="number"
                  label="Tiempo Limite de Entrega (hr)"
                  onChange={(e) => setTiempoLim(e.target.value)}
                />
              </div>
            </Container>
            <Container sx={estiloVerde}>
              <h3 style={{ margin: "5px" }}>Datos de ubicación</h3>
            </Container>
            <Container sx={estiloBlanco}>
              <div className="distribucionRegistro">
                <TextField
                  required
                  id="outlined-required"
                  type="number"
                  label="Posición X"
                  onChange={(e) => setPosX(e.target.value)}
                />
                <TextField
                  required
                  id="outlined-required"
                  type="number"
                  label="Posición Y"
                  onChange={(e) => setPosY(e.target.value)}
                />
              </div>
            </Container>
            <Container
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "end",
                marginTop: "15px",
                gap: "8px",
              }}
            >
              <Button
                variant="outlined"
                color="success"
                // onClick={() => navigate("/" + removeDiacritics(camino))}
              >
                cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="success"
                // onClick={() => navigate("/" + removeDiacritics(camino))}
              >
                registrar
              </Button>
            </Container>
          </form>
        </Box>
      </Box>
      {/* SNACKBARS */}
      {snackbarPosi && <MensajeExito texto="Pedido registrado con éxito" />}
      {snackbarNega && (
        <MensajeError texto="Pedido no registrado, intente de nuevo" />
      )}
    </div>
  );
}

export default RegistroPedidos;
