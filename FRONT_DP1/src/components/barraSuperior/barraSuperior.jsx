import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import logo from "../../img/logo.png";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import SeguimientoIcon from "@mui/icons-material/LocationOn";
import VehiculoIcon from "@mui/icons-material/LocalShipping";
import PedidoIcon from "@mui/icons-material/GasMeter";
import BloqueoIcon from "@mui/icons-material/StopCircle";
import CarRepairIcon from "@mui/icons-material/CarRepair";
import "./barraSuperior.css";
import colores from "../../colors/colores";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LogoutIcon from "@mui/icons-material/Logout";
import ListSubheader from "@mui/material/ListSubheader";
// import LinearProgress from "@material-ui/core/LinearProgress";

import { axiosCargaMasivaPedidos } from "../../api/AxiosPedido";
import { axiosCargaMasivaBloqueos } from "../../api/AxiosBloqueo";
import axios from "axios";

const drawerWidth = 220;

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
  background: "none",
});

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function BarraSuperior() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();
  const [contenidoArchivo, setContenidoArchivo] = useState(null);

  const ManejadorDeCambio = (event) => {
    const archivo = event.target.files[0];
    const lector = new FileReader();

    lector.onload = () => {
      const contenido = lector.result;
      // Redirigir a otra página y pasar los datos como parámetros de consulta
      setContenidoArchivo(contenido);
      navigate(`/?datos=${encodeURIComponent(contenido)}`);
      console.log(contenido);
    };

    lector.readAsText(archivo);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  function removeDiacritics(text) {
    if (text === "Seguimiento") {
      return "";
    }
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const handleUploadPedido = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        "api/v1/Pedido/CargaMasivaPedidos",
        formData
      );
      const data = response.data;
      console.log(data);
    } catch (error) {
      console.error("Error al cargar pedidos: ", error);
    }

  };

  const iconos = {
    Seguimiento: <SeguimientoIcon />,
    Pedidos: <PedidoIcon />,
    Vehículos: <VehiculoIcon />,
    Bloqueos: <BloqueoIcon />,
    Mantenimiento: <CarRepairIcon />,
  };

  return (
    <>
      <>
        <CssBaseline />
        <AppBar position="fixed">
          <Toolbar sx={{ background: colores.blanco }}>
            <IconButton
              aria-label="open drawer"
              onClick={() => setOpen(!open)}
              edge="start"
              style={{ backgroundColor: colores.negro }}
              sx={{
                marginRight: 5,
              }}
            >
              <MenuIcon />
            </IconButton>
            <img
              className="logoSAG"
              src={logo}
              alt="logoSag"
              width="50"
              height="50"
            />
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontFamily: "Roboto, sans-serif" }}
              style={{ fontWeight: "bold", color: colores.secundario }}
            >
              S A G
            </Typography>
            <Box sx={{ flexGrow: 0 }}>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer
          open={open}
          variant="permanent"
          PaperProps={{
            sx: {
              backgroundColor: colores.primario,
            },
          }}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>

          <Divider light />
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            subheader={
              // <ListSubheader style={{ backgroundColor: colores.primario }}>
              <ListSubheader
                style={{ backgroundColor: colores.primario }}
                sx={{ opacity: open ? 1 : 0, ml: 3 }}
              >
                Módulos
              </ListSubheader>
            }
            style={{ fontWeight: "bold", backgroundColor: colores.primario }}
          >
            {[
              "Seguimiento",
              "Pedidos",
              "Vehículos",
              "Bloqueos",
              "Mantenimiento",
            ].map((text, index) => (
              <ListItem
                key={text}
                disablePadding
                sx={{ display: "block" }}
                onClick={() => navigate("/" + removeDiacritics(text))}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      ml: open ? 2 : 3,
                      justifyContent: "center",
                    }}
                  >
                    {iconos[text]}
                  </ListItemIcon>

                  <ListItemText
                    primary={text}
                    sx={{ opacity: open ? 1 : 0, ml: 3 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider light />
          {/* <Box sx={{ height: "15%" }} />

          <Divider light /> */}

          {/* <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            subheader={
              <ListSubheader
                style={{ backgroundColor: colores.primario }}
                sx={{ opacity: open ? 1 : 0, ml: 3 }}
              >
                Carga de archivos
              </ListSubheader>
            }
            style={{ fontWeight: "bold", backgroundColor: colores.primario }}
          >
            {[
              "Pedidos",
              "Vehículos",
              "Bloqueos",
              "Mantenimiento",
              "Averías",
            ].map((text, index) => (
              <ListItem key={text} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  component="label"
                  onChange={handleUploadPedido}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      ml: open ? 2 : 3,
                      justifyContent: "center",
                    }}
                  >
                    {<CloudUploadIcon />}
                  </ListItemIcon>

                  <ListItemText
                    primary={text}
                    sx={{ opacity: open ? 1 : 0, ml: 3 }}
                  />
                  <VisuallyHiddenInput type="file" />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider light /> */}
          {/* <Box sx={{ height: "25%" }} />
          <Divider light /> */}
          {/* <ListItem
            key="Cerrar Sesión"
            disablePadding
            sx={{ display: "block" }}
            // onClick={handleCerrarSesion}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  ml: open ? 2 : 3,
                  justifyContent: "center",
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Cerrar Sesión"
                sx={{ opacity: open ? 1 : 0, ml: 3 }}
              />
            </ListItemButton>
          </ListItem> */}
        </Drawer>
      </>
    </>
  );
}
