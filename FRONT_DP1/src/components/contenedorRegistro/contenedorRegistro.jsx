import * as React from "react";
import colores from "../../colors/colores";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import "./contenedorRegistro.css";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputFecha from "../inputFecha/inputFecha";
import InputHora from "../inputHora/inputHora";
import InputSelect from "../inputSelect/inputSelect";
import InputWithIcon from "../inputStandar/inputStandar";
import TablaSelect from "../tabla/tablaSelect";
// import FormBloqueos from "../registros/formBloqueos";

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
const tipoVehiculos = [
  {
    value: 1,
    label: "TA",
  },
  {
    value: 2,
    label: "TB",
  },
  {
    value: 3,
    label: "TC",
  },
  {
    value: 4,
    label: "TD",
  },
];
function ContenedorRegistro(props) {
  // { numero, titulo, tipoRegistro }
  let contenido;
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = React.useState("");

  if (props.tipoRegistro == "datosPedido") {
    contenido = (
      <div className="distribucionRegistro">
        <TextField
          required
          id="outlined-required"
          label="ID Pedido"
          defaultValue="00008"
          //   inputProps={{ inputMode: "numeric", pattern: "[0,9]*" }}
        />
        <TextField
          required
          id="outlined-required"
          label="ID Cliente"
          defaultValue="00008"
          //   inputProps={{ inputMode: "numeric", pattern: "[0,9]*" }}
        />
        <TextField
          required
          id="outlined-required"
          label="Cantidad (m3)"
          defaultValue="25"
        />
        <TextField
          required
          id="outlined-required"
          label="Tiempo Limite de Entrega (hr)"
          defaultValue="5"
        />
      </div>
    );
  } else if (props.tipoRegistro == "datosUbicacion") {
    contenido = (
      <div className="distribucionRegistro">
        <TextField
          required
          id="outlined-required"
          label="Posición X"
          defaultValue="00008"
          //   inputProps={{ inputMode: "numeric", pattern: "[0,9]*" }}
        />
        <TextField
          required
          id="outlined-required"
          label="Posición Y"
          defaultValue="5"
        />
      </div>
    );
  } else if (props.tipoRegistro == "vehiculo") {
    contenido = (
      <div className="distribucionRegistro">
        <InputSelect
          texto={"Tipo Vehiculo"}
          opciones={tipoVehiculos}
          valorSeleccionado={vehiculoSeleccionado}
          onCambiarValor={setVehiculoSeleccionado}
        />
        <TextField
          required
          id="outlined-required"
          label="Carga GLP (m3)"
          defaultValue="25"
          //   inputProps={{ inputMode: "numeric", pattern: "[0,9]*" }}
        />
        <TextField
          required
          id="outlined-required"
          label="Peso Bruto Tara (Ton)"
          defaultValue="2.5"
        />
        <TextField
          required
          id="outlined-required"
          label="Peso Carga GLP (Ton)"
          defaultValue="12.5"
        />
        <TextField
          required
          id="outlined-required"
          label="Peso Combinado (Ton)"
          defaultValue="15.0"
        />
      </div>
    );
  } else if (props.tipoRegistro == "mantenimiento") {
    contenido = (
      <div className="distribucionMantenimiento">
        <div className="distribucionMantenimientoFiltros">
          <InputFecha texto={"Fecha de Mantenimiento"} />
          <InputSelect
            texto={"Tipo Vehiculo"}
            opciones={tipoVehiculos}
            valorSeleccionado={vehiculoSeleccionado}
            onCambiarValor={setVehiculoSeleccionado}
          />
          <InputWithIcon texto={"Ingrese la placa:"} />
        </div>
        <div>
          <TablaSelect />
        </div>
      </div>
      
    );
  } else {
    contenido = <div>error</div>;
  }

  return (
    <div>
      <Container sx={estiloVerde}>
        <h3 style={{ margin: "5px" }}>{props.titulo}</h3>
      </Container>
      <Container sx={estiloBlanco}>{contenido}</Container>
    </div>
  );
}

export default ContenedorRegistro;
