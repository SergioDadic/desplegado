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
import TiempoActual from "../components/drawerDerecho/tiempoActual";
import Simulacion from "./sistemaCoordenadasCartesianas";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";

import { axiosInicializaSimulacion } from "../api/AxiosSimulacion";
import { axiosGetListaVehiculos } from "../api/AxiosSimulacion";
import { formToJSON } from "axios";
import mensajeExito from "../components/mensaje/mensajeExito";

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
let tiempo_real_siguiente;
let respuesta_aux_ge;
let respuesta_init_f;
let respuesta_follow_f;

// Banderas para manejar las interrupciones
let bandera_final = false;
let bandera_pausa = false;

let anio_f;
let mes_f;
let dia_f;
let hora_f;
let minuto_f;
let fecha_f;

let capacidadFlota = 0;
let totalFlota = 0;

function GrillaSimulacion() {
  const location = useLocation();

  const tiempoIni = location.state.auxDate;
  //console.log("tiempo:" + tiempoIni);

  const ancho = 70,
    alto = 50,
    scale = 11.5;

  const [buttonClicked, setButtonClicked] = useState(false);
  const [simulacionEnCurso, setSimulacionEnCurso] = useState(false);

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

  //MODAL DE FIN
  const [mostrarModal, setMostrarModal] = useState(false);
  const [condicion, setCondicion] = useState(false);
  let mensajeSnackbar = "";
  useEffect(() => {
    if (condicion) {
      setMostrarModal(true);
    }
  }, [condicion]);

  //Variable para el manejo de fin de simulación
  const [endSimulation, setEndSimulation] = useState(false);
  const [estructuraDibujo, setEstructuraDibujo] = useState(objetoGrilla);

  //Para el manejo de la tabla
  // const [estructuraTabla, setEstructuraTabla] = useState([]);

  const handleClickInicio = useCallback(() => {
    setButtonClicked((prev) => !prev);
    setSimulacionEnCurso((prev) => !prev);
    bandera_pausa = true;
  }, [setButtonClicked, setSimulacionEnCurso]);

  /*Función para obtener los elementos de la grilla*/
  async function obtenerElementos(tiempo_actual_unix, tiempo_a_simular) {
    let tiempo_transcurrido = 1;

    //Tiempo de simulacion que se ha decidido simular = tiempo_actual_unix + tiempo
    let stop = await sumarMinutosATiempoUnix(tiempo_actual_real_unix, 15);

    // Tasa de tiempo incremento en minutos
    const tasa_tiempo_incremento = 1;

    // v_tiempo con el que se dibuja
    let v_tiempo;

    //Recorre los 60 minutos
    while (tiempo_transcurrido < tiempo_a_simular) {
      if (tiempo_transcurrido !== 0) {
        tiempo_actual_unix = await sumarMinutosATiempoUnix(
          v_tiempo,
          tasa_tiempo_incremento
        );
        tiempo_actual_real_unix = tiempo_actual_unix;
      }

      let aux_parada = convertToUnixTime(
        anio_f,
        mes_f,
        dia_f,
        hora_f,
        minuto_f
      ); //Tiempo Unix del momento donde se inicia la simulacion
      let parada = await sumarMinutosATiempoUnix(aux_parada, 10080); //Tiempo donde acaba la simulación semanal
      //console.log("parada: " + parada);

      v_tiempo = tiempo_actual_unix;
      if (v_tiempo >= parada) {
        bandera_final = true;
        mensajeSnackbar = "Simulación Semanal concluida con éxito"
        console.log("Simulacion Semanal concluida con exito");
        break;
      }

      const pedidos = respuesta_aux_ge;
      if (pedidos) totalFlota = pedidos.length;
      let aux = 0;
      for (let k = 0; k < totalFlota; k++) {
        if (pedidos.estado === "Disponible") capacidadFlota++;
      }
      
      //Grilla
      let vehiculos = [];
      let puntos_llegada = [];
      let rutas = [];
      //Tabla
      let vehi_t = [];
      let pedi_t = [];
      let clie_t = [];
      let x_t = [];
      let y_t = [];
      let o = 0;

      let movimiento;
      for (let i = 0; i < pedidos.length; i++) {
        let pedido = pedidos[i];
        let coord_llegada = {x: -1, y: -1};
        let bandera_llegada = false;
        let bandera_delivered = false;
        let aux_delivered;
        
        //Puntos de llegada
        if (pedido.deliveredOrder.length > 0){
            aux_delivered = pedido.deliveredOrder;
            coord_llegada.x = pedido.deliveredOrder[0].x;    
            coord_llegada.y = pedido.deliveredOrder[0].y;          
            puntos_llegada.push([coord_llegada.x,coord_llegada.y]);
            bandera_delivered = true;
        }

        if (pedido.order.length > 0 && !bandera_delivered){
          coord_llegada.x = pedido.order[0].x;    
          coord_llegada.y = pedido.order[0].y;          
          puntos_llegada.push([coord_llegada.x,coord_llegada.y]);
        }

        
        //Actualización delivered order
        let k;
        movimiento = pedido.movement;
        for (k = 0; k < movimiento.length - 1; k++) {
          if(movimiento[k].x === coord_llegada.x && movimiento[k].y === coord_llegada.y){
            bandera_llegada = true;
            //Se debe eliminar el punto de llegada del arreglo para que ya no se muestre en el mapa
            for(let h=0; h<puntos_llegada.length; h++){
              let puntos = puntos_llegada[h];
              if (puntos[0] === coord_llegada.x && puntos[1] === coord_llegada.y){
                puntos_llegada.splice(h, 1); //Elimina el punto de llegada
              }
            }

            //Ahora se debe actualizar en caso existan más pedidos por entregar en el llamado
            aux_delivered.shift();
            if (aux_delivered.length > 0){
              coord_llegada.x = aux_delivered[0].x;    
              coord_llegada.y = aux_delivered[0].y;          
              puntos_llegada.push([coord_llegada.x,coord_llegada.y]);
              bandera_llegada = false;
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
          rutas.push(recorrido);
        }

        if (!bandera_llegada){
          let route = pedido.route;
          for (let j = 0; j < route.length - 1; j++) {
            if((route[j].x === coord_llegada.x && route[j].y === coord_llegada.y) ||
              (route[j].x === 12 && route[j].y === 8) ||  (route[j].x === 42 && route[j].y === 42) ||
              (route[j].x === 63 && route[j].y === 3))
              break;
            
            if (j === 0)
              rutas.push([[movimiento[k].x,movimiento[k].y],[route[0].x,route[0].y]]);
          

            let ini = [],
              fin = [],
              recorrido = [];
            ini.push(route[j].x);
            ini.push(route[j].y);
            fin.push(route[j + 1].x);
            fin.push(route[j + 1].y);
            recorrido.push(ini);
            recorrido.push(fin);
            rutas.push(recorrido);
          }
        }

        //Vehiculos
        //console.log("X:" + movimiento[tiempo_transcurrido-1].x + " Y: " + movimiento[tiempo_transcurrido-1].y)
        if(movimiento.length>0)
          vehiculos.push([movimiento[tiempo_transcurrido-1].x ,movimiento[tiempo_transcurrido-1].y]);
        //movimiento = movimiento.splice(1,1);

        let ordenes = pedido.deliveredOrder;
        for (let j = 0; j < ordenes.length; j++) {
          let orden = ordenes[j];
          vehi_t[j] = pedido.tipo;
          pedi_t[j] = orden.cantidadAEntregar;
          clie_t[j] = orden.nombrePedido;
          x_t[j] = orden.x;
          y_t[j] = orden.y;
        }
        
      }
      
      let estructura = {
        coordenadasVehiculos: vehiculos,
        lineaDeRutas: rutas,
        puntosDeLlegada: puntos_llegada,
        bloqueos: [],
      };

      //Arreglo para la tabla
      for (var n = 0; n < vehi_t.length; n++) {
        var auxTabla = {
          idped_t: o,
          vehi_t: vehi_t[n],
          pedi_t: pedi_t[n],
          clie_t: clie_t[n],
          x_t: x_t[n],
          y_t: y_t[n],
        };
        o++;
        estructuraTabla.push(auxTabla);
      }

      // console.log(estructuraTabla);
      setEstructuraDibujo(estructura);
      await sleep(100);
      tiempo_transcurrido += tasa_tiempo_incremento;
      estructuraTabla = [];
    }
    //setEndSimulation(true);
  }

  /*Función que ejecuta la simulación*/
  const ejecucionSimulacion = async () => {
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
    //console.log("tiempo_actual_real_unix1: " + tiempo_actual_real_unix);
    // Cuantas llamadas se necesitarán para ejecutar la simulación
    let contador_llamadas = 0;
    let numero_maximo_llamadas = 470;

    //Itera llamadas al api y el dibujado
    while (contador_llamadas < numero_maximo_llamadas) {
      respuesta_follow_f = null;
      if (bandera_final) {
        setCondicion(true);
        break;
      }
      //Empleando el init
      if (contador_llamadas === 0) {
        //Aquí se inicializa la simulación para cada fecha
        await getRutas();
        respuesta_aux_ge = JSON.parse(JSON.stringify(respuesta_init_f));
        await obtenerElementos(tiempo_actual_real_unix, 15);
      }

      // Hacemos el follow -> follow
      if (contador_llamadas >= 1) {
        contador_llamadas = 1;
        await getRutas();
        respuesta_aux_ge = JSON.parse(JSON.stringify(respuesta_init_f));  
        console.log(respuesta_aux_ge);
        await obtenerElementos(tiempo_actual_real_unix, 15);    
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

  // sleep
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function getRutas() {
    return axiosGetListaVehiculos(1,15)
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

  async function limpia_elementos(){
    const estructura= {
      coordenadasVehiculos: [],
      lineaDeRutas: [],
      puntosDeLlegada: [],
      bloqueos: [],
    };

    setEstructuraDibujo(estructura);  
  }

  useEffect(() => {
    //console.log("Simulacion se renderizó");
  }, [estructuraDibujo]);

  useEffect(() => {
    if (simulacionEnCurso) {
      bandera_pausa = false;
      console.log("entra");
      ejecucionSimulacion();
    }
    else{
      console.log("se tuvo que pausar");
      limpia_elementos();
    }
  }, [simulacionEnCurso]);

  return (
    <div style={{ backgroundColor: colores.fondo, minHeight: "100vh" }}>
      <Box sx={{ display: "flex" }}>
        <BarraSuperior />
        <Box component="main" sx={{ flexGrow: 1, p: 3, paddingTop: 8 }}>
          <h2 className="tituloPagina">SEGUIMIENTO</h2>
          <div style={{ display: "flex", gap: "62%", paddingLeft: "1%" }}>
            <Grilla width={ancho} height={alto} scale={scale} />
            <Simulacion
              width={ancho}
              height={alto}
              scale={scale}
              estructura={estructuraDibujo}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center", //
                gap: "16px",
                justifyContent: "center",
              }}
            >
              <TextField
                id="outlined-read-only-input"
                label="Capacidad de la flota"
                value={totalFlota}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TiempoActual
                simulacionEnCurso={simulacionEnCurso}
                fechaSeleccionada={tiempoIni}
              />
              <Button
                variant="contained"
                color={buttonClicked ? "error" : "success"}
                endIcon={<InicioSimulacion />}
                style={{ width: "100%" }}
                onClick={handleClickInicio}
              >
                {buttonClicked ? "Pausar" : "Iniciar"}
              </Button>
              <TableContainer component={Paper}>
                <Table
                  sx={{ minWidth: 400, maxHeight: 440 }}
                  aria-label="simple table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Vehiculo</TableCell>
                      <TableCell align="right">Pedido m3</TableCell>
                      <TableCell align="right">Cliente</TableCell>
                      <TableCell align="right">Entrega</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {estructuraTabla &&
                      estructuraTabla.length > 0 &&
                      estructuraTabla.map((row) => (
                        <TableRow
                          key={row.idped_t}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {row.vehi_t}
                          </TableCell>
                          <TableCell align="right">{row.pedi_t}</TableCell>
                          <TableCell align="right">{row.clie_t}</TableCell>
                          <TableCell align="right">
                            ({row.x_t},{row.y_t})
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ display: "flex", alignItems: "end" }}>
                <Leyenda />
              </Box>
            </div>
          </div>
        </Box>
      </Box>
      {mostrarModal && <mensajeExito texto={mensajeSnackbar}/>}
    </div>
  );
}

export default GrillaSimulacion;
