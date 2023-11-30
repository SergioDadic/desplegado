import React, { useState } from "react";
import BarraSuperior from "../components/barraSuperior/barraSuperior";
import Box from "@mui/material/Box";
import colores from "../colors/colores";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import BotonBordeado from "../components/botonVerde/botonBordeado";
import ContenedorRegistro from "../components/contenedorRegistro/contenedorRegistro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { axiosSetBloqueo } from "../api/AxiosBloqueo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
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

function RegistroBloqueo() {
  const fechaActual = dayjs();
  const [fInicio, setfInicio] = React.useState(null);
  const [fFin, setfFin] = React.useState(null);
  const [hInicio, sethInicio] = React.useState(null);
  const [hFin, sethFin] = React.useState(null);
  const [ruta, setRuta] = React.useState("");

  //Snackbars
  const [snackbarPosi, setSnackbarPosi] = useState(false);
  const [snackbarNega, setSnackbarNega] = useState(false);

  /* Se formatea la data para tener DD/MM/AAAA HH:MM */
  function formatData(fecha, hora) {
    if (fecha && hora) {
      return (
        fecha.$d.toLocaleDateString() +
        " " +
        hora.$d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }
  }

  let inicioBloqueo = formatData(fInicio, hInicio);
  let finBloqueo = formatData(fFin, hFin);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const estructura = {
      inicioBloqueo: inicioBloqueo,
      finBloqueo: finBloqueo,
      // pos_x: fFin,
      // pos_y: hFin,
      ruta: ruta,
    };
    console.log(estructura);
    try {
      const response = await axiosSetBloqueo(estructura);
      console.log("Respuesta del servidor:", response.data);
      setSnackbarPosi(true);
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
          <h2 className="tituloPagina">NUEVO BLOQUEO</h2>
          <form onSubmit={handleSubmit}>
            <Container sx={estiloVerde}>
              <h3 style={{ margin: "5px" }}>Datos del bloqueo</h3>
            </Container>
            <Container sx={estiloBlanco}>
              <div className="distribucionRegistro">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    required
                    label="Fecha inicio"
                    defaultValue={fechaActual}
                    value={fInicio}
                    onChange={(newValue) => setfInicio(newValue)}
                  />
                  <TimePicker
                    required
                    label="Hora inicio"
                    value={hInicio}
                    onChange={(newValue) => sethInicio(newValue)}
                  />{" "}
                  <DatePicker
                    required
                    label="Fecha fin"
                    value={fFin}
                    onChange={(newValue) => setfFin(newValue)}
                  />
                  <TimePicker
                    required
                    label="Hora fin"
                    value={hFin}
                    onChange={(newValue) => sethFin(newValue)}
                  />
                </LocalizationProvider>

                <TextField
                  id="outlined-helperText"
                  label="Ingrese la ruta"
                  defaultValue="x1,y1,x2,y2,x3,y3...xn,yn"
                  onChange={(newValue) => setRuta(newValue)}
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

export default RegistroBloqueo;
