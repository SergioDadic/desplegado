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

const tipoIncidencia = ["TI1", "TI2", "TI3"];
const turnoIncidencia = ["T1", "T2", "T3"];

export default function ModalIncidencia({vehiculos_disponible}) {
  //Variables para el modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  //Para el vehiculo con incidencia
  const [valueVehiculo, setValueVehiculo] = React.useState("");
  const [inputValueVehiculo, setInputValueVehiculo] = React.useState("");
  const [listaVehiculos, setListaVehiculos] = React.useState([]);
  //Para el tipo de incidencia
  const [valueTipo, setValueTipo] = React.useState("");
  const [inputValueTipo, setInputValueTipo] = React.useState("");
  //Para el turno de incidencia
  const [valueTurno, setValueTurno] = React.useState("");
  const [inputValueTurno, setInputValueTurno] = React.useState("");

  /*AXIOS*/

  //Guardar incidencia
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setValueVehiculo("TD99");
    const estructura = {
      turno: valueTurno.toString(),
      matricula: valueVehiculo.toString(),
      tipo: valueTipo.toString(),
    };
    // console.log(estructura);
    try {
      const response = await axiosSetAveria(estructura);
      handleClose();
      console.log("Se ha insertado la incidencia");
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
    }
  };

  //Obtener lista de vehiculos
  const getListaVehiculos = async () => {
    try {
      const response = await axiosGetVehiculosDisponibles();
      const list = response.data;
      setListaVehiculos(list);
      // console.log(response.data)
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  React.useEffect(() => {
    getListaVehiculos(); // Llamar a la función asincrónica aquí
  }, []); // Pasa un array vacío como segundo argumento

  return (
    <div>
      <Button
        variant="contained"
        color="warning"
        endIcon={<CarCrashIcon />}
        // style={{ width: "200%" }}
        onClick={handleOpen}
      >
        Registrar Incidencia
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
              Registro de incidencia
            </Typography>

            <Autocomplete
              value={valueVehiculo}
              onChange={(event, newValue) => {
                setValueVehiculo(newValue);
              }}
              inputValue={inputValueVehiculo}
              onInputChange={(event, newInputValue) => {
                setInputValueVehiculo(newInputValue);
              }}
              id="controllable-states-demo"
              options={vehiculos_disponible}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Vehículo" />
              )}
            />
            <Autocomplete
              value={valueTipo}
              onChange={(event, newValue) => {
                setValueTipo(newValue);
              }}
              inputValue={inputValueTipo}
              onInputChange={(event, newInputValue) => {
                setInputValueTipo(newInputValue);
              }}
              id="controllable-states-demo"
              options={tipoIncidencia}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Tipo de incidencia" />
              )}
            />
            <Autocomplete
              value={valueTurno}
              onChange={(event, newValue) => {
                setValueTurno(newValue);
              }}
              inputValue={inputValueTurno}
              onInputChange={(event, newInputValue) => {
                setInputValueTurno(newInputValue);
              }}
              id="controllable-states-demo"
              options={turnoIncidencia}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Turno de incidencia" />
              )}
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
    </div>
  );
}
