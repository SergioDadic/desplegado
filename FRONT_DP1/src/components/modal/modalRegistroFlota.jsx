import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import VehiculoIcon from "@mui/icons-material/LocalShipping";
import TextField from "@mui/material/TextField";
import Subheader from "../drawerDerecho/subheader";
import { axiosSetFlota } from "../../api/AxiosSimulacion";
import MensajeExito from "../mensaje/mensajeExito";

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

let mensajeSnackbar="";
let listaVehiculos = [];

export default function ModalFlota({
  activFlota,
  setActivContinua,
  setActivFlota,
}) {
  //Variables para el modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openModal, setopenModal] = React.useState(false);
  //Para el vehiculo con incidencia
  const [tipoA, setTipoA] = React.useState(0);
  const [tipoB, setTipoB] = React.useState(0);
  const [tipoC, setTipoC] = React.useState(0);
  const [tipoD, setTipoD] = React.useState(0);

  /*AXIOS*/
  //Guardar vehiculos
  const handleSubmit = async (e) => {
    e.preventDefault();
    let id = 1;
    for (let i = 0; i < tipoA; i++) {
      const estructura = {
        id: id,
        type: 1,
        x: 12,
        y: 8,
        tara: 2.5,
        cargaGLP: 25.0,
        pesoCargaGLP: 12.5,
        pesoCombinado: 15.0,
        tipo: `TA${i + 1}`,
      };
      listaVehiculos.push(estructura);
      id++;
    }
    for (let i = 0; i < tipoB; i++) {
      const estructura = {
        id: id,
        type: 1,
        x: 12,
        y: 8,
        tara: 2.0,
        cargaGLP: 15.0,
        pesoCargaGLP: 7.5,
        pesoCombinado: 9.5,
        tipo: `TB${i + 1}`,
      };
      listaVehiculos.push(estructura);
      id++;
    }
    for (let i = 0; i < tipoC; i++) {
      const estructura = {
        id: id,
        type: 1,
        x: 12,
        y: 8,
        tara: 1.5,
        cargaGLP: 10.0,
        pesoCargaGLP: 5.0,
        pesoCombinado: 6.5,
        tipo: `TC${i + 1}`,
      };
      listaVehiculos.push(estructura);
      id++;
    }
    for (let i = 0; i < tipoD; i++) {
      const estructura = {
        id: id,
        type: 1,
        x: 12,
        y: 8,
        tara: 1.0,
        cargaGLP: 5.0,
        pesoCargaGLP: 2.5,
        pesoCombinado: 3.5,
        tipo: `TD${i + 1}`,
      };
      listaVehiculos.push(estructura);
      id++;
    }
    try {
      const response = await axiosSetFlota(listaVehiculos);
      handleClose();
      console.log("Se ha insertado la informacion");
      setActivContinua(true);
      setActivFlota(false);
      mensajeSnackbar = "Flota cargada con éxito";
      setopenModal(true);
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        endIcon={<VehiculoIcon />}
        style={{ width: "100%" }}
        onClick={handleOpen}
        disabled={!activFlota}
      >
        Flota de vehiculos
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={handleSubmit}>
          <Box sx={style}>
            <div>
              <Typography
                fontWeight="400"
                fontSize={"20px"}
                style={{ color: "#2E7D32" }}
              >
                Cargar flota de vehiculos
              </Typography>

              <i>Coloque la cantidad de vehiculos para la flota de cada tipo</i>
            </div>

            <TextField
              id="outlined-required"
              type="number"
              label="Flota Tipo A"
              onChange={(e) => setTipoA(e.target.value)}
            />
            <TextField
              id="outlined-required"
              type="number"
              label="Flota Tipo B"
              onChange={(e) => setTipoB(e.target.value)}
            />
            <TextField
              id="outlined-required"
              type="number"
              label="Flota Tipo C"
              onChange={(e) => setTipoC(e.target.value)}
            />

            <TextField
              id="outlined-required"
              type="number"
              label="Flota Tipo D"
              onChange={(e) => setTipoD(e.target.value)}
            />

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
      
      {openModal && <MensajeExito texto={mensajeSnackbar} />}
    </div>
  );
}
