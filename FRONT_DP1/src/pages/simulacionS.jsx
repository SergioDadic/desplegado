import React, {
  Component,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AxiosBloqueos } from "../api/AxiosBloqueo";
import { axiosInicializaSimulacion } from "../api/AxiosSimulacion";
import { axiosGetListaVehiculos } from "../api/AxiosSimulacion";
import Simulacion from "./sistemaCoordenadasCartesianas";

/* Variables globales generales*/
let coordenadasEntregas = [];
let objetoBloqueos = [];
let objetoGrilla = {
  coordenadasVehiculos: [],
  lineaDeRutas: [],
  puntosDeLlegada: [],
  bloqueos: [],
};
let tiempo_actual_real_unix;
let respuesta_aux_ge;
let respuesta_init_f;
let respuesta_follow_f;

let anio_f;
let mes_f;
let dia_f;
let hora_f;
let minuto_f;
let fecha_f;


//Objeto para manejar la info de los vehículos
let vehiculos_simu = new Map();

let vehiculos_entregando = 0;
let vehiculos_en_almacen = 0;
let pedidos_pendientes = 0;
let pedidos_entregados = 0;

// Banderas para manejar las interrupciones
let bandera_final = false;

const SimulacionS = ({
  ancho,
  alto,
  escala,
  tiempoInicial,
  setOpenModal,
}) => {
  // Variables para la navegación
  let navigate = useNavigate();
  const location = useLocation();

  //Variable para el manejo de fin de simulación
  const [key, setKey] = useState(0);
  const [endSimulation, setEndSimulation] = useState(false);
  const [estructuraDibujo, setEstructuraDibujo] = useState(objetoGrilla);
  
  // Para abrir el snackbar de finalización o error
  const [condicionOpen, setCondicionOpen] = useState(false);

  //Variables para el Path
  const [fecha, setFecha] = useState("");
  const [simulacionEjecutada, setSimulacionEjecutada] = useState(false);
  const [dia, setDia] = useState(0);
  const [mes, setMes] = useState(0);
  const [anio, setAnio] = useState(0);
  const [hora, setHora] = useState(0);
  const [minuto, setMinuto] = useState(0);
  const [fechaSimulacion, setFechaSimulacion] = useState({
    anio: 0,
    mes: 0,
    dia: 0,
    hora: 0,
    minuto: 0,
  });

  //Para que se abra el modal
  useEffect(() => {
    if (condicionOpen) setOpenModal(true);
  }, [condicionOpen]);

  /*Función para obtener los elementos de la grilla*/
  async function obtenerElementos(tiempo_actual_unix, tiempo_a_simular) {
    let tiempo_transcurrido = 0;
    //Tiempo de simulacion que se ha decidido simular = tiempo_actual_unix + tiempo
    let stop = await sumarMinutosATiempoUnix(tiempo_actual_real_unix, 15);

    // Tasa de tiempo incremento en minutos
    const tasa_tiempo_incremento = 1;

    // v_tiempo con el que se dibuja
    let v_tiempo; //10080
    let aux_parada = convertToUnixTime(anio, mes, dia, hora, minuto); //Tiempo Unix del momento donde se inicia la simulacion
    let parada = await sumarMinutosATiempoUnix(aux_parada, 1040); //Tiempo donde acaba la simulación semanal

    //Recorre los 15 minutos
    while (tiempo_transcurrido <= tiempo_a_simular) {
      if (tiempo_transcurrido !== 0) {
        tiempo_actual_unix = await sumarMinutosATiempoUnix(
          v_tiempo,
          tasa_tiempo_incremento
        );
        tiempo_actual_real_unix = tiempo_actual_unix;
      }
      v_tiempo = tiempo_actual_unix;
      if (v_tiempo >= parada) {
        bandera_final = true;
        setCondicionOpen(true);
        //mensaje_final = "Simulacion Semanal concluida con exito";
        console.log("Simulacion Semanal concluida con exito");
        break;
      }
      const pedidos = respuesta_aux_ge;
      let vehiculos = [];
      let puntos_llegada = [];
      let rutas = [];
      for (let i = 0; i < pedidos.length; i++) {
        let pedido = pedidos[i];
        //Coordenada actual del vehiculo
        vehiculos.push([pedido.x, pedido.y]);

        //Rutas
        let movimiento = pedido.movement;
        // console.log(movimiento.length)
        for (let j = 0; j < movimiento.length - 1; j++) {
          //falta logica del tiempo
          let ini = [],
            fin = [],
            recorrido = [];
          ini.push(movimiento[j].x);
          ini.push(movimiento[j].y);
          fin.push(movimiento[j + 1].x);
          fin.push(movimiento[j + 1].y);
          recorrido.push(ini);
          recorrido.push(fin);
          rutas.push(recorrido);
        }

        //Puntos de llegada
        let coord_llegada = pedido.totalOrders;
        for (let j = 0; j < coord_llegada.length; j++) {
          let destino = [];
          destino.push(coord_llegada[0].x);
          destino.push(coord_llegada[0].y);
          puntos_llegada.push(destino);
        }
      }
      const estructura = {
        coordenadasVehiculos: vehiculos,
        lineaDeRutas: rutas,
        puntosDeLlegada: puntos_llegada,
        bloqueos: [],
      };
      objetoGrilla = estructura;
      //console.log(objetoGrilla.lineaDeRutas);
      tiempo_transcurrido += tasa_tiempo_incremento;
    }
    setEndSimulation(true);
    await sleep(130);
    //const puntos_llegada = [[50,30],[1,39],[30,47],[5,10],[10,30]];
    //const coordBloqueos = [[[10,40],[11,40],[12,40],[13,40],[14,40],[15,40],[15,41],[15,42],[15,43]],
    //                           [[29,10],[29,11],[29,12],[29,13]]];
    // const estructura = {
    //   coordenadasVehiculos: [],
    //   lineaDeRutas: [],
    //   puntosDeLlegada: puntos_llegada,
    //   bloqueos: coordBloqueos,
    // };
  }

  /*Función que ejecuta la simulación*/
  const ejecucionSimulacion = async () => {
    //Inializamos fecha final
    const fechaOriginal = new Date(fecha);
    const fechaFin = new Date(fechaOriginal);
    fechaFin.setDate(fechaOriginal.getDate() + 7);
    console.log("fecha2", fecha);

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

    //Aquí se inicializa la simulación
    await getHandshake();
    await getRutas();

    //Itera llamadas al api y el dibujado
    while (contador_llamadas < numero_maximo_llamadas) {
      respuesta_follow_f = null;
      if (bandera_final) {
        break;
      }

      //Empleando el init
      if (contador_llamadas === 0) {
        //Para que se dibujen los almacenes
        respuesta_aux_ge = JSON.parse(JSON.stringify(respuesta_init_f));
        console.log(respuesta_aux_ge);
        await obtenerElementos(tiempo_actual_real_unix, 15);
      }

      //console.log("cont", contador_llamadas);
      // Hacemos el follow -> follow
      if (contador_llamadas >= 1) {
        contador_llamadas = 1;
        await getRutas();
        respuesta_aux_ge = JSON.parse(JSON.stringify(respuesta_init_f));
        //console.log("ingresa a 1");
        await obtenerElementos(tiempo_actual_real_unix, 15);
        //break;
      }
      setEndSimulation(false);
      contador_llamadas++;
      await sleep(130);
    }
    console.log("Acabo");
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

  //Extra para obtener datos
  let respuestaAux;

  // sleep
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /*Axios*/
  async function getHandshake() {
    // return axiosInicializaSimulacion(1, fecha)
    return axiosInicializaSimulacion(1, "2023-03-13 00:01")
      .then(() => {})
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  }

  async function getRutas() {
    return axiosGetListaVehiculos(1)
      .then((response) => {
        let data = response.data || {};
        // Hacemos una copia profunda de data antes de asignarlo a respuesta_follow_f
        respuesta_init_f = JSON.parse(JSON.stringify(data));
        respuestaAux = JSON.parse(JSON.stringify(data));
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  }

  // useEffect(() => {
  //   setInfoTabla(respuesta_init_f);
  // }, [respuesta_init_f]);

  /*Función para inicializar la simulación con la fecha proporcionada*/
  useEffect(() => {
    // Si la fecha tiene valor y la simulación no se ha ejecutado, ejecuta la simulación
    if (fecha && !simulacionEjecutada) {
      // Ejecuta la simulación
      ejecucionSimulacion();

      // Marca la simulación como ejecutada
      setSimulacionEjecutada(true);
    }
  }, [fecha, simulacionEjecutada]); // useEffect se ejecutará cuando fecha o simulacionEjecutada cambien de valor.

  useEffect(() => {
    //Inializamos fecha actual
    const { dia, mes, anio, hora, minuto } = tiempoInicial;
    const mesFormat = mes.toString().padStart(2, "0"); // JavaScript cuenta los meses desde 0
    const diaFormat = dia.toString().padStart(2, "0");
    const horaFormateada = hora.toString().padStart(2, "0");
    const minutoFormateado = minuto.toString().padStart(2, "0");

    setDia(diaFormat);
    setMes(mesFormat);
    setAnio(anio);
    setHora(horaFormateada);
    setMinuto(minutoFormateado);
    const fechaFormateada = `${anio}-${mesFormat}-${diaFormat} ${horaFormateada}:${minutoFormateado}`;
    setFecha(fechaFormateada);
  }, []);

  useEffect(() => {
    if (endSimulation) {
      console.log("se cambia el valor");
      setKey((prevKey) => prevKey + 1); // Incrementa la key para forzar la actualización del componente Simulacion
      setEstructuraDibujo(objetoGrilla);
    }
  }, [endSimulation]);

  // setInfoTabla(respuestaAux);
  return (
    <>
      {endSimulation && (
        <Simulacion
          key={key}
          width={ancho}
          height={alto}
          scale={escala}
          estructura={estructuraDibujo}
        />
      )}
    </>
  );
};

export default SimulacionS;
