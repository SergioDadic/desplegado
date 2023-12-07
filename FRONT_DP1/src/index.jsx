import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Bloqueo from "./pages/bloqueos";
import Seguimiento from "./pages/seguimiento";
import Mantenimiento from "./pages/mantenimientos";
import Vehiculo from "./pages/vehiculos";
import Pedido from "./pages/pedidos";
import RegistroPedido from "./pages/registroPedidos";
import RegistroVehiculo from "./pages/registroVehiculo";
import RegistroBloqueo from "./pages/registroBloqueo";
import RegistroMantenimiento from "./pages/registroMantenimiento";
import GrillaSimulacion from "./pages/grilla";
import Operacion from "./pages/operacion";
import CargaArchivos from "./pages/cargaArchivos";
import Flota from "./pages/flota";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CargaArchivos />,
  },
  {
    path: "/Seguimiento",
    element: <Seguimiento />,
  },
  {
    path: "/Pedidos",
    element: <Pedido />,
  },
  {
    path: "/Bloqueos",
    element: <Bloqueo />,
  },
  {
    path: "/Mantenimiento",
    element: <Mantenimiento />,
  },
  {
    path: "/Vehiculos",
    element: <Vehiculo />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
  {
    path: "/NuevoPedido",
    element: <RegistroPedido />,
  },
  {
    path: "/NuevoVehiculo",
    element: <RegistroVehiculo />,
  },
  {
    path: "/NuevoBloqueo",
    element: <RegistroBloqueo />,
  },
  {
    path: "/NuevoMantenimiento",
    element: <RegistroMantenimiento />,
  },
  {
    path: "/Simulacion",
    element: <GrillaSimulacion />,
  },
  {
    path: "/Operacion",
    element: <Operacion />,
  },
  {
    path: "/Flota",
    element: <Flota />,
  },
]);

function PageNotFound() {
  return (
    <div>
      <h2>
        <b> 404 Page not found</b>
      </h2>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
