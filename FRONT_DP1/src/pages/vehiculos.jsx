import BarraSuperior from "../components/barraSuperior/barraSuperior";
import Box from "@mui/material/Box";
import colores from "../colors/colores";
import InputWithIcon from "../components/inputStandar/inputStandar";
import InputSelect from "../components/inputSelect/inputSelect";
import Container from "@mui/material/Container";
import BotonVerde from "../components/botonVerde/botonVerde";
import ContenedorTabla from "../components/contenedorTabla/contenedorTabla";
import * as React from 'react';

const estilosContenedorVehiculo = {
  backgroundColor: colores.blanco,
  padding: "25px",
  borderRadius: "10px",
  width: "100%",
};

const opciones = [
  { value: 10, label: 'Ten' },
  { value: 20, label: 'Twenty' },
  { value: 30, label: 'Thirty' }
];

const tipos = [
  { value: 1, label: 'TA' },
  { value: 2, label: 'TB' },
  { value: 3, label: 'TC' },
  { value: 4, label: 'TD' }
];

function Vehiculos() {
  const [valorSeleccionado, setValorSeleccionado] = React.useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = React.useState('');
  const data = [];

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
          <h2 className="tituloPagina">VEHICULOS</h2>
          {/* <BotonVerde texto={"Ingresar vehiculo"} camino={"NuevoVehiculo"} /> */}
          <Container sx={estilosContenedorVehiculo}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "150px",
              }}
            >
              <InputWithIcon texto={"Ingresar ID del vehículo:"} />
              <InputSelect texto={"Tipo Vehiculo"} opciones={tipos} valorSeleccionado={valorSeleccionado} onCambiarValor={setValorSeleccionado} />
              <InputSelect texto={"Estado"} opciones={opciones} valorSeleccionado={tipoSeleccionado} onCambiarValor={setTipoSeleccionado} />
            </div>
          </Container>
          <ContenedorTabla
            titulo={"Vehículos"}
            descripcion={
              "Histórico de la flota de vehículos pertenecientes a la empresa"
            }
            tipo={"vehiculo"}
            datos={data}
          />
        </Box>
      </Box>
    </div>
  );
}

export default Vehiculos;
