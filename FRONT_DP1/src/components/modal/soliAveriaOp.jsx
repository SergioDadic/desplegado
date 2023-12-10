import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import InicioSimulacion from "@mui/icons-material/PlayArrow";
import { axiosInicializaOP } from "../../api/AxiosSimulacion";
import { useNavigate } from "react-router-dom";

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
};

export default function SoliAveriaOp(props) {
  const { fechaTP, dateAux,scale } = props;

  const navigate = useNavigate();

  //Formatear fecha
  function formatDate(fecha) {
    const auxDate = fecha.toDate() || new Date();
    let dia = auxDate.getDate().toString().padStart(2, "0");
    let mes = (auxDate.getMonth() + 1).toString().padStart(2, "0");
    let anio = auxDate.getFullYear();
    let hora = auxDate.getHours().toString().padStart(2, "0");
    let minuto = auxDate.getMinutes().toString().padStart(2, "0");
    return `${anio}-${mes}-${dia} ${hora}:${minuto}`;
  }

  /************** MODAL **************/
  const [open, setOpen] = React.useState(false);
  
  const handleClose = () => setOpen(false);
  const handleOpen = () => handleContinue();

  //Continuar sin registrar
  const handleContinue = () => {
    const auxDate = fechaTP.toDate();
    axiosInicializaOP(1, formatDate(fechaTP))
      .then(() => {
        navigate("/Operacion", {
          state: {
            auxDate,
            scale,
          },
        });
      })
      .catch((error) => {
        console.error(`Error: ${error}`);
      });
  };

  return (
    <div>
      <Button
        variant="contained"
        color="success"
        endIcon={<InicioSimulacion />}
        style={{ width: "100%", marginTop: "8px" }}
        onClick={handleOpen}
      >
        Iniciar Operación
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            fontWeight="400"
            fontSize={"20px"}
            style={{ color: "#2E7D32" }}
          >
            ¿No desea registrar alguna avería?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            La simulación iniciará a las {formatDate(dateAux)}
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "16px",
              gap:"8px"
            }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={handleContinue}
              style={{width:"100%"}}
            >
              No, iniciar simulación
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleClose}
              style={{width:"100%"}}
            >
              Cancelar
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
