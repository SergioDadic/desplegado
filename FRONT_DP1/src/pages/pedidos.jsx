import BarraSuperior from "../components/barraSuperior/barraSuperior";
import Box from "@mui/material/Box";
import colores from "../colors/colores";
import Container from "@mui/material/Container";
import InputWithIcon from "../components/inputStandar/inputStandar";
import BotonVerde from "../components/botonVerde/botonVerde";
import ContenedorTabla from "../components/contenedorTabla/contenedorTabla";
import { useEffect, useState } from "react";
import { axiosGetPedido } from "../api/AxiosPedido";
import ModalRegistroPedido from "../components/modal/modalRegistroPedido";
import ModalRegistroPedidos from "../components/modal/modalRegistroVariosPedidos";

const estilosContenedor = {
  backgroundColor: colores.blanco,
  padding: "25px",
  borderRadius: "10px",
  width: "100%",
};

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);

  const getListaPedidos = async () => {
    try {
      const response = await axiosGetPedido();
      const list = response.data;
      setPedidos(list);
      console.log(response.data)
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  useEffect(() => {
    getListaPedidos(); // Llamar a la función asincrónica aquí
  },[]); // Pasa un array vacío como segundo argumento


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
          <h2 className="tituloPagina">PEDIDOS</h2>
          <div style={{display:"flex", flexDirection:"row", gap:"20px", justifyContent:"right", alignItems:"center", marginTop:"-10px", marginBottom:"10px"}}><ModalRegistroPedido />
          <ModalRegistroPedidos/></div>
          {/* <BotonVerde texto={"Ingresar pedido"} camino={"NuevoPedido"} /> */}
          <Container sx={estilosContenedor}>
            <InputWithIcon texto={"Ingresar ID del pedido:"} />
          </Container>
          <ContenedorTabla
            titulo={"Pedidos"}
            descripcion={"Histórico de pedidos realizados por la empresa"}
            tipo={"pedido"}
            datos={pedidos}
          />
        </Box>
      </Box>
    </div>
  );
}

export default Pedidos;
