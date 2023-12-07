import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CarCrashIcon from "@mui/icons-material/CarCrash";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { axiosSetAveria } from "../../api/AxiosAveria";
import { axiosGetVehiculosDisponibles } from "../../api/AxiosSimulacion";
import GasMeterIcon from "@mui/icons-material/GasMeter";
import { Grid } from "@mui/material";
import { useState } from "react";
import { axiosSetPedido } from "../../api/AxiosPedido";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

export default function ModalPedido() {
  //Variables para el modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  //Para el pedido
  const [idCliente, setIdCliente] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [tiempoLim, setTiempoLim] = useState(0);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);

  //Para obtener fecha actual y tiempo limite
  function formatDate(fechaRec) {
    // const fechaRec = new Date();
    // fechaRec.setHours(fechaRec.getHours() + (parseInt(tiempoLim)/2));
    let dia = fechaRec.getDate().toString().padStart(2, "0");
    let mes = (fechaRec.getMonth() + 1).toString().padStart(2, "0");
    let anio = fechaRec.getFullYear();
    let hora = fechaRec.getHours().toString().padStart(2, "0");
    let minuto = fechaRec.getMinutes().toString().padStart(2, "0");
    let segundo = "00";
    return `${anio}-${mes}-${dia}T${hora}:${minuto}:${segundo}`;
  }

  /*AXIOS*/

  //Guardar incidencia
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fechaRec = new Date();
    const fechaLim = new Date();
    fechaLim.setHours(fechaRec.getHours() + parseInt(tiempoLim));

    const estructura = {
      nombre_pedido: idCliente,
      cantidad_pedido: parseInt(cantidad),
      fecha_recibida: formatDate(fechaRec),
      fecha_maxima_entrega: formatDate(fechaLim),
      pos_x: parseInt(posX),
      pos_y: parseInt(posY),
    };
    console.log(fechaRec);
    console.log(fechaLim);
    try {
      const response = await axiosSetPedido(estructura);
      handleClose();
      console.log("Se ha insertado el pedido");
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="success"
        endIcon={<GasMeterIcon />}
        // style={{ width: "200%" }}
        onClick={handleOpen}
      >
        Registrar Pedido
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={handleSubmit}>
          <Box sx={style}>
            <Typography
              fontWeight="400"
              fontSize={"20px"}
              style={{ color: "#2E7D32" }}
            >
              Registro de pedido
            </Typography>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <TextField
                required
                id="outlined-required"
                type="text"
                label="Cliente (c-1)"
                onChange={(e) => setIdCliente(e.target.value)}
              />
              <TextField
                required
                id="outlined-required"
                type="number"
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
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 8,
                justifyContent: "center",
              }}
            >
              <Button type="submit" variant="contained" color="success">
                Registrar
              </Button>
              <Button variant="contained" color="error" onClick={handleClose}>
                Cancelar
              </Button>
            </div>
          </Box>
        </form>
      </Modal>
    </div>
  );
}
