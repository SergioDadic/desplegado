import * as React from "react";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import BarraSuperior from "../components/barraSuperior/barraSuperior";
import Box from "@mui/material/Box";
import colores from "../colors/colores";
import TipoSimulacion from "../components/inputSelect/inputSelect";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import InicioSimulacion from "@mui/icons-material/PlayArrow";
import Button from "@mui/material/Button";
import "../index.css";
import InputFecha from "../components/inputFecha/inputFecha";
import TextField from "@mui/material/TextField";
import fondo from "../img/fondo.png";
import { Divider, Grid, ListSubheader, Modal } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { axiosInicializaSimulacion } from "../api/AxiosSimulacion";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ModalAveria from "../components/modal/modalAveria";
import SoliAveriaSi from "../components/modal/soliAveriaSi";
import SoliAveriaOp from "../components/modal/soliAveriaOp";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import axiosClient from "../api/AxiosClient";
import { axiosSetCargaMasivaPedidos } from "../api/AxiosPedido";
import MensajeExito from "../components/mensaje/mensajeExito";
import useWindowDimensions from '../components/useWindowDimensions'; 

const opciones = [
  { value: 1, label: "Semanal" },
  { value: 2, label: "Colapso" },
];
let dateAux;

function Seguimiento() {
  /*** PARA EL INGRESO DE FECHA ***/
  const fechaAhora = dayjs();
  const [fechaTP, setFechaTP] = useState(fechaAhora);
  dateAux = fechaTP;

  const navigate = useNavigate();

  const [valorSeleccionado, setValorSeleccionado] = React.useState("");
  const [tiempoSimu, setTiempoSimu] = useState(new Date()); //Fecha de las simulación
  const [tiempoOpe, setTiempoOpe] = useState(new Date()); //Fecha de las operaciones diarias

  const [mostrarComponente, setMostrarComponente] = useState(false);
  const [simulacionEnCurso, setSimulacionEnCurso] = useState(false);

  const [tiempoSimulacion, setTiempoSimulacion] = useState({
    anio: 0,
    mes: 0,
    dia: 0,
    hora: 0,
    minuto: 0,
  });

  const manejarTiempo = (nuevoTiempo) => {
    setTiempoSimulacion(nuevoTiempo);
  };
  const [accionado, setAccionado] = useState(false);
  const [iniciado, setIniciado] = useState(true);
  //Iniciar simu semanal
  const handleClickSimu = () => {
    const auxDate = fechaTP.toDate();
    let dia = auxDate.getDate().toString().padStart(2, "0");
    let mes = (auxDate.getMonth() + 1).toString().padStart(2, "0");
    let anio = auxDate.getFullYear();
    let hora = auxDate.getHours().toString().padStart(2, "0");
    let minuto = auxDate.getMinutes().toString().padStart(2, "0");

    const fecha = `${anio}-${mes}-${dia} ${hora}:${minuto}`;
    axiosInicializaSimulacion(7, fecha)
      .then(() => {
        setIniciado(true);
        navigate("/Simulacion", {
          state: {
            valorSeleccionado,
            auxDate,
          },
        });
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  };

  //Subida de archivos
  const [file, setFile] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
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
        "api/v1/Pedido/CargaMasivaPedidos",
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
    } catch (error) {
      console.error("Error al cargar pedidos: ", error);
    } finally {
      setLoading(false);
      setOpenModal(false);
    }
  };
  const handleUploadAverias = async () => {
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
    } catch (error) {
      console.error("Error al cargar pedidos: ", error);
    } finally {
      setLoading(false);
      setOpenModal(false);
    }
  };

  //Iniciar operacion dia a dia
  const handleClickOperacion = () => {
    axiosInicializaSimulacion(1, "2023-03-13 00:01") //Colocar Fecha
      .then(() => {
        setIniciado(true);
        navigate("/Operacion", {
          state: {
            iniciado,
            tiempoSimulacion,
          },
        });
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
    // setMostrarComponente(true);
    getHandshake();
    const tiempoActual = new Date();
    const nuevoTiempo = {
      anio: tiempoActual.getFullYear(),
      mes: tiempoActual.getMonth() + 1,
      dia: tiempoActual.getDate(),
      hora: tiempoActual.getHours(),
      minuto: tiempoActual.getMinutes(),
    };
    manejarTiempo(nuevoTiempo);
    if (iniciado) {
      setSimulacionEnCurso(true);
      navigate("/Operacion", {
        state: {
          // mostrarComponente,
          simulacionEnCurso,
          // valorSeleccionado,
          iniciado,
          tiempoSimulacion,
        },
      });
    }
  };

  /**AXIOS**/
  async function getHandshake() {
    // return axiosInicializaSimulacion(1, fecha)
    return axiosInicializaSimulacion(1, "2023-03-13 00:01")
      .then(() => {
        setIniciado(true);
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  }
  const calcularScaleInicial = (windowWidth) => {
    // Define tu lógica para calcular el scale inicial, podría ser proporcional al ancho de la ventana
    return windowWidth / 130; // Este es solo un ejemplo, ajusta según tus necesidades
  };

  const widthV = useWindowDimensions(); // Asume que esta función obtiene las dimensiones de la ventana
  const [scale, setScale] = useState(11); // Define una función para calcular el scale inicial

  useEffect(() => {
    //console.log("entra al useEffect", widthV, scale);
    const initialScale = calcularScaleInicial(widthV);
    //console.log("Initial Scale:", initialScale);
    setScale(initialScale);
  
    const handleResize = () => {
      const newScale = calcularScaleInicial(widthV);
     // console.log("New Scale:", newScale);
      setScale(newScale);
    };
  
    window.addEventListener("resize", handleResize);
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [widthV]);

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
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Ingrese fecha y hora"
                  value={fechaTP}
                  onChange={(newValue) => {
                    setFechaTP(newValue);
                    dateAux = fechaTP.toDate();
                  }}
                  format="DD/MM/YYYY HH:mm"
                />
              </LocalizationProvider>
            </div>
            <Grid container spacing={2} style={{ justifyContent: "center" }}>
              <Grid item xs={6}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="start"
                  paddingLeft={"50%"}
                >
                  <h4 className="tituloPagina">OPERACIONES DIARIAS</h4>
                  <SoliAveriaOp fechaTP={fechaTP} dateAux={dateAux} scale={scale}/>
                </Box>
              </Grid>
              <Grid
                item
                xs={6}
                style={{ justifyContent: "start", paddingLeft: "32px" }}
              >
                <h4 className="tituloPagina">SIMULACIÓN</h4>
                <div
                  style={{ display: "flex", flexDirection: "row", gap: "50px" }}
                ></div>
                <div style={{ width: "50%" }}>
                  <TipoSimulacion
                    texto="Tipo de Simulación"
                    opciones={opciones}
                    valorSeleccionado={valorSeleccionado}
                    onCambiarValor={setValorSeleccionado}
                  />
                </div>
                {scale ? (
                  <SoliAveriaSi
                    fechaTP={fechaTP}
                    valorSeleccionado={valorSeleccionado}
                    dateAux={dateAux}
                    scale={scale}
                  />
                ) : null}
                {/* <ModalAveria simuop={valorSeleccionado} setAccionado={setAccionado}/> */}
              </Grid>
            </Grid>
          </div>
          {/* <Divider light style={{ paddingTop: "16px" }} /> */}
          {/* <ListSubheader style={{ backgroundColor: "#F6F4EB", border: "none" }}>
            Carga de información
          </ListSubheader> */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "16px",
              justifyContent: "center",
              alignItems: "center",
            }}
          ></div>
          {/* <div
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
              />
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={handleUploadPedido}
              >
                Pedidos
              </Button>
            </div>
          </div> */}
        </Box>
      </Box>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div>
          {loading && <LinearProgress variant="determinate" value={progress} />}
          {openModal && <MensajeExito texto={"Archivo subido correctamente"}/>}
        </div>
      </Modal>
    </div>
  );
}

export default Seguimiento;
