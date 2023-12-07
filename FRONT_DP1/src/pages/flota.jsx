import React, { useState } from "react";
import BarraSuperior from "../components/barraSuperior/barraSuperior";
import {
  Box,
  Button,
  Divider,
  LinearProgress,
  ListSubheader,
  Modal,
  TextField,
} from "@mui/material";
import fondo from "../img/fondo.png";
import colores from "../colors/colores";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InicioSimulacion from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/AxiosClient";
import MensajeExito from "../components/mensaje/mensajeExito";
import ModalFlota from "../components/modal/modalRegistroFlota";

let mensajeSnackbar = "";

function Flota() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/Seguimiento");
  };
  // Subida de archivos
  const [files, setFiles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    setFiles([...files, ...selectedFiles]);
  };

  const handleUploadArchivos = async () => {
    if (files.length === 0) {
      console.error("Seleccione al menos un archivo antes de cargar");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      setLoading(true);
      const response = await axiosClient.post(
        "/back/api/v1/SubidaDeArchivos/subidaDeArchivos",
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
        }
      );
      mensajeSnackbar = "Archivos subidos con éxito";
      const data = response.data;
      console.log(data);
      setOpenModal(true);
      setActivFlota(true);
      setActivArch(true);
    } catch (error) {
      console.error("Error al cargar archivos: ", error);
    } finally {
      // setLoading(false);
      // setOpenModal(false);
    }
  };

  //Carga flota
  const [activContinua, setActivContinua] = useState(false);
  const [activFlota, setActivFlota] = useState(false);
  const [activArch, setActivArch] = useState(false);

  return (
    <div style={{ backgroundColor: colores.fondo, minHeight: "100vh" }}>
      <Box sx={{ display: "flex" }}>
        <BarraSuperior />
        <Box component="main" sx={{ flexGrow: 1, p: 3, paddingTop: 8 }}>
          <img
            src={fondo}
            alt="Fondo"
            style={{ width: "100%", height: "auto" }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h2 className="tituloPagina">
              Bienvenido al sistema de gestión de entregas - SAG
            </h2>
          </div>

          <Divider light style={{ paddingTop: "16px" }} />
          <ListSubheader style={{ backgroundColor: "#F6F4EB", border: "none" }}>
            Carga de información
          </ListSubheader>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "16px",
              justifyContent: "center",
              alignItems: "center",
            }}
          ></div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "16px",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "16px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <TextField
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                inputProps={{ multiple: true }}
              />
              <Button
                component="label"
                variant="contained"
                disabled={activArch}
                startIcon={<CloudUploadIcon />}
                onClick={handleUploadArchivos}
              >
                Cargar archivos
              </Button>
              {openModal && <MensajeExito texto={mensajeSnackbar} />}
              <ModalFlota
                activFlota={activFlota}
                setActivContinua={setActivContinua}
                setActivFlota={setActivFlota}
              />
              <Button
                component="label"
                variant="contained"
                color="success"
                startIcon={<InicioSimulacion />}
                disabled={!activContinua}
                onClick={handleClick}
              >
                Continuar
              </Button>
            </div>

            {/* <div>
              {loading && (
                <LinearProgress variant="determinate" value={progress} />
              )}
              {openModal && (
                <MensajeExito texto={"Archivos subidos correctamente"} />
              )}
            </div> */}
          </div>
        
        </Box>
      </Box>
      {/* <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div>
          {loading && <LinearProgress variant="determinate" value={progress} />}
          {openModal && (
            <MensajeExito texto={"Archivos subidos correctamente"} />
          )}
        </div>
      </Modal>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div>
          {loading && <LinearProgress variant="determinate" value={progress} />}
          {openModal && <MensajeExito texto={"Flota cargada correctamente"} />}
        </div>
      </Modal> */}
    </div>
  );
}

export default Flota;