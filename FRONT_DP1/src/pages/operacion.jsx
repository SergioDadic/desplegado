import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import BarraSuperior from "../components/barraSuperior/barraSuperior";
import Simulacion from "./simulacionS";
import Grilla from "../components/grilla/grilla";
import Box from "@mui/material/Box";
import colores from "../colors/colores";
import DrawerDerecho from "../components/drawerDerecho/drawerDerecho";
import TipoSimulacion from "../components/inputSelect/inputSelect";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import InicioSimulacion from "@mui/icons-material/PlayArrow";
import Button from "@mui/material/Button";
import Leyenda from "../components/drawerDerecho/leyenda";
import "../index.css";
import TiempoActual from "../components/drawerDerecho/tiempoActual";
import Divider from "@mui/material/Divider";
import CarCrashIcon from "@mui/icons-material/CarCrash";
import ModalIncidencia from "../components/modal/modalIncidencia";
import CollapsibleTable from "../components/tabla/tablaCollapsible";
// import CollapsibleTable from "../components/tabla/tablaOperaciones";

function Operacion() {
  const location = useLocation();
  const fechaInicio = location.state.auxDate;
  const ancho = 70, alto = 50, scale = 11.5;

  const [buttonClicked, setButtonClicked] = useState(false);
  const [simulacionEnCurso, setSimulacionEnCurso] = useState(false);

  //Variables para el Path
  const [fechaSimulacion, setFechaSimulacion] = useState({
    anio: 0,
    mes: 0,
    dia: 0,
    hora: 0,
    minuto: 0,
  });

  //MODAL DE FIN
  const [mostrarModal, setMostrarModal] = useState(false);
  const [condicion, setCondicion] = useState(false);
  let mensajeSnackbar = "";
  useEffect(() => {
    if (condicion) {
      setMostrarModal(true);
    }
  }, [condicion]);

  //Manejo de la simulación
  //const [estructuraDibujo, setEstructuraDibujo] = useState(objetoOperacion);

  /************CRONOMETRO************/
  


  return (
    <div style={{ backgroundColor: colores.fondo, minHeight: "100vh" }}>
      <Box sx={{ display: "flex" }}>
        <BarraSuperior />
        <Box component="main" sx={{ flexGrow: 1, p: 3, paddingTop: 8 }}>
          <div style={{ display: "flex", flexDirection: "row", gap: "39%" }}>
            <h2 style={{width:"50%"}} className="tituloPagina">OPERACIÓN DÍA A DÍA</h2>
            <TiempoActual simulacionEnCurso={simulacionEnCurso} />
          </div>
          <div style={{ display: "flex", gap: "62%", paddingLeft: "1%" }}>
            <Grilla width={ancho} height={alto} scale={scale} />
            {/* <Simulacion
              ancho={ancho}
              alto={alto}
              escala={scale}
              tiempoInicial={tiempoSimulacion}
              // setInfoTabla={setInfoTabla}
            /> */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                gap: "8px",
                justifyContent: "center",
              }}
            >
              <ModalIncidencia />
              <Box sx={{ display: "flex", alignItems: "end" }}>
                <Leyenda />
              </Box>
            </div>
          </div>
        </Box>
      </Box>
    </div>
  );
}

export default Operacion;
