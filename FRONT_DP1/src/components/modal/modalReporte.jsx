import * as React from 'react';
import { styled, css } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';
import Button from "@mui/material/Button";
import DownloadIcon from '@mui/icons-material/Download';
import axiosClient from "../../api/AxiosClient";

const CenteredModal = styled(BaseModal)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const ModalContent = styled('div')(
  ({ theme }) => css`
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 0.5)' : 'rgb(0 0 0 / 0.2)'};
    padding: 24px;
    color: ${theme.palette.mode === 'dark' ? grey[50] : grey[900]};

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

export const axiosPDF = () => {
  axiosClient.interceptors.request.use(
    async (config) => {
      config.headers = {
        Accept: "application/pdf",
        //"Content-Type": "application/json",
        // method: "POST",
      };
      return config;
    },
    (error) => {
      Promise.reject(error.response.blob);
    }
  );
  return axiosClient.get("back/api/v1/simulacion/generar",{responseType: 'blob'});
};

export default function MensajeExito () {
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDownload = async () => {
    try {
      const response = await axiosPDF();

      console.log("pdf:" + response.blob);

      // Crear un Blob a partir de la respuesta
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Crear un enlace para iniciar la descarga
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Reporte_Semanal.pdf';

      // Simular un clic en el enlace para iniciar la descarga
      link.click();

      // Liberar recursos
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error al descargar el PDF:', error);
    }
  };

  return (
    <div>
      <CenteredModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
      >
        <ModalContent>
          <h2 id="unstyled-modal-title" className="modal-title">
            Simulacion Semanal concluida con exito
          </h2>
          <Button
            variant="contained"
            color="success"
            endIcon={<DownloadIcon />}
            onClick={handleDownload}
            style={{ width: "55%", marginTop: "20px" }}
          >Descargar Reporte</Button>
        </ModalContent>
      </CenteredModal>
    </div>
  );
}