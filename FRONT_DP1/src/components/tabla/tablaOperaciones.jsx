import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TablePagination from "@mui/material/TablePagination";
import { axiosGetListaVehiculosSeleccionados } from "../../api/AxiosSimulacion";

function createData(name, calories, fat, carbs, protein, price) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: "2020-01-05",
        customerId: "11091700",
        amount: 3,
      },
      {
        date: "2020-01-02",
        customerId: "Anonymous",
        amount: 1,
      },
    ],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.calories}</TableCell>
        <TableCell align="right">{row.fat}</TableCell>
        <TableCell align="right">{row.carbs}</TableCell>
        <TableCell align="right">{row.protein}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Pedidos
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center" style={{ color: "#2E7D32" }}>
                      Cliente
                    </TableCell>
                    <TableCell align="center" style={{ color: "#2E7D32" }}>
                      Ubicación
                    </TableCell>
                    <TableCell align="center" style={{ color: "#2E7D32" }}>
                      Estado
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};
const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0, 3.99),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3, 4.99),
  createData("Eclair", 262, 16.0, 24, 6.0, 3.79),
  createData("Cupcake", 305, 3.7, 67, 4.3, 2.5),
  createData("Gingerbread", 356, 16.0, 49, 3.9, 1.5),
];

/* Variables globales generales*/
let objetoTabla = {
  coordenadasVehiculos: [],
  lineaDeRutas: [],
  puntosDeLlegada: [],
  bloqueos: [],
};

let tiempo_actual_real_unix;
let respuesta_aux_ge;
let respuesta_init_f;
let respuesta_follow_f;

// Bandera para manejar las interrupciones
let bandera_final = false;

// Fecha final
let anio_f;
let mes_f;
let dia_f;
let hora_f;
let minuto_f;
let fecha_f;

export default function CollapsibleTable() {
  /**********************PAGINACIÓN***************************/
  //Paginación tabla
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  /**********************PAGINACIÓN***************************/
  const [tipo, setTipo] = React.useState("");
  const [listaVehiculos, setListaVehiculos] = React.useState([]);

  const [endSimulation, setEndSimulation] = React.useState(false);
  /*Función que ejecuta la simulación*/
  const ejecucionOperacion = async () => {
    //Inializamos fecha final
    //const fechaOriginal = new Date(tiempoIni);
    const fechaOriginal = new Date("2023-03-13 00:01");
    const fechaFin = new Date(fechaOriginal);
    fechaFin.setDate(fechaOriginal.getDate() + 7);

    dia_f = fechaFin.getDate().toString().padStart(2, "0");
    mes_f = (fechaFin.getMonth() + 1).toString().padStart(2, "0");
    anio_f = fechaFin.getFullYear();
    hora_f = fechaFin.getHours().toString().padStart(2, "0");
    minuto_f = fechaFin.getMinutes().toString().padStart(2, "0");

    fecha_f = `${anio_f}-${mes_f}-${dia_f} ${hora_f}:${minuto_f}`;

    // Contiene el tiempo UNIX
    tiempo_actual_real_unix = convertToUnixTime(anio, mes, dia, hora, minuto);

    // Cuantas llamadas se necesitarán para ejecutar la simulación
    let contador_llamadas = 0;
    let numero_maximo_llamadas = 470;

    //Primer llamado para inicializar en el primer punto
    await getVehiculos();

    //Itera llamadas al api y el dibujado
    while (contador_llamadas < numero_maximo_llamadas) {
      respuesta_follow_f = null;
      if (bandera_final) {
        break;
      }
      //Empleando el init
      if (contador_llamadas === 0) {
        //Aquí se inicializa la simulación para cada fecha
        await getVehiculos();
        respuesta_aux_ge = JSON.parse(JSON.stringify(respuesta_init_f));
        break;
      }

      // Hacemos el follow -> follow
      if (contador_llamadas >= 1) {
        contador_llamadas = 1;
        await getVehiculos();
        respuesta_aux_ge = JSON.parse(JSON.stringify(respuesta_init_f));
        // await obtenerElementos(tiempo_actual_real_unix, 60);
      }
      setEndSimulation(false);
      contador_llamadas++;
      await sleep(130);
    }
  };

  /*Función para los tiempos UNIX*/
  function convertToUnixTime(anio, mes, dia, hora, minuto) {
    // Crear una fecha en UTC
    // Nota: JavaScript cuenta los meses desde 0, así que restamos 1 al mes.

    var fecha = Date.UTC(anio, mes - 1, dia, hora, minuto);
    // Convertir la fecha a tiempo Unix
    // Dividimos por 1000 para obtener segundos.
    var tiempoUnix = fecha / 1000;

    return tiempoUnix;
  }

  const [dia, setDia] = React.useState(0);
  const [mes, setMes] = React.useState(0);
  const [anio, setAnio] = React.useState(0);
  const [hora, setHora] = React.useState(0);
  const [minuto, setMinuto] = React.useState(0);

  // sleep
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function getVehiculos() {
    return axiosGetListaVehiculosSeleccionados(tipo)
      .then((response) => {
        let data = response.data || {};
        // Hacemos una copia profunda de data antes de asignarlo a respuesta_follow_f
        respuesta_init_f = JSON.parse(JSON.stringify(data));
        // console.log(respuesta_init_f);
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  }

  React.useEffect(() => {
    ejecucionOperacion();
  });

  React.useEffect(() => {
    setListaVehiculos(respuesta_init_f);
    console.log(listaVehiculos);
  }, [respuesta_init_f]);

  return (
    <Paper sx={{ width: "100%" }}>
      <Box sx={{ paddingLeft: "15px" }}>
        <h3 style={{ marginBottom: "3px" }}>Operaciones</h3>
        <p style={{ opacity: 0.6, fontSize: "14px", marginTop: "2px" }}>
          Información de los pedidos
        </p>
      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell style={{ color: "#2E7D32", fontWeight: "600" }}>
                Vehículo
              </TableCell>
              <TableCell
                align="left"
                style={{ color: "#2E7D32", fontWeight: "600" }}
              >
                Capacidad
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <Row key={row.name} row={row} />
                  // <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  //   {rows.map((row) => (
                  //     <Row key={row.name} row={row} />
                  //   ))}
                  // </TableRow>
                );
              })}
            {/* {typeof infoTabla !== "undefined" &&
              infoTabla &&
              Array.isArray(infoTabla) &&
              infoTabla.length > 0 &&
              infoTabla
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {typeof infoTabla !== "undefined" &&
                        infoTabla &&
                        Array.isArray(infoTabla) &&
                        infoTabla.length > 0 &&
                        infoTabla.map((row) => <Row key={row.id} row={row} />)}
                    </TableRow>
                  );
                })} */}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
