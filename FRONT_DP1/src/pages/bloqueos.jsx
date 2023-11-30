import BarraSuperior from "../components/barraSuperior/barraSuperior";
import Box from "@mui/material/Box";
import colores from "../colors/colores";
import Container from "@mui/material/Container";
import InputWithIcon from "../components/inputStandar/inputStandar";
import BotonVerde from "../components/botonVerde/botonVerde";
import ContenedorTabla from "../components/contenedorTabla/contenedorTabla";
import InputFecha from "../components/inputFecha/inputFecha";
import { useEffect, useState } from "react";
import { axiosGetBloqueo } from "../api/AxiosBloqueo";

const estilosContenedorBloqueo = {
  backgroundColor: colores.blanco,
  padding: "25px",
  borderRadius: "10px",
  width: "100%",
};

function Bloqueos() {
  const [bloqueos, setBloqueos] = useState([]);
  const [tiempoInicial, setTiempoInicial] = useState(new Date());

  const getListaBloqueos = async () => {
    try {
      const response = await axiosGetBloqueo();
      const list = response.data;
      setBloqueos(list);
      console.log(response.data)
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  const manejarCambioFecha = (nuevaFecha) => {
    setTiempoInicial(nuevaFecha);
  };

  useEffect(() => {
    getListaBloqueos(); // Llamar a la función asincrónica aquí
  }, []); // Pasa un array vacío como segundo argumento

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
          <h2 className="tituloPagina">BLOQUEOS</h2>
          <BotonVerde texto={"Ingresar bloqueo"} camino={"NuevoBloqueo"} />
          <Container sx={estilosContenedorBloqueo}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "150px",
              }}
            >
              <InputFecha texto={"Fecha Inicio"} onCambiarFecha={manejarCambioFecha}/>
              <InputFecha texto={"Fecha Fin"} onCambiarFecha={manejarCambioFecha}/>
            </div>
          </Container>
          <ContenedorTabla
            titulo={"Bloqueos"}
            descripcion={"Histórico de bloqueos reportados"}
            tipo={"bloqueo"}
            datos={bloqueos}
          />
        </Box>
      </Box>
    </div>
  );
}

export default Bloqueos;
