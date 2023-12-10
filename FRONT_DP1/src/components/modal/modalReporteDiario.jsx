import * as React from 'react';
import { styled, css } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';
import Button from "@mui/material/Button";
import DownloadIcon from '@mui/icons-material/Download';
import { axiosCliente } from "../../services/axiosCliente";
import { toast } from 'react-toastify';
import { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';

const CenteredModal = styled(BaseModal)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  position: fixed;
  top: 50%; /* Centrado verticalmente */
  left: 50%; /* Centrado horizontalmente */
  transform: translate(-50%, -50%); /* Ajusta la posición en relación con el tamaño del modal */
  z-index: 10000;
`;
const ModalContent = styled('div')(
  ({ theme }) => css`
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow: hidden;
    background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 0.5)' : 'rgb(0 0 0 / 0.2)'};
    padding: 40px;
    & .modal-title {
      margin: 0;
      line-height: 1.5rem;
      margin-bottom: 8px;
    }

    & .modal-description {
      margin: 0;
      line-height: 1.5rem;
      font-weight: 400;
      color: ${theme.palette.mode === 'dark' ? grey[400] : grey[800]};
      margin-bottom: 4px;
    }
    background-color: #8CBD2A; /* Color de fondo del modal */
    color: #F6F4EB; /* Color de texto del modal */

    .modal-description {
      /* Estilos específicos para el párrafo */
      margin: 0;
      line-height: 1.5rem;
      font-weight: 400;
      margin-bottom: 4px;
      color: #F6F4EB;
    }
  `,
);

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const MensajeExito = ({ onClose }) => {
  const [open, setOpen] = useState(true);
  const [loadingReporte, setLoadingReporte] = useState(true);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setOpen(false);
      onClose(); // Llamar a la función onClose para cerrar el modal desde el componente padre
      handleGenerateReport(); // Iniciar la descarga del PDF después de cerrar el modal
    }, 5000); // 5000 milisegundos = 5 segundos

    return () => clearTimeout(timerId); // Limpiar el temporizador al desmontar el componente
  }, [onClose]);

  const handleGenerateReport = async () => {
    try {
      setLoadingReporte(true);
      const response = await axiosCliente().get(`/api/v1/simulacion/generar`, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf',
        },
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'REPORTE DE INFRACCIONES DE LOS VEHÍCULOS.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(`Error: ${error}`);
      toast.error("Error en la carga de vehículos");
    } finally {
      setLoadingReporte(false);
    }
  };

  return (
    <div>
      <CenteredModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={onClose}  // Asociar la función onClose al evento onClose del modal
      >
        <ModalContent>
          <h2 id="unstyled-modal-title" className="modal-title">
            Operación diaria concluida con éxito
          </h2>
          <p id="unstyled-modal-description" className="modal-description">
            Se ha descargado el reporte.
          </p>
        </ModalContent>
      </CenteredModal>
    </div>
  );
};

export default MensajeExito;
