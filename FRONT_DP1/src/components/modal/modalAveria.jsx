import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import ModalIncidencia from "./modalIncidencia";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InicioSimulacion from "@mui/icons-material/PlayArrow";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

export default function ModalAveria(props) {
  const { simuop, setAccionado } = props;
  //Variables para el modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //Para la carga de archivos
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
  });

  /*AXIOS*/

  //Guardar incidencias (archivo)
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    /*axios subida archivos*/
  };

  //Iniciar
  const handleContinue = () => {
    setAccionado(true);
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        color="warning"
        endIcon={<InicioSimulacion />}
        onClick={handleOpen}
      >
        Iniciar
      </Button>
      {simuop !== 2 && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <form onSubmit={handleSubmit}> */}
          <form>
            <Box sx={style}>
              <Typography
                fontWeight="400"
                fontSize={"20px"}
                style={{ color: "#2E7D32" }}
              >
                ¿No desea registrar alguna avería?
              </Typography>
              <ModalIncidencia />
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
              >
                Subir archivo de averías
                <VisuallyHiddenInput type="file" />
              </Button>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 8,
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleContinue}
                >
                  No, iniciar
                </Button>
              </div>
            </Box>
          </form>
        </Modal>
      )}
    </>
  );
}
