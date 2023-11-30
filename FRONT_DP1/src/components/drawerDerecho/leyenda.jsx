import React from "react";
import "./drawerDerecho.css";
import puntoLllegada from "../../img/endpoint2.png";
import gasolineraPrincipal from "../../img/gasolineraPrincipal.png";
import gasolineraIntermedia from "../../img/gasolineraIntermedia.png";
import rutaDestino from "../../img/rutadestino.png";
import rutaAlmacen from "../../img/rutaalmacen.png";
import "./leyenda.css";
import Fab from "@mui/material/Fab";
import MapIcon from "@mui/icons-material/Map";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 325,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

function Leyenda() {
  //Variables para el modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    //
    <div>
      <Fab color="success" aria-label="add" onClick={handleOpen}>
        <MapIcon />
      </Fab>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div
            className="leyenda"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              justifyContent: "center",
            }}
          >
            <label className="titulo">Leyenda</label>
            <div
              className="infoLeyenda"
              style={{ marginLeft: "20%", flexDirection: "row", gap: "16%" }}
            >
              <img src={gasolineraPrincipal} alt="Gasolinera Principal"></img>
              <label htmlFor="">Gasolinera principal</label>
              <img src={gasolineraIntermedia} alt="Gasolinera Intermedia"></img>
              <label htmlFor="">Gasolinera intermedia</label>
              <img src={puntoLllegada} alt="Punto final"></img>
              <label htmlFor="">Punto final</label>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
              >
                <path
                  d="M15.9569 3.11548L8.50718 3.11548C7.45149 3.11548 6.59546 4.21742 6.59546 5.57642V7.9122L6.14444 8.0441L5.81372 10.3748L6.0422 12.7275L8.39986 12.7131C8.43686 12.7165 8.47018 12.7275 8.5069 12.7275H15.9566C17.0132 12.7275 17.8689 11.6261 17.8689 10.2665V5.5767C17.8695 4.2177 17.0132 3.11548 15.9569 3.11548Z"
                  fill="#F48020"
                />
                <path
                  d="M15.9569 3.12024L8.50718 3.12024C7.45149 3.12024 6.59546 4.2219 6.59546 5.58118V7.91724L6.14444 8.04915L5.81372 10.3796L5.97244 12.017L6.14444 10.8085L6.59546 10.6766V8.3408C6.59546 6.9818 7.4512 5.87986 8.50718 5.87986H15.9569C17.0134 5.87986 17.8692 6.98208 17.8692 8.3408V5.5809C17.8692 4.2219 17.0134 3.12024 15.9569 3.12024Z"
                  fill="#F9A425"
                />
                <path
                  d="M5.58219 5.88146H4.06502C2.79751 5.96387 0.276609 6.5424 0.324903 9.83865L0.324903 11.052C0.324903 12.0901 0.778472 12.9313 1.33682 12.9313H5.58162C6.14053 12.9313 6.59439 12.0903 6.59439 11.052V7.76021C6.59439 6.7224 6.14082 5.88062 5.58162 5.88062"
                  fill="#E3E4E3"
                />
                <path
                  d="M5.98747 4.72192H5.07807C4.31977 4.76524 2.81022 5.06561 2.83903 6.77758V7.40674C2.83903 7.94617 3.11157 8.38296 3.44511 8.38296H5.9869C6.32101 8.38296 6.59298 7.94617 6.59298 7.40674V5.6987C6.59355 5.15927 6.32129 4.72192 5.98719 4.72192"
                  fill="#E3E4E3"
                />
                <path
                  d="M3.64714 6.7981H2.8863C2.25113 6.84535 0.987013 7.17638 1.01158 9.06216V9.75628C1.01158 10.3506 1.23837 10.8323 1.51881 10.8323H3.64714C3.92759 10.8323 4.1555 10.3506 4.1555 9.75628V7.87331C4.1555 7.2796 3.92759 6.79838 3.64714 6.79838"
                  fill="#A2C2CA"
                />
                <path
                  d="M2.55309 9.1561C2.5161 8.36129 2.5706 7.54398 2.80586 6.79529C2.16674 6.84591 0.918718 7.18426 0.942724 9.05935V9.75348C0.942724 10.3478 1.17007 10.8295 1.45052 10.8295H2.83354C2.6703 10.3264 2.58162 9.76979 2.55309 9.15723"
                  fill="#83AFB7"
                />
                <path
                  d="M6.0128 13.4277C6.01236 13.9451 5.80566 14.4411 5.43813 14.8068C5.07061 15.1725 4.57233 15.3779 4.0528 15.3779C3.53356 15.3774 3.03571 15.1718 2.66855 14.8062C2.3014 14.4405 2.09493 13.9448 2.09448 13.4277C2.09463 12.9105 2.30098 12.4144 2.66819 12.0487C3.0354 11.6829 3.53341 11.4772 4.0528 11.4769C4.31011 11.4769 4.56493 11.5273 4.80269 11.6252C5.04044 11.7232 5.25649 11.8669 5.4385 12.0481C5.6205 12.2292 5.76489 12.4443 5.86343 12.681C5.96197 12.9177 6.01273 13.1714 6.0128 13.4277Z"
                  fill="white"
                />
                <path
                  d="M5.66534 13.4277C5.66497 13.8532 5.49496 14.2612 5.19268 14.5619C4.8904 14.8627 4.48058 15.0317 4.05328 15.0317C3.62627 15.0311 3.2169 14.862 2.91495 14.5613C2.61301 14.2606 2.44315 13.8529 2.44263 13.4277C2.44824 13.0058 2.62047 12.603 2.92205 12.3067C3.22363 12.0103 3.63028 11.8441 4.05398 11.8441C4.47769 11.8441 4.88434 12.0103 5.18592 12.3067C5.4875 12.603 5.65973 13.0058 5.66534 13.4277Z"
                  fill="#243438"
                />
                <path
                  d="M5.09762 13.4053C5.09762 13.6812 4.98757 13.9457 4.79168 14.1408C4.59579 14.3359 4.33011 14.4455 4.05308 14.4455C3.77605 14.4455 3.51037 14.3359 3.31448 14.1408C3.11859 13.9457 3.00854 13.6812 3.00854 13.4053C3.01629 13.1345 3.12973 12.8775 3.32478 12.6887C3.51982 12.4999 3.78109 12.3943 4.05308 12.3943C4.32507 12.3943 4.58634 12.4999 4.78139 12.6887C4.97643 12.8775 5.08988 13.1345 5.09762 13.4053Z"
                  fill="#969796"
                />
                <path
                  d="M14.0747 13.6801C14.0746 14.1306 13.8948 14.5626 13.575 14.8811C13.2551 15.1997 12.8213 15.3787 12.3689 15.3788C11.9166 15.3785 11.4829 15.1995 11.163 14.8809C10.8432 14.5624 10.6634 14.1305 10.6631 13.6801C10.6632 13.2296 10.843 12.7976 11.1629 12.479C11.4827 12.1605 11.9165 11.9815 12.3689 11.9813C12.5929 11.9813 12.8147 12.0253 13.0217 12.1106C13.2287 12.196 13.4167 12.3211 13.5751 12.4789C13.7335 12.6366 13.8592 12.8239 13.9449 13.03C14.0306 13.2361 14.0747 13.457 14.0747 13.6801Z"
                  fill="white"
                />
                <path
                  d="M13.7725 13.68C13.7725 14.0503 13.6247 14.4055 13.3618 14.6674C13.0988 14.9293 12.7421 15.0764 12.3702 15.0764C11.9983 15.0764 11.6417 14.9293 11.3787 14.6674C11.1158 14.4055 10.968 14.0503 10.968 13.68C10.9679 13.4967 11.004 13.3151 11.0743 13.1457C11.1446 12.9764 11.2478 12.8224 11.3779 12.6927C11.508 12.5631 11.6625 12.4602 11.8325 12.39C12.0025 12.3198 12.1848 12.2836 12.3688 12.2836C12.5531 12.2833 12.7356 12.3193 12.9059 12.3894C13.0762 12.4595 13.231 12.5623 13.3613 12.692C13.4917 12.8217 13.5951 12.9757 13.6657 13.1452C13.7362 13.3148 13.7725 13.4965 13.7725 13.68Z"
                  fill="#243438"
                />
                <path
                  d="M13.2794 13.6611C13.2794 13.7801 13.2559 13.8979 13.2101 14.0079C13.1644 14.1178 13.0974 14.2177 13.0129 14.3018C12.9284 14.3859 12.8281 14.4526 12.7177 14.4982C12.6073 14.5437 12.4889 14.5671 12.3695 14.567C12.1897 14.5669 12.014 14.5136 11.8647 14.4141C11.7153 14.3145 11.5989 14.1731 11.5302 14.0077C11.4615 13.8423 11.4436 13.6603 11.4787 13.4848C11.5138 13.3092 11.6004 13.148 11.7276 13.0214C11.8547 12.8949 12.0166 12.8087 12.1929 12.7738C12.3692 12.7388 12.5519 12.7567 12.718 12.8252C12.8841 12.8936 13.0261 13.0096 13.126 13.1584C13.2259 13.3072 13.2793 13.4821 13.2794 13.6611Z"
                  fill="#969796"
                />
                <path
                  d="M17.5639 13.6612C17.5637 13.8841 17.5194 14.1047 17.4336 14.3106C17.3478 14.5165 17.2221 14.7035 17.0637 14.8609C16.9053 15.0184 16.7173 15.1433 16.5104 15.2284C16.3035 15.3136 16.0819 15.3573 15.858 15.3571C15.6342 15.3569 15.4126 15.3128 15.2059 15.2273C14.9992 15.1419 14.8114 15.0167 14.6532 14.859C14.4951 14.7012 14.3697 14.514 14.2842 14.308C14.1987 14.102 14.1548 13.8812 14.155 13.6583C14.1554 13.2082 14.3353 12.7766 14.6552 12.4585C14.9751 12.1405 15.4088 11.962 15.8609 11.9624C16.3129 11.9628 16.7463 12.142 17.0656 12.4605C17.385 12.7791 17.5642 13.211 17.5639 13.6612Z"
                  fill="white"
                />
                <path
                  d="M17.2617 13.6612C17.2612 14.0316 17.1132 14.3868 16.85 14.6486C16.5868 14.9104 16.23 15.0575 15.858 15.0576C15.4861 15.0576 15.1295 14.9105 14.8665 14.6486C14.6035 14.3867 14.4558 14.0315 14.4558 13.6612C14.4558 13.2908 14.6035 12.9356 14.8665 12.6738C15.1295 12.4119 15.4861 12.2648 15.858 12.2648C16.0423 12.2647 16.2247 12.3007 16.395 12.3708C16.5652 12.4409 16.72 12.5438 16.8503 12.6734C16.9806 12.8031 17.0841 12.9571 17.1546 13.1266C17.2252 13.296 17.2616 13.4777 17.2617 13.6612Z"
                  fill="#243438"
                />
                <path
                  d="M16.7674 13.6421C16.7695 13.7624 16.7476 13.8818 16.7028 13.9935C16.6581 14.1053 16.5915 14.207 16.5068 14.2928C16.4222 14.3786 16.3212 14.4467 16.2098 14.4932C16.0985 14.5397 15.9789 14.5637 15.8581 14.5637C15.7374 14.5637 15.6178 14.5397 15.5064 14.4932C15.395 14.4467 15.2941 14.3786 15.2094 14.2928C15.1248 14.207 15.0582 14.1053 15.0134 13.9935C14.9687 13.8818 14.9467 13.7624 14.9489 13.6421C14.9531 13.4047 15.0507 13.1785 15.2208 13.0121C15.3908 12.8457 15.6197 12.7524 15.8581 12.7524C16.0965 12.7524 16.3254 12.8457 16.4955 13.0121C16.6655 13.1785 16.7632 13.4047 16.7674 13.6421Z"
                  fill="#969796"
                />
                <path
                  d="M0.941403 11.8328C0.941403 12.3058 0.749356 12.6897 0.511839 12.6897C0.274605 12.6897 0.0822754 12.3058 0.0822754 11.8328V11.8137C0.0822754 11.3412 0.274605 10.9584 0.511839 10.9584C0.749356 10.9584 0.941403 11.3412 0.941403 11.8137V11.8328Z"
                  fill="#F1F1F1"
                />
                <path
                  d="M17.9927 10.8416C17.9927 11.3147 17.8007 11.6975 17.5629 11.6975C17.3259 11.6975 17.1333 11.3147 17.1333 10.8416V10.8231C17.1333 10.3495 17.3259 9.96667 17.5629 9.96667C17.8009 9.96667 17.9927 10.3495 17.9927 10.8231V10.8416Z"
                  fill="#DF394C"
                />
              </svg>
              <label htmlFor="">Camión cisterna</label>

              <img src={rutaDestino} alt="Ruta destino"></img>
              <label htmlFor="">Ruta al destino</label>
              <img src={rutaAlmacen} alt="Ruta almacén"></img>
              <label htmlFor="">Ruta al almacén</label>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
              >
                <path
                  d="M6.49991 0.650391C5.34288 0.650391 4.21185 0.993487 3.24982 1.63629C2.28779 2.2791 1.53798 3.19274 1.09521 4.26169C0.652437 5.33064 0.536588 6.50688 0.762311 7.64167C0.988035 8.77646 1.54519 9.81883 2.36333 10.637C3.18147 11.4551 4.22384 12.0123 5.35863 12.238C6.49342 12.4637 7.66966 12.3479 8.7386 11.9051C9.80755 11.4623 10.7212 10.7125 11.364 9.75048C12.0068 8.78845 12.3499 7.65741 12.3499 6.50039C12.3499 4.94887 11.7336 3.4609 10.6365 2.36382C9.53939 1.26673 8.05142 0.650391 6.49991 0.650391ZM9.74991 7.15039H3.2499V5.85039H9.74991V7.15039Z"
                  fill="#BB631A"
                />
              </svg>
              <label htmlFor="">Bloqueo</label>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default Leyenda;