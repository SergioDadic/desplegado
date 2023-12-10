import * as React from "react";
import BarraSuperior from "../components/barraSuperior/barraSuperior";
import Grilla from "../components/grilla/grilla";
import Box from "@mui/material/Box";
import colores from "../colors/colores";
import { useNavigate, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import InicioSimulacion from "@mui/icons-material/PlayArrow";
import Button from "@mui/material/Button";
import Leyenda from "../components/drawerDerecho/leyenda";
import "../index.css";
import TiempoActual from "../components/drawerDerecho/tiempoActualDiario";
import Simulacion from "./sistemaCoordenadasCartesianas";
import TextField from "@mui/material/TextField";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import Tabs from "@mui/material/Tabs";
import TabPanel from "@mui/lab/TabPanel";
import Subheader from "../components/drawerDerecho/subheader";
import { DataGrid } from "@mui/x-data-grid";
import Cronometro from "../components/drawerDerecho/cronometro";
import ModalIncidencia from "../components/modal/modalIncidencia";
import ModalRegistroPedido from "../components/modal/modalRegistroPedido";
import ModalRegistroPedidos from "../components/modal/modalRegistroVariosPedidos2";
import { axiosGetListaVehiculosDiarios } from "../api/AxiosSimulacion";
import { formToJSON } from "axios";
import MensajeExito from "../components/modal/modalReporteDiario";
import { axiosGetPedidoDiario } from "../api/AxiosPedido";

/* Variables globales generales*/
let objetoGrilla = {
  coordenadasVehiculos: [],
  lineaDeRutas: [],
  puntosDeLlegada: [],
  bloqueos: [],
};
let objetoTabla = {
  vehiculos_t: "",
  pedido_t: 0,
  cliente_t: "",
  estado_t: "",
};
let estructuraTabla = [];

let tiempo_actual_real_unix;
let respuesta_aux_ge;
let respuesta_init_f;
let respuesta_follow_f;
let aux_respuesta_local;
// Banderas para manejar las interrupciones
let bandera_final = false;

let anio_f;
let mes_f;
let dia_f;
let hora_f;
let minuto_f;
let fecha_f;
let contador = 0;

//Para manejar los bloqueos
let fechaInicioBloqueos;
let fechaFinBloqueos;

//Para información extra
let estructuraTablaPed = [];
let estructuraTablaEnC = [];
let estructuraTablaVeh = [];
let estructuraTablaInc = [];
let capacidadFlota = 0.0;
let uniDisponibles = 0;
let posAlmacenP = [12, 8];
let capAlmacenP = "Ilimitada";
let posAlmacenS1 = [42, 42]; //Intermedio norte
let capAlmacenS1 = 0.0;
let posAlmacenS2 = [63, 3]; //Intermedio este
let capAlmacenS2 = 0.0;
let pedEntregado = 0;
let pedxEntregar = 0;
let vehiculos_disponible = [];

function Operacion() {
  const location = useLocation();
  const tiempoIni = location.state.auxDate;
  const scale = location.state.scale;

  const ancho = 70,
    alto = 50;
  //scale = 11;

  const [buttonClicked, setButtonClicked] = useState(false);
  const [simulacionEnCurso, setSimulacionEnCurso] = useState(false);
  const [pausarSimulacion, setPausarSimulacion] = useState(false);

  //Variables para el Path
  const [fecha, setFecha] = useState("");
  const [simulacionEjecutada, setSimulacionEjecutada] = useState(false);
  const [fechaSimulacion, setFechaSimulacion] = useState({
    anio: 0,
    mes: 0,
    dia: 0,
    hora: 0,
    minuto: 0,
  });
  
  //Variable para el manejo de fin de simulación
  const [endSimulation, setEndSimulation] = useState(false);
  const [estructuraDibujo, setEstructuraDibujo] = useState(objetoGrilla);

  //Pedidos en cola
  const [pedidosEnC, setPedidosEnC] = useState([]);

  const getListaPedidosEnC = async () => {
    try {
      const response = await axiosGetPedidoDiario();
      const list = response.data;
      console.log(response.data);
      setPedidosEnC(list);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  useEffect(() => {
    getListaPedidosEnC(); // Llamar a la función asincrónica aquí
  },[estructuraDibujo]); // Pasa un array vacío como segundo argumento

const [modalCargado, setModalCargado] = useState(false);
  //MODAL DE FIN
  const [mostrarModal, setMostrarModal] = useState(false);
  const [condicion, setCondicion] = useState(false);
  let mensajeSnackbar = "";
  useEffect(() => {
    if (condicion) {
      setMostrarModal(true);
    }
  }, [condicion]);


  //Para el manejo de la tabla
  // const [estructuraTabla, setEstructuraTabla] = useState([]);

  const handleClickInicio = useCallback(() => {
    setButtonClicked((prev) => !prev);
    setSimulacionEnCurso((prev) => !prev);
    setPausarSimulacion(false); // Reanudar la simulación
  }, [setButtonClicked, setSimulacionEnCurso]);

  /*Función para obtener los elementos de la grilla*/
  async function obtenerElementos(tiempo_actual_unix, tiempo_a_simular) {
    estructuraTablaVeh = [];
    estructuraTablaInc = [];
    estructuraTablaPed = [];
    estructuraTablaEnC = [];
    let bloques_transcurrido = 1;

    //Tiempo de simulacion que se ha decidido simular = tiempo_actual_unix + tiempo
    let stop = await sumarMinutosYSegundosATiempoUnix(
      tiempo_actual_real_unix,
      tiempo_a_simular,
      0
    );

    // Tasa de tiempo incremento en minutos
    const tasa_tiempo_incremento = 1;
    const segundos_incremento = 0;
    const bloque_incremento = 1;

    // v_tiempo con el que se dibuja
    let v_tiempo;
    //Recorre 15 movimientos en 18 minutos
    while (bloques_transcurrido <= 1) {
      if (contador === 0) {
        contador = 1;
        tiempo_actual_real_unix = await sumarMinutosYSegundosATiempoUnix(
          tiempo_actual_real_unix,
          tiempo_a_simular,
          0
        );
        return;
      }

      let aux_parada = convertToUnixTime(
        anio_f,
        mes_f,
        dia_f,
        hora_f,
        minuto_f
      ); //Tiempo Unix del momento donde se inicia la simulacion 10080
      let parada = await sumarMinutosYSegundosATiempoUnix(aux_parada, 1440, 0); //Tiempo donde acaba la simulación semanal
      const pedidos = respuesta_aux_ge.Vehiculos;
      const bloqueosT = respuesta_aux_ge.Bloqueos;
      const almacenesT = respuesta_aux_ge.Almacenes;

      //capAlmacenS1 = almacenesT[1].cantMaximaLiquidoGLP;
      capAlmacenS1 = "-";
      capAlmacenS2 = "-";
      posAlmacenS1[0] = almacenesT[1].pos_x ? almacenesT[1].pos_x : 42;
      posAlmacenS1[1] = almacenesT[1].pos_y ? almacenesT[1].pos_y : 42;
      posAlmacenS2[0] = almacenesT[2].pos_x ? almacenesT[2].pos_x : 63;
      posAlmacenS2[1] = almacenesT[2].pos_y ? almacenesT[2].pos_y : 3;
      // console.log(pedidos);

      //Grilla
      let vehiculos = [];
      let puntos_llegada = [];
      let rutas = [];
      let bloqueos_ = [];

      v_tiempo = tiempo_actual_unix;
      tiempo_actual_real_unix = await sumarMinutosYSegundosATiempoUnix(tiempo_actual_unix, 1, 0);;
      if (v_tiempo >= parada) {
        console.log("v_tiempo: " + v_tiempo + "parada: " + parada);
        bandera_final = true;
        let tam = pedidos.length;
        let cont = 0;
        for (let i = 0; i < tam; i++) {
          if (
            pedidos[i].route.length === 0 &&
            ((pedidos[i].movement[0].x === 12 &&
              pedidos[i].movement[0].y === 8) ||
              (pedidos[i].movement[0].x === 42 &&
                pedidos[i].movement[0].y === 42) ||
              (pedidos[i].movement[0].x === 63 &&
                pedidos[i].movement[0].y === 3))
          )
            cont++;
          else break;
        }
        if (cont == tam) {
          setMostrarModal(true);
          setMostrarModal(false);
          //setCondicion(true);
          mensajeSnackbar = "Simulación Diaria concluida con éxito";
          console.log("Simulacion Diara concluida con exito");
          setSimulacionEnCurso(false);
          break;
        }
      }

      //Tabla Vehiculos
      let vehi_tv = [];
      let posx_tv = [];
      let posy_tv = [];
      let ped_tv = [];
      let entx_tv = [];
      let enty_tv = [];
      let o = 0;

      //Tabla Pedidos
      let ped_tp = [];
      let posx_tp = [];
      let posy_tp = [];
      let lim_tp = [];
      let cli_tp = [];
      let glp_tp = [];

      //Bloqueos
      if (bloqueosT) {
        for (let i = 0; i < bloqueosT.length; i++) {
          let block = bloqueosT[i];
          let inicioBloqueo = new Date(block.inicioBloqueo);
          const anioBI = inicioBloqueo.getFullYear();
          const mesBI = inicioBloqueo.getMonth() + 1;
          const diaBI = inicioBloqueo.getDate();
          const horaBI = inicioBloqueo.getHours();
          const minBI = inicioBloqueo.getMinutes();
          let aux_inicio = convertToUnixTime(
            anioBI,
            mesBI,
            diaBI,
            horaBI,
            minBI
          );
          let finBloqueo = new Date(block.finBloqueo);
          const anioBF = finBloqueo.getFullYear();
          const mesBF = finBloqueo.getMonth() + 1;
          const diaBF = finBloqueo.getDate();
          const horaBF = finBloqueo.getHours();
          const minBF = finBloqueo.getMinutes();
          let aux_fin = convertToUnixTime(anioBF, mesBF, diaBF, horaBF, minBF);
          //console.log("v_tiempo: " + v_tiempo + "aux_inicio: " + aux_inicio + "aux_fin: " + aux_fin);
          if (v_tiempo >= aux_inicio && v_tiempo <= aux_fin) {
            //console.log("x:" + block.pos_x + "y:" + block.pos_y);
            bloqueos_.push([block.pos_x, block.pos_y]);
          }
        }
      }

      let movimiento;
      for (let i = 0; i < pedidos.length; i++) {
        let pedido = pedidos[i];
        let coord_llegada = { x: -1, y: -1 };
        let bandera_llegada = false;
        let bandera_delivered = false;
        let aux_delivered;

        //Verificar si el vehiculo esta disponible
        if (pedido.estado === "Disponible")
          vehiculos_disponible.push(pedido.tipo);

        //Puntos de llegada
        if (pedido.deliveredOrder.length > 0) {
          aux_delivered = pedido.deliveredOrder;
          coord_llegada.x = pedido.deliveredOrder[0].x;
          coord_llegada.y = pedido.deliveredOrder[0].y;
          puntos_llegada.push([coord_llegada.x, coord_llegada.y]);
          bandera_delivered = true;
        }

        if (pedido.order.length > 0 && !bandera_delivered) {
          coord_llegada.x = pedido.order[0].x;
          coord_llegada.y = pedido.order[0].y;
          puntos_llegada.push([coord_llegada.x, coord_llegada.y]);
        }

        //Actualización delivered order
        let k;
        movimiento = pedido.movement; //Solo entrará si tiene movimientos
        if (movimiento) {
          for (k = bloques_transcurrido - 1; k < movimiento.length - 1; k++) {
            if (
              movimiento[k].x === coord_llegada.x &&
              movimiento[k].y === coord_llegada.y
            ) {
              bandera_llegada = true;
              //Se debe eliminar el punto de llegada del arreglo para que ya no se muestre en el mapa
              for (let h = 0; h < puntos_llegada.length; h++) {
                let puntos = puntos_llegada[h];
                if (
                  puntos[0] === movimiento[k].x &&
                  puntos[1] === movimiento[k].y
                ) {
                  puntos_llegada.splice(h, 1); //Elimina el punto de llegada
                  break;
                }
              }

              //Ahora se debe actualizar en caso existan más pedidos por entregar en el llamado
              if (aux_delivered && aux_delivered.length > 0) {
                aux_delivered.shift();
                if (aux_delivered.length > 0) {
                  coord_llegada.x = aux_delivered[0].x;
                  coord_llegada.y = aux_delivered[0].y;
                  puntos_llegada.push([coord_llegada.x, coord_llegada.y]);
                  bandera_llegada = false;
                }
              }
            }
            let ini = [],
              fin = [],
              recorrido = [];
            ini.push(movimiento[k].x);
            ini.push(movimiento[k].y);
            fin.push(movimiento[k + 1].x);
            fin.push(movimiento[k + 1].y);
            recorrido.push(ini);
            recorrido.push(fin);
            recorrido.push(pedido.estado);
            rutas.push(recorrido);
          }
        }

        if (!bandera_llegada) {
          let route = pedido.route;
          for (let j = 0; j < route.length - 1; j++) {
            if (
              (route[j].x === coord_llegada.x &&
                route[j].y === coord_llegada.y) ||
              (route[j].x === 12 && route[j].y === 8) ||
              (route[j].x === 42 && route[j].y === 42) ||
              (route[j].x === 63 && route[j].y === 3)
            )
              break;

            if (j === 0)
              rutas.push([
                [movimiento[k].x, movimiento[k].y],
                [route[0].x, route[0].y],
                pedido.estado,
              ]);

            let ini = [],
              fin = [],
              recorrido = [];
            ini.push(route[j].x);
            ini.push(route[j].y);
            fin.push(route[j + 1].x);
            fin.push(route[j + 1].y);
            recorrido.push(ini);
            recorrido.push(fin);
            recorrido.push(pedido.estado);
            rutas.push(recorrido);
          }
        }

        vehiculos.push([
          movimiento[bloques_transcurrido - 1].x,
          movimiento[bloques_transcurrido - 1].y,
          pedido.placa,
          pedido.tipo,
        ]);

        let ordenes = pedido.deliveredOrder; //Cnheca
        for (let j = 0; j < ordenes.length; j++) {
          let orden = ordenes[j];
          vehi_tv[j] = pedido.tipo;
          ped_tv[j] = orden.cantidadAEntregar;
          posx_tv[j] = orden.nombrePedido;
          posx_tv[j] = orden.nombrePedido;
          entx_tv[j] = orden.x;
          enty_tv[j] = orden.y;
        }
      }

      let estructura = {
        coordenadasVehiculos: vehiculos,
        lineaDeRutas: rutas,
        puntosDeLlegada: puntos_llegada,
        bloqueos: bloqueos_,
      };

      //Información derecha
      //Inicializo variables de info
      uniDisponibles = 0;
      capacidadFlota = 0;
      pedEntregado = 0;
      pedxEntregar = 0;
      let puedeCargar = 0;
      let carga = 0;
      let m = 0;
      let a = 0;
      estructuraTablaVeh = [];
      estructuraTablaPed = [];
      estructuraTablaInc = [];
      //console.log(pedidos);
      for (let d = 0; d < pedidos.length; d++) {
        let pedido = pedidos[d];
        if (pedido.estado === "Averiado") {
          let averia = pedido.averiaAsignada;
          // console.log(pedido);
          if (averia && averia.nombre_vehiculo) {
            const aux = {
              id: a + 1,
              vehiculo: pedido.placa,
              tipoV: averia.nombre_vehiculo,
              tipo: averia.tipo_averia,
              turno: averia.turno_averia,
              posx: pedido.movement[0].x ? pedido.movement[0].x : 12,
              posy: pedido.movement[0].y ? pedido.movement[0].y : 8,
            };
            estructuraTablaInc.push(aux);
            console.log(estructuraTablaInc);
            a++;
          }
        }
        if (pedido.estado === "Disponible" || pedido.estado === "Reparado") {
          uniDisponibles++;

          puedeCargar += pedido.capacity;
          carga += pedido.physicStock;
          capacidadFlota = parseFloat(((carga / puedeCargar) * 100).toFixed(2));

          //Vehiculos
          if (
            pedido &&
            pedido.totalOrders &&
            pedido.totalOrders[0] &&
            pedido.totalOrders[0].amount
          ) {
            const aux = {
              id: m + 1,
              vehiculo: pedido.tipo,
              pedido: pedido.totalOrders[0].amount
                ? pedido.totalOrders[0].amount
                : 0,
              posx: pedido.totalOrders[0].x ? pedido.totalOrders[0].x : 12,
              posy: pedido.totalOrders[0].y ? pedido.totalOrders[0].y : 8,
              placa: pedido.placa,
            };
            estructuraTablaVeh.push(aux);
            m++;
          }

          //Pedidos pendientes (Tabla)
          let ordenes = pedido.order;
          //console.log(ordenes);
          for (let n = 0; n < ordenes.length; n++) {
            if (ordenes && ordenes[n]) {
              const aux = {
                id: 0,
                cliente: ordenes[n].nombrePedido,
                glp: ordenes[n].cantidadAEntregar,
                fecha: ordenes[n].limitDate,
                posx: ordenes[n].x ? ordenes[n].x : 0,
                posy: ordenes[n].y ? ordenes[n].y : 0,
                asignado: pedido.tipo,
              };
              estructuraTablaPed.push(aux);
            }
            //console.log(estructuraTablaPed);
          }

          for (let h = 0; h < estructuraTablaPed.length; h++) {
            estructuraTablaPed[h].id = h + 1;
          }

          //Pedidos entregados
          ordenes = pedido.totalOrders;
          for (let w = 0; w < ordenes.length; w++) {
            if (
              ordenes &&
              ordenes[w] &&
              ordenes[w].estado &&
              ordenes[w].estado === "Entregado"
            )
              pedEntregado += ordenes[w].amount;
          }
        }
      }

      // console.log(estructuraTabla);
      setEstructuraDibujo(estructura);
      if (bloques_transcurrido === 3) {
        console.log("entro a");
        setFollow();
      }

      bloques_transcurrido += bloque_incremento;

      if (respuesta_follow_f !== null) {
        aux_respuesta_local = JSON.parse(JSON.stringify(respuesta_follow_f));
        respuesta_follow_f = null; // Para que no vuelva a entrar
      }

      // if (bloques_transcurrido === 16) {
      //   respuesta_aux_ge = JSON.parse(JSON.stringify(aux_respuesta_local));
      //   bloques_transcurrido = 1;
      //   tiempo_actual_unix = await sumarMinutosYSegundosATiempoUnix(
      //     v_tiempo,
      //     tasa_tiempo_incremento,
      //     segundos_incremento
      //   );
      // }
      await sleep(60000);
    }
  }

  /*Función que ejecuta la simulación*/
  const ejecucionSimulacion = async () => {
    //Inicializo variables de info
    uniDisponibles = 0;
    capacidadFlota = 0;
    pedEntregado = 0;
    pedxEntregar = 0;

    //Inializamos fecha final
    const fechaOriginal = new Date(tiempoIni);

    dia_f = fechaOriginal.getDate().toString().padStart(2, "0");
    mes_f = (fechaOriginal.getMonth() + 1).toString().padStart(2, "0");
    anio_f = fechaOriginal.getFullYear();
    hora_f = fechaOriginal.getHours().toString().padStart(2, "0");
    minuto_f = fechaOriginal.getMinutes().toString().padStart(2, "0");

    fecha_f = `${anio_f}-${mes_f}-${dia_f} ${hora_f}:${minuto_f}`;

    setFechaSimulacion({ anio_f, mes_f, dia_f, hora_f, minuto_f });

    // Contiene el tiempo UNIX
    tiempo_actual_real_unix = convertToUnixTime(
      anio_f,
      mes_f,
      dia_f,
      hora_f,
      minuto_f
    );

    // Cuantas llamadas se necesitarán para ejecutar la simulación
    let contador_llamadas = 0;
    let numero_maximo_llamadas = 100000;

    //Para el primer llamado
    let fechaAux = new Date(fechaOriginal);
    fechaAux.setMinutes(fechaAux.getMinutes() + 18);

    fechaInicioBloqueos = new Date(fechaOriginal);
    fechaFinBloqueos = new Date(fechaAux);
    //Itera llamadas al api y el dibujado
    while (contador_llamadas < numero_maximo_llamadas) {
      respuesta_follow_f = null;
      if (bandera_final) {
        setCondicion(true);
        break;
      }

      if (contador_llamadas === 0) {
        await getRutas();
        respuesta_aux_ge = JSON.parse(JSON.stringify(respuesta_init_f));
        await obtenerElementos(tiempo_actual_real_unix, 1);
      } else if (contador_llamadas >= 1) {
        await getRutas();
        respuesta_aux_ge = JSON.parse(JSON.stringify(respuesta_init_f));
        await obtenerElementos(tiempo_actual_real_unix, 1);
      }
      setEndSimulation(false);
      contador_llamadas++;
    }
  };

  /*Función para los tiempos UNIX*/
  function convertToUnixTime(anio, mes, dia, hora, minuto) {
    // Crear una fecha en UTC
    var fecha = Date.UTC(anio, mes - 1, dia, hora, minuto);

    // Convertir la fecha a tiempo Unix
    // Dividimos por 1000 para obtener segundos.
    var tiempoUnix = fecha / 1000;

    return tiempoUnix;
  }

  function convertFromUnixTime(tiempoUnix) {
    // Multiplicar el tiempo Unix por 1000 para obtener milisegundos
    var tiempoMilisegundos = tiempoUnix * 1000;

    // Crear un objeto Date a partir de los milisegundos
    var fecha = new Date(tiempoMilisegundos);

    // Obtener los componentes de la fecha y hora en UTC
    var anio = fecha.getUTCFullYear();
    var mes = (fecha.getUTCMonth() + 1).toString().padStart(2, "0"); // JavaScript cuenta los meses desde 0
    var dia = fecha.getUTCDate().toString().padStart(2, "0");
    var hora = fecha.getUTCHours().toString().padStart(2, "0");
    var minuto = fecha.getUTCMinutes().toString().padStart(2, "0");

    // Devolver los componentes de la fecha y hora como un objeto
    return {
      anio: anio,
      mes: mes,
      dia: dia,
      hora: hora,
      minuto: minuto,
    };
  }

  /* Funcion que permite sumar en tiempo UNIX*/
  async function sumarMinutosATiempoUnix(tiempoUnix, minutosASumar) {
    // Convertir los minutos a milisegundos
    var milisegundosASumar = minutosASumar * 60 * 1000;

    // Convertir el tiempo Unix a milisegundos
    var tiempoMilisegundos = tiempoUnix * 1000;

    // Sumar los milisegundos
    var nuevoTiempoMilisegundos = tiempoMilisegundos + milisegundosASumar;

    // Convertir el nuevo tiempo a Unix
    var nuevoTiempoUnix = Math.floor(nuevoTiempoMilisegundos / 1000);

    return nuevoTiempoUnix;
  }

  async function sumarMinutosYSegundosATiempoUnix(
    tiempoUnix,
    minutosASumar,
    segundosASumar
  ) {
    // Convertir los minutos y segundos a milisegundos
    var milisegundosASumar = (minutosASumar * 60 + segundosASumar) * 1000;

    // Convertir el tiempo Unix a milisegundos
    var tiempoMilisegundos = tiempoUnix * 1000;

    // Sumar los milisegundos
    var nuevoTiempoMilisegundos = tiempoMilisegundos + milisegundosASumar;

    // Convertir el nuevo tiempo a Unix
    var nuevoTiempoUnix = Math.floor(nuevoTiempoMilisegundos / 1000);

    return nuevoTiempoUnix;
  }

  // sleep
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function getRutas() {
    return axiosGetListaVehiculosDiarios(1, 1, 1)
      .then((response) => {
        let data = response.data || {};
        // Hacemos una copia profunda de data antes de asignarlo a respuesta_follow_f
        respuesta_init_f = JSON.parse(JSON.stringify(data));
        console.log(respuesta_init_f);
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  }

  // Axios follow request
  async function getFollow() {
    //console.log("entra a get")
    return axiosGetListaVehiculosDiarios(1, 1, 1)
      .then((response) => {
        let data = response.data || {};
        // Hacemos una copia profunda de data antes de asignarlo a respuesta_follow_f
        respuesta_follow_f = JSON.parse(JSON.stringify(data));
        console.log(respuesta_follow_f);
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  }

  async function setFollow() {
    // Primera vez
    if (contador === 1) {
      //console.log("entra a set")
      await getFollow();
      return;
    }
    if (contador > 1) {
      await getFollow();
      return;
    }
  }

  async function limpia_elementos() {
    const estructura = {
      coordenadasVehiculos: [],
      lineaDeRutas: [],
      puntosDeLlegada: [],
      bloqueos: [],
    };

    setEstructuraDibujo(estructura);
  }

  const handleClickPausa = () => {
    setPausarSimulacion(true); // Pausar la simulación
    console.log("se tuvo que pausar");
  };

  useEffect(() => {
    //console.log("Simulacion se renderizó");
  }, [estructuraDibujo]);

  useEffect(() => {
    if (simulacionEnCurso) {
      ejecucionSimulacion();
    }
  }, [simulacionEnCurso]);

  //Tabs
  const [valueTab, setValueTab] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };

  //Tabla Vehículo
  const column_tv = [
    { field: "id", headerName: "ID", width: 25 },
    // {
    //   field: "placa",
    //   headerName: "Placa",
    //   description: "Puede ingresar la placa que desee buscar",
    //   sortable: false,
    //   width: 125,
    //   valueGetter: (params) => `${params.row.placa || ""}`,
    // },
    {
      field: "vehiculo",
      headerName: "Vehículo",
      description: "Puede ingresar el vehículo que desee buscar",
      // sortable: false,
      width: 125,
      valueGetter: (params) => `${params.row.vehiculo || ""}`,
    },
    { field: "pedido", headerName: "Pedidos", width: 125 },
    { field: "entrega", headerName: "Entrega", width: 125 },
  ];
  const row_tv = estructuraTablaVeh
    ? estructuraTablaVeh.map((item) => ({
        id: item.id,
        // placa: item.placa,
        vehiculo: item.vehiculo,
        pedido: item.pedido,
        entrega: `(${item.posx},${item.posy})`,
      }))
    : [
        {
          id: 1,
          vehiculo: "-",
          pedido: "-", //Amount
          entrega: "-",
        },
      ];

  //Tabla Pedido
  const column_tp = [
    { field: "id", headerName: "ID", width: 25 },
    {
      field: "cliente",
      headerName: "Cliente",
      description: "Puede ingresar el cliente al que desee buscar",
      sortable: false,
      width: 125,
      valueGetter: (params) => `${params.row.cliente || ""}`,
    },
    { field: "glp", headerName: "Cant. GLP", width: 125 },
    { field: "fecha", headerName: "Fecha Máx", width: 125 },
    { field: "entrega", headerName: "Entrega", width: 125 },
    { field: "asignado", headerName: "Veh. Asignado", width: 125 },
  ];
  const row_tp = estructuraTablaPed
    ? estructuraTablaPed.map((item) => ({
        id: item.id,
        cliente: item.cliente,
        glp: item.glp,
        fecha: item.fecha,
        entrega: `(${item.posx},${item.posy})`,
        asignado: item.asignado,
      }))
    : [
        {
          id: "-",
          cliente: "-",
          glp: "-",
          fecha: "-",
          entrega: "-",
          asignado: "-",
        },
      ];
  //Tabla Incidencia
  const column_in = [
    { field: "id", headerName: "ID", width: 25 },
    {
      field: "vehiculo",
      headerName: "Placa",
      description: "Puede ingresar el vehiculo que desee buscar",
      sortable: false,
      width: 120,
      valueGetter: (params) => `${params.row.vehiculo || ""}`,
    },
    { field: "tipo", headerName: "Tipo Avería", width: 90 },
    { field: "turno", headerName: "Turno", width: 60 },
    { field: "ubicacion", headerName: "Ubicación", width: 80 },
  ];

  const row_in = estructuraTablaInc
    ? estructuraTablaInc.map((item) => ({
        id: item.id,
        vehiculo: item.vehiculo,
        tipo: item.tipo,
        turno: item.turno,
        ubicacion: `(${item.posx},${item.posy})`,
      }))
    : [
        {
          id: "-",
          vehiculo: "-",
          tipoV: "-",
          tipo: "-",
          turno: "-",
          ubicacion: "-",
        },
      ];

      //Tabla En cola
      const column_ec = [
        { field: "id", headerName: "ID", width: 25 },
        {
          field: "cliente",
          headerName: "Cliente",
          description: "Puede ingresar el cliente al que desee buscar",
          sortable: false,
          width: 60,
          valueGetter: (params) => `${params.row.cliente || ""}`,
        },
        { field: "glp", headerName: "Cant. GLP", width: 85 },
        { field: "fecha", headerName: "Fecha Máx", width: 160 },
        { field: "entrega", headerName: "Entrega", width: 90 },
      ];
      const row_ec = pedidosEnC
        ? pedidosEnC.map((item) => ({
            id: item.id,
            cliente: item.nombrePedido,
            glp: item.cantidadAEntregar,
            fecha: item.limitDate,
            entrega: `(${item.x},${item.y})`,
          }))
        : [
            {
              id: "-",
              cliente: "-",
              glp: "-",
              fecha: "-",
              entrega: "-",
            },
          ];

  return (
    <div style={{ backgroundColor: colores.fondo, minHeight: "100vh", position: "relative" }}>
      <Box sx={{ display: "flex" }}>
        <BarraSuperior />
        <Box component="main" sx={{ flexGrow: 1, p: 3, paddingTop: 8, position: "relative" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <h2 className="tituloPagina">SEGUIMIENTO</h2>
            <TiempoActual
              simulacionEnCurso={simulacionEnCurso}
              fechaSeleccionada={tiempoIni}
            />
          </div>
          <div style={{ display: "flex", gap: "62%", paddingLeft: "1%" }}>
            {/* <Grilla width={ancho} height={alto} scale={scale} /> */}
            <div>
              {scale && (
                <Simulacion
                  width={ancho}
                  height={alto}
                  scale={scale}
                  estructura={estructuraDibujo}
                />
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center", //
                gap: "16px",
                justifyContent: "center",
                width: "35%",
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center", //
                  gap: "2%",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <Cronometro buttonClicked={simulacionEnCurso} />
                <TextField
                  id="outlined-read-only-input"
                  label="Fecha Actual"
                  size="small"
                  value={tiempoIni.toLocaleDateString()}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                 <Button
                  variant="contained"
                  color={buttonClicked ? "error" : "success"}
                  endIcon={<InicioSimulacion />}
                  style={{ width: "80%" }}
                  onClick={
                    pausarSimulacion ? handleClickInicio : handleClickPausa
                  }
                >
                  {buttonClicked ? "Pausar" : "Iniciar"}
                </Button>{" "}
              </div>
              {/*INFORMACIÓN */}
              <Box sx={{ width: "100%", typography: "body1", height: "32rem" }}>
                <TabContext value={valueTab}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={valueTab}
                      onChange={handleChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      textColor="primary"
                      indicatorColor="primary"
                      aria-label="secondary tabs example"
                    >
                      <Tab value="1" label="Resumen" />
                      <Tab value="2" label="Vehiculos" />
                      <Tab value="3" label="Pedidos" />
                      <Tab value="4" label="Averiados" />
                      <Tab value="5" label="En cola" />
                    </Tabs>
                  </Box>
                  {/* Info RESUMEN */}
                  <TabPanel value="1">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        marginTop: "-20px",
                      }}
                    >
                      <Subheader texto={"Almacenes"} />
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "50% 50%",
                          columnGap: "5%",
                          rowGap: "16px",
                        }}
                      >
                        <TextField
                          id="outlined-read-only-input"
                          label="Capacidad Almacén Principal"
                          size="small"
                          style={{ width: "100%" }}
                          value={capAlmacenP}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                        <TextField
                          id="outlined-read-only-input"
                          label="Ubicación Almacén Principal"
                          size="small"
                          style={{ width: "100%" }}
                          value={`(${posAlmacenP[0]},${posAlmacenP[1]})`}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                        <TextField
                          id="outlined-read-only-input"
                          label="Capacidad Almacén Intermedio Norte"
                          size="small"
                          style={{ width: "100%" }}
                          value={capAlmacenS1}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                        <TextField
                          id="outlined-read-only-input"
                          label="Ubicación Almacén Intermedio Norte"
                          size="small"
                          style={{ width: "100%" }}
                          value={`(${posAlmacenS1[0]},${posAlmacenS1[1]})`}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                        <TextField
                          id="outlined-read-only-input"
                          label="Capacidad Almacén Intermedio Este"
                          size="small"
                          style={{ width: "100%" }}
                          value={capAlmacenS2}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                        <TextField
                          id="outlined-read-only-input"
                          label="Ubicación Almacén Intermedio Este"
                          size="small"
                          style={{ width: "100%" }}
                          value={`(${posAlmacenS2[0]},${posAlmacenS2[1]})`}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        marginTop: "-5px",
                      }}
                    >
                      <Subheader texto={"Vehiculos"} />
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "50% 50%",
                          columnGap: "5%",
                          rowGap: "16px",
                        }}
                      >
                        <TextField
                          id="outlined-read-only-input"
                          label="Capacidad Flota"
                          size="small"
                          style={{ width: "100%" }}
                          value={`${capacidadFlota}%`}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                        <TextField
                          id="outlined-read-only-input"
                          label="Vehiculos disponibles"
                          size="small"
                          style={{ width: "100%" }}
                          value={uniDisponibles}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        marginTop: "-5px",
                      }}
                    >
                      <Subheader texto={"Pedidos"} />
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "50% 50%",
                          columnGap: "5%",
                          rowGap: "16px",
                        }}
                      >
                        <TextField
                          id="outlined-read-only-input"
                          label="Pedidos Entregados"
                          size="small"
                          style={{ width: "100%" }}
                          value={pedEntregado}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                        {/* <TextField
                          id="outlined-read-only-input"
                          label="Pedidos por Entregar"
                          size="small"
                          style={{ width: "100%" }}
                          value={pedxEntregar}
                          InputProps={{
                            readOnly: true,
                          }}
                        /> */}
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel value="2">
                    <div style={{ height: 400, width: "100%" }}>
                      <DataGrid
                        rows={row_tv}
                        columns={column_tv}
                        initialState={{
                          pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                          },
                        }}
                        pageSizeOptions={[5, 10]}
                      />
                    </div>
                  </TabPanel>
                  <TabPanel value="3">
                    <div style={{ height: 400, width: "100%" }}>
                      <div style={{display:"flex", flexDirection:"row", gap:"20px", justifyContent:"center", alignItems:"center", marginTop:"-10px", marginBottom:"10px"}}><ModalRegistroPedido setModalCargado = {setModalCargado} />
                      <ModalRegistroPedidos setModalCargado={setModalCargado}/></div>
                      <DataGrid
                        rows={row_tp}
                        columns={column_tp}
                        initialState={{
                          pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                          },
                        }}
                        pageSizeOptions={[5, 10]}
                      />
                    </div>
                  </TabPanel>
                  <TabPanel value="4">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "12px",
                        width: "100%",
                      }}
                    >
                      {/* <ModalIncidencia vehiculos_disponible={vehiculos_disponible}/> */}
                      <div style={{ height: 400, width: "100%" }}>
                        <DataGrid
                          rows={row_in}
                          columns={column_in}
                          initialState={{
                            pgination: {
                              paginationModel: { page: 0, pageSize: 5 },
                            },
                          }}
                          pageSizeOptions={[5, 10]}
                        />
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel value="5" >
                  <div style={{ height: 400, width: "100%" }}>
                        <DataGrid
                          rows={row_ec}
                          columns={column_ec}
                          initialState={{
                            pgination: {
                              paginationModel: { page: 0, pageSize: 5 },
                            },
                          }}
                          pageSizeOptions={[5, 10]}
                        />
                      </div>
                  </TabPanel>
                </TabContext>
              </Box>
              {/*INFORMACIÓN */}
              <Box sx={{ display: "flex", alignItems: "end" }}>
                <Leyenda />
              </Box>
            </div>
          </div>
          {mostrarModal && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
            }}
          >
            <MensajeExito open={mostrarModal} onClose={() => setMostrarModal(false)} />
          </div>
        )}

        </Box>
        
      </Box>
    </div>
  );
}

export default Operacion;
