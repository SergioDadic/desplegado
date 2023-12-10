import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import axiosClient from "../../api/AxiosClient";
import { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { axiosCliente } from "../../services/axiosCliente";

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

export default function ModalVariosPedidos() {
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
  //Subida de archivos
  const [file, setFile] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      console.error("Seleccione un archivo antes de cargar");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      setOpenModal(true);

      const response = await axiosCliente().post("/api/v1/simulacion/diaria/pedidoTiempoReal",formData,
          {
              headers: {
                  "Content-Type": "multipart/form-data",
              },
          }
      );
      if(response){
          console.log("Se han cargado los archivos");
          const data = response.data;
      }
      // setLoading(true);
      // setOpenModal(true);
      // const response = await axiosClient.post(
      //   "back/api/v1/simulacion/diaria/pedidoTiempoReal",
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //     onUploadProgress: (progressEvent) => {
      //       const percentCompleted = Math.round(
      //         (progressEvent.loaded * 100) / progressEvent.total
      //       );
      //       setProgress(percentCompleted);
      //     },
      //   },
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );
      const data = response.data;
      console.log(data);
      handleClose();
    } catch (error) {
      console.error("Error al cargar pedidos: ", error);
    } finally {
      setLoading(false);
      setOpenModal(false);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        // color="success"
        endIcon={<CloudUploadIcon />}
        style={{ width: "100%" }}
        onClick={handleOpen}
      >
        Cargar Pedidos
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
              Registro de pedidos
            </Typography>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <TextField
                type="file"
                accept=".txt"
                onChange={handleFileChange}
              />
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
