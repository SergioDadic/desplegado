import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import TablaCollapsible from "../tabla/tablaCollapsible";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import colors from "../../colors/colores";
import useImage from "use-image";
import "./drawerDerecho.css";
import colores from "../../colors/colores";
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
import "./../tabla/tabla.css";
import CarCrashIcon from "@mui/icons-material/CarCrash";

import Leyenda from "./leyenda";

function Row2(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  // console.log(row);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography fontWeight="600" gutterBottom component="div">
                Pedidos
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableBody>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center" component="th" scope="row">
                    {row.nombrePedido}
                  </TableCell>
                  <TableCell align="center" component="th" scope="row">
                    {row.x},{row.y}
                  </TableCell>
                  <TableCell align="right" component="th" scope="row">
                    {row.estado}
                  </TableCell>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  // console.log(row);

  return (
    <>
      {row && row.totalOrders && (
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
              {row.tipo}
            </TableCell>
            <TableCell align="right">{row.cargaGLP} m3 GLP</TableCell>
            {/* <TableCell>
              <IconButton
                aria-label="expand row"
                size="small"
                // onClick={() => setOpen(!open)}
              >
                <CarCrashIcon/>
              </IconButton>
            </TableCell> */}
          </TableRow>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography fontWeight="600" gutterBottom component="div">
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
                      {row.totalOrders &&
                      Array.isArray(row.totalOrders) &&
                      row.totalOrders.legth > 0 ? (
                        row.totalOrders.map((row) => (
                          <Row2 key={row.id} row={row} />
                        ))
                      ) : (
                        <p>Vehículo sin órdenes designadas</p>
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </React.Fragment>
      )}
    </>
  );
}

export default function DrawerDerecho(infoTabla) {
  const [state, setState] = React.useState({
    right: false,
  });
  const [operaciones, setOperaciones] = React.useState([]);
  const [operacionesAux, setOperacionesAux] = React.useState(
    infoTabla.infoTabla
  );

  React.useEffect(() => {
    if (
      infoTabla.infoTabla !== "" ||
      typeof infoTabla.infoTabla !== "undefined"
    )
      setOperaciones(infoTabla.infoTabla);
  }, [infoTabla]);

  const estilosContenedorTabla = {
    backgroundColor: colores.blanco,
    padding: "20px",
    borderRadius: "25px",
    width: "100%",
    marginTop: "20px",
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 450 }}
      role="presentation"
      // onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <Container
          maxWidth="sm"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ bgcolor: colors.blanco, height: "10vh" }} />
          <TextField
            id="outlined-read-only-input"
            label="Cantidad de vehiculos"
            defaultValue={
              operaciones && Array.isArray(operaciones)
                ? operaciones.length
                : "0"
            }
            InputProps={{
              readOnly: true,
            }}
          />
          <Container
            style={{
              backgroundColor: colores.blanco,
              padding: "20px",
              borderRadius: "25px",
              width: "100%",
              marginTop: "20px",
            }}
          >
            <h3 style={{ marginBottom: "3px" }}>Operaciones</h3>
            <p style={{ opacity: 0.6, fontSize: "14px", marginTop: "2px" }}>
              {" "}
              Información de los pedidos
            </p>
            <div>
              {operaciones &&
                Array.isArray(operaciones) &&
                operaciones.length > 0 && (
                  <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                      <TableHead>
                        <TableRow>
                          <TableCell />
                          <TableCell
                            style={{ color: "#2E7D32", fontWeight: "600" }}
                          >
                            Vehículo
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{ color: "#2E7D32", fontWeight: "600" }}
                          >
                            Capacidad
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {typeof operaciones !== "undefined" &&
                          operaciones &&
                          Array.isArray(operaciones) &&
                          operaciones.length > 0 &&
                          operaciones.map((row) => (
                            <Row key={row.id} row={row} />
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
            </div>
          </Container>
        </Container>
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button
            variant="contained"
            color="success"
            onClick={toggleDrawer(anchor, true)}
            style={{ marginTop: "10px", width: "100%" }}
          >
            {"MÁS INFORMACIÓN"}
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
