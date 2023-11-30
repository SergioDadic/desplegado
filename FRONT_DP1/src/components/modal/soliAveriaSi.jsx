import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import InicioSimulacion from "@mui/icons-material/PlayArrow";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { axiosInicializaSimulacion } from "../../api/AxiosSimulacion";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import axiosClient from "../../api/AxiosClient";
import LinearProgress from "@mui/material/LinearProgress";
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
};

export default function SoliAveriaSi(props) {
  const { fechaTP, valorSeleccionado, dateAux } = props;

  const navigate = useNavigate();

  /** MANEJO DE FECHAS **/
  //Formatear fecha
  function formatDate(fecha) {
    const auxDate = fecha.toDate() || new Date();
    let dia = auxDate.getDate().toString().padStart(2, "0");
    let mes = (auxDate.getMonth() + 1).toString().padStart(2, "0");
    let anio = auxDate.getFullYear();
    let hora = auxDate.getHours().toString().padStart(2, "0");
    let minuto = auxDate.getMinutes().toString().padStart(2, "0");
    return `${anio}-${mes}-${dia} ${hora}:${minuto}`;
  }

  /** MANEJO DE MODAL **/
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  const handleOpen = () => {
    if (valorSeleccionado === 2) handleContinue();
    else if (valorSeleccionado === 1) handleContinue();
    // else if (valorSeleccionado === 1) setOpen(true);
  };

  //Para la carga de archivos
  const [file, setFile] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleUploadPedido = async () => {
    if (!file) {
      console.error("Seleccione un archivo antes de cargar");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      setOpenModal(true);
      const response = await axiosClient.post(
        "api/v1/Averia/cargarAveria",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = response.data;
      console.log(data);
      handleContinue();
    } catch (error) {
      console.error("Error al cargar pedidos: ", error);
    } finally {
      setLoading(false);
      setOpenModal(false);
    }
  };

  //Continuar sin registrar
  const handleContinue = () => {
    const auxDate = fechaTP.toDate();
    axiosInicializaSimulacion(7, formatDate(fechaTP))
      .then(() => {
        navigate("/Simulacion", {
          state: {
            valorSeleccionado,
            auxDate, //dateAux,
          },
        });
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  };

  return (
    <div>
      <Button
        variant="contained"
        color="success"
        endIcon={<InicioSimulacion />}
        style={{ width: "55%", marginTop: "20px" }}
        onClick={handleOpen}
      >
        Iniciar Simulación
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            fontWeight="400"
            fontSize={"20px"}
            style={{ color: "#2E7D32" }}
          >
            ¿No desea registrar alguna avería?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            La simulación iniciará a las {formatDate(dateAux)}
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "16px",
              gap: "8px",
            }}
          >
            {/* <TextField type="file" accept=".txt" onChange={handleFileChange} />
            <Button
              component="label"
              variant="contained"
              style={{ width: "100%" }}
              startIcon={<CloudUploadIcon />}
              onClick={handleUploadPedido}
            >
              Subir archivo de averías
            </Button> */}
            <Button
              variant="contained"
              color="success"
              onClick={handleContinue}
              style={{ width: "100%" }}
            >
              No, iniciar simulación
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleClose}
              style={{ width: "100%" }}
            >
              Cancelar
            </Button>
          </div>
        </Box>
      </Modal>
      {loading && <LinearProgress variant="determinate" value={progress} />}
      {openModal && <MensajeExito texto={"Archivo subido correctamente"} />}
    </div>
  );
}
