import React, { Component, useState, useEffect, useRef }  from 'react';
import BarraSuperior from "../components/barraSuperior/barraSuperior";
import { Box,Button,Divider,LinearProgress,ListSubheader,Modal,TextField} from "@mui/material";
import fondo from "../img/fondo.png";
import colores from "../colors/colores";
import { useNavigate } from "react-router-dom";
import { axiosCliente } from "../services/axiosCliente";
import MensajeExito from "../components/mensaje/mensajeExito";
import ModalFlota from "../components/modal/modalRegistroFlota";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCircleXmark} from '@fortawesome/free-solid-svg-icons';
import {  Card, Form,  InputGroup} from 'react-bootstrap';
import CircularProgress from '@mui/material/CircularProgress';
/* Imagenes */
import Averias from '../img/Averias.png';
import Subida from '../img/Subida.png';
import Tipo from '../img/Tipo.png';

function CargaArchivos() {

    /*Variables que me ayudaran para la navegación*/
    let navigate = useNavigate();
  
    /*Variables para almacenar los archivos y el tipo de simulacion*/
    const [archivosAverias, setArchivosAverias] = useState([]);
    const [archivosBloqueos, setArchivosBloqueos] = useState([]);
    const [archivosPedidos, setArchivosPedidos] = useState([]);
  
    /* Variables para verificación de subida o cancelamiento de archivos */
    const [archivoCargadoAverias, setArchivoCargadoAverias] = useState(false);
    const [archivoCargadoPedidos, setArchivoCargadoPedidos] = useState(false);
    const [archivoCargadoBloqueos, setArchivoCargadoBloqueos] = useState(false);
    const inputFileRefAverias = useRef(null);
    const inputFileRefBloqueos= useRef(null);
    const inputFileRefPedidos = useRef(null);
  
    /*Variables para mensajes de error*/
    const [errorAverias, setErrorAverias] = useState("");
    const [errorBloqueos, setErrorBloqueos] = useState("");
    const [errorPedidos, setErrorPedidos] = useState("");
    
    const color = '#DF0808';

  //Subida de archivos
  const [file, setFile] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [siguiente, setSiguiente] = useState(true);
  const [progress, setProgress] = useState(0);
  const [filesNames, setFilesNames] = useState([]);

  const handleClick = () => {
    navigate("/Simulacion");
  };

  // FUNCIONES PARA SUBIDA DE PEDIDOS
  const handlePedidos = (event) => {
    if (event && event.target && event.target.files.length > 0) {
      // Almacenamos todos los archivos seleccionados
      const archivosSeleccionados = Array.from(event.target.files);
      setArchivosPedidos(archivosSeleccionados);
      console.log("Archivos de pedidos", archivosSeleccionados);
      setErrorPedidos("");
    } else {
      console.error("Objeto event se encuentra vacío");
    }
  }

  const handleEliminarArchivoPedidos = () => {
    setArchivosPedidos([]);
    inputFileRefPedidos.current.value = null;
  }


  /* FUNCIONES PARA SUBIDA DE BLOQUEOS*/
  const handleBloqueos = (event) => {
    if (event && event.target && event.target.files.length > 0) {
      // Almacenamos todos los archivos seleccionados
      const archivosSeleccionados = Array.from(event.target.files);
      setArchivosBloqueos(archivosSeleccionados);
      console.log("Archivos de bloqueos", archivosSeleccionados);
      setErrorBloqueos("");
    } else {
      console.error("Objeto event se encuentra vacío");
    }
  }

  const handleEliminarArchivoBloqueos= ()=>{
    setArchivosBloqueos([]);
    inputFileRefBloqueos.current.value = null;
  }



  /* FUNCIONES PARA SUBIDA DE AVERIAS*/
  const handleAverias = (event) => {
    if (event && event.target && event.target.files.length > 0) {
      // Almacenamos todos los archivos seleccionados
      const archivosSeleccionados = Array.from(event.target.files);
      setArchivosAverias(archivosSeleccionados);
      console.log("Archivos de averias", archivosSeleccionados);
      setErrorAverias("");
    } else {
      console.error("Objeto event se encuentra vacío");
    }
  }

  const handleEliminarArchivoAverias = ()=>{
    setArchivosAverias([]);
    inputFileRefAverias.current.value = null;
  }
  
  const handleCargarArchivos = async (event) => {
    event.preventDefault(); // Evitar el comportamiento predeterminado del formulario
    
    // Verificamos que se cumplan todas las validaciones
    const esValido = validacionFinal();
    if(esValido) {
      const formData = new FormData();

      // Aplanamos todos los arreglos de archivos en uno solo
      const archivosParaEnviar = [...archivosAverias, ...archivosBloqueos, ...archivosPedidos];
      
      // Actualizamos filesNames con los archivos a enviar
      setFilesNames(archivosParaEnviar);
      
      // Añadimos cada archivo al objeto FormData
      archivosParaEnviar.forEach((archivo) => {
        formData.append("files", archivo);
      });
  
      try {
        setLoadingFiles(true);
        const response = await axiosCliente().post("back/api/v1/SubidaDeArchivos/subidaDeArchivos",formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if(response){
          console.log("Se han cargado los archivos");
          const data = response.data;
          setSiguiente(false);
        }
      } catch (error) {
        console.error("Error al cargar archivos: ", error);
        setLoadingFiles(false);
      } finally {
        setLoadingFiles(false);
      }
    }
  };

  const validacionFinal=()=>{
    let contador = 0;
    let valido = true;

    if(archivosAverias.length === 0){
        setErrorAverias("Debes subir al menos un archivo de averías");
        contador++;
    }

    if(archivosBloqueos.length === 0){
      setErrorBloqueos("Debes subir al menos un archivo de bloqueos");
      contador++;
    }

    if (archivosPedidos.length === 0) {
      setErrorPedidos("Debes subir al menos un archivo de pedidos");
      contador++;
    }
    
    if(contador!==0) valido = false;

    return valido;
  }

  //Carga flota
  const [activContinua, setActivContinua] = useState(false);
  const [activFlota, setActivFlota] = useState(false);
  const [activArch, setActivArch] = useState(false);

  return (
    <div style={{ backgroundColor: colores.fondo, minHeight: "100vh" }}>
      <Box sx={{ display: "flex" }}>
        <BarraSuperior />
        <Box component="main" sx={{ flexGrow: 1, p: 3, paddingTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={fondo} alt="Fondo" style={{ width: "70%", height: "auto" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <h3 className="tituloPagina">
              Bienvenido al sistema de gestión de entregas - SAG
            </h3>
          </div>
          <Divider light  />
          <div style={{ backgroundColor: '#FFFFFF', margin: "20px", display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            
            <div style={{ maxWidth: '30%', margin: '10px', textAlign: 'justify' }}>
              <div style={{ maxWidth: '100%', margin: '10px', display: 'flex', textAlign: 'justify' }}>
                <div style={{ flex: 2 }}>
                <Card.Title style={{ fontWeight: 'bold', color: '#2E7D32', fontSize: 'larger' }}>
                  Subida de Pedidos
                </Card.Title>

                  <h6 className="card-subtitle mb-2 text-muted">
                    Puede ingresar un archivo de pedidos para luego ser entregados durante la simulación seleccionada
                  </h6>
                  <div style={{ height: '10px' }}></div>
                  {errorPedidos && <p style={{ color: 'red' }}>{errorPedidos}</p>}
                  <Form.Group controlId="formFileSm" className="mb-2">
                    <InputGroup size="sm">
                      <Form.Control
                        type="file"
                        ref={inputFileRefPedidos}
                        size="sm"
                        onChange={handlePedidos}
                        multiple // Permite seleccionar múltiples archivos
                      />
                      {archivosPedidos.length > 0 && (
                        <InputGroup.Text style={{ backgroundColor: 'white' }}>
                          <FontAwesomeIcon icon={faCircleXmark} onClick={handleEliminarArchivoPedidos} style={{ color: color, backgroundColor: 'white' }} />
                        </InputGroup.Text>
                      )}
                    </InputGroup>
                  </Form.Group>
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={Tipo} alt="Tipo" style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
              </div>
            </div>

            <div style={{ maxWidth: '30%', margin: '10px', textAlign: 'justify' }}>
              <div style={{ maxWidth: '100%', margin: '10px', display: 'flex', textAlign: 'justify' }}>
                <div style={{ flex: 2 }}>
                <Card.Title style={{ fontWeight: 'bold', color: '#2E7D32', fontSize: 'larger' }}>
                Subida de Bloqueos
                </Card.Title>

                  <h6 className="card-subtitle mb-2 text-muted">
                    Puede ingresar un archivo de bloqueos para luego ser visualizados durante la simulación seleccionada
                  </h6>
                  {errorBloqueos && <p style={{ color: 'red' }}>{errorBloqueos}</p>}
                  <Form.Group controlId="formFileSm" className="mb-2">
                    <InputGroup size="sm">
                      <Form.Control
                        type="file"
                        ref={inputFileRefBloqueos}
                        size="sm"
                        onChange={handleBloqueos}
                        multiple // Permite seleccionar múltiples archivos
                      />
                      {archivosBloqueos.length > 0 && (
                        <InputGroup.Text style={{ backgroundColor: 'white' }}>
                          <FontAwesomeIcon icon={faCircleXmark} onClick={handleEliminarArchivoBloqueos} style={{ color: color, backgroundColor: 'white' }} />
                        </InputGroup.Text>
                      )}
                    </InputGroup>
                  </Form.Group>
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={Subida} alt="Subida" style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
              </div>

            </div>

            <div style={{ maxWidth: '30%', margin: '10px', textAlign: 'justify' }}>
              <div style={{ maxWidth: '100%', margin: '10px', display: 'flex', textAlign: 'justify' }}>
                <div style={{ flex: 2 }}>
                <Card.Title style={{ fontWeight: 'bold', color: '#2E7D32', fontSize: 'larger' }}>
                Subida de Averías
                </Card.Title>

                <h6 className="card-subtitle mb-2 text-muted">
                  Puede ingresar un archivo de averías para luego ser autogeneradas durante la simulación seleccionada
                </h6>
                {errorAverias && <p style={{ color: 'red' }}>{errorAverias}</p>}
                <Form.Group controlId="formFileSm" className="mb-2">
                    <InputGroup size="sm">
                      <Form.Control
                        type="file"
                        ref={inputFileRefAverias}
                        size="sm"
                        onChange={handleAverias}
                        multiple // Permite seleccionar múltiples archivos
                      />
                      {archivosAverias.length > 0 && (
                        <InputGroup.Text style={{ backgroundColor: 'white' }}>
                          <FontAwesomeIcon icon={faCircleXmark} onClick={handleEliminarArchivoAverias} style={{ color: color, backgroundColor: 'white' }} />
                        </InputGroup.Text>
                      )}
                    </InputGroup>
                  </Form.Group>
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={Averias} alt="Averias" style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
              </div>
            </div>

          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            style={{
              backgroundColor: '#2E7D32',
              color: 'white',
              marginTop: '-10px',
              marginRight: "17px"
            }}
            disabled={loadingFiles}
            onClick={handleCargarArchivos} 
          >
          {loadingFiles ? (
            <>
              Cargando
              <CircularProgress size={24} style={{ color: 'white', marginLeft: '35px' }} />
            </>
          ) : (
            "Cargar Archivos"
          )}

          </Button>

            <Button
              disabled={siguiente}
              sx={{
                backgroundColor: '#8CBD2A',
                color: 'white',
                marginTop: '-10px',
                marginRight: '17px',
                '&:disabled': {
                  backgroundColor: '#cfc8c8',
                  color: '#ffffff'
                }
              }}
              onClick={handleClick}
            >
              Siguiente
            </Button>

          </div>

        </Box>

        
      </Box>
    </div>
  );
}

export default CargaArchivos;
