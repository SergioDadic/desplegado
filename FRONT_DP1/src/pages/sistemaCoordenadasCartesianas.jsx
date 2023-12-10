import React, { useEffect, useRef, useState } from "react";
import colores from '../colors/colores'
import useImage from 'use-image';
import gasolineraPrincipal from '../img/gasolineraPrincipal.png'
import gasolineraIntermedia from '../img/gasolineraIntermedia.png'
import puntoLllegada from '../img/endpoint2.png'
import bloqueos from '../img/bloqueo.png'
import vehiculo from '../img/vehiculo.png'

const Card = ({ coord }) => (
    <div style={{ position: "absolute", top: coord.y, left: coord.x, zIndex: 100 }}>
      <div style={{ background: "white", border: "1px solid black", padding: "8px"}}>
        <strong><small>Informacion<br></br></small></strong>
        <small>Placa: {coord.placa}<br></br></small>
        <small>Tipo: {coord.tipo}<br></br></small>
        <small>Posicion: ({coord.origX},{coord.origY})</small>
      </div>
    </div>
);
  
const EndpointCard = ({ coord }) => (
    <div style={{ position: "absolute", top: coord.y, left: coord.x, zIndex: 100 }}>
        <div style={{ background: colores.primario , border: "1px solid black", padding: "8px", color: colores.blanco}}>
        <strong><small>Punto de Llegada<br></br></small></strong>
        <small>Posición: ({coord.origX},{coord.origY})</small>
        </div>
    </div>
);

const CartesianCoordinateSystem = ({width, height,scale,estructura}) => {
    const canvasRef = useRef(null);
    const [image,status] = useImage(gasolineraPrincipal);
    const [image2,status2] = useImage(gasolineraIntermedia);
    const [image3, status3] = useImage(puntoLllegada);
    const [image4, status4] = useImage(bloqueos);
    const [image5, status5] = useImage(vehiculo);
    const [cursor, setCursor] = useState("default");
    const [imagePositions, setImagePositions] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    let tempImagePositions = [];

    useEffect(() => {
        if (status !== 'loaded' || status2 !== 'loaded' || status3 !== 'loaded' || status4 !== 'loaded' || status5 !== 'loaded' ) {
            return;
        }
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
    
        const gridSquareXsize= scale;
        const gridSquareYsize= scale;
    
        canvas.width = (width+2)*scale  +1;
        canvas.height = (height+2)*scale +1;
        ctx.strokeStyle = colores.plomo;
        
       // Dibuja las líneas verticales
        // for (let x = 0; x <= canvas.width; x += gridSquareXsize) {
        //     ctx.beginPath();
        //     ctx.moveTo(x, 0);
        //     ctx.lineTo(x, canvas.height);
        //     ctx.stroke();
        // }

        // // Dibuja las líneas horizontales
        // for (let y = 0; y <= canvas.height; y += gridSquareYsize) {
        //     ctx.beginPath();
        //     ctx.moveTo(0, y);
        //     ctx.lineTo(canvas.width, y);
        //     ctx.stroke();
        // }

        // Almacenar el valor original de globalAlpha
        const originalGlobalAlpha = ctx.globalAlpha;

        // Configurar la transparencia global para las líneas horizontales
        for (let y = 0; y <= canvas.height; y += gridSquareYsize) {
            ctx.beginPath();
            ctx.moveTo(12, y);

            if (y === 0) {
                // Hacer la primera línea transparente
                ctx.globalAlpha = 0;
            }

            ctx.lineTo(canvas.width, y);
            ctx.stroke();

            if (y === 0) {
                // Restaurar la transparencia después de la primera línea
                ctx.globalAlpha = originalGlobalAlpha;
            }
        }

        // Configurar la transparencia global para las líneas verticales
        for (let x = 0; x <= canvas.width; x += gridSquareXsize) {
            ctx.beginPath();
            ctx.moveTo(x, 12);

            if (x === 0) {
                // Hacer la primera línea vertical transparente
                ctx.globalAlpha = 0;
            }

            ctx.lineTo(x, canvas.height);
            ctx.stroke();

            if (x === 0) {
                // Restaurar la transparencia después de la primera línea
                ctx.globalAlpha = originalGlobalAlpha;
            }
        }

        
        //draw routes as line segments
        if (estructura && estructura.lineaDeRutas) {
            estructura.lineaDeRutas.forEach((segment) => {
                if(segment[2] === "Disponible")
                    plotLine(segment[0][0] + 1 , segment[0][1], segment[1][0] + 1, segment[1][1], "#00cc88", 1.2);
                else if(segment[2] === "Por averiar")
                    plotLine(segment[0][0] + 1, segment[0][1], segment[1][0] + 1, segment[1][1], "#F47E51", 1.3);
                else if(segment[2] === "Reparado")
                    plotLine(segment[0][0] + 1, segment[0][1], segment[1][0] + 1, segment[1][1], "#FF5959", 1.2);
            });
        }
        
         // //Se dibujan los bloqueos
         if (estructura && estructura.bloqueos) {
            estructura.bloqueos.forEach((point) => {
                const position = plotImage(point[0] + 1, point[1], image4, 0.8);
                //console.log("Coord" + point)
                position.type = 'locks';
                tempImagePositions.push(position); 
            }); 
        }

         //Se dibujan los vehiculos
         if (estructura && estructura.coordenadasVehiculos) {
            estructura.coordenadasVehiculos.forEach((coord) => {
                
                const position = plotImage(coord[0] + 1 , coord[1], image5, 1.2,coord[2],coord[3]);
                position.type = 'aut';
                tempImagePositions.push(position);
                
            });
        }
        

        //Se dibujan los almacenes
        plotImageNotClickeable(13, 8, image, 1.7);
        plotImageNotClickeable(43, 42, image2, 1.6);
        plotImageNotClickeable(64, 3, image2, 1.6);
        
        //Se dibujan los puntos de llegada
        if (estructura && estructura.puntosDeLlegada) {
            estructura.puntosDeLlegada.forEach((coord) => {
                const position = plotImage(coord[0] + 1, coord[1], image3, 0.9);
                position.type = 'endpoint';
                tempImagePositions.push(position);
            });
        }
      
        setImagePositions(tempImagePositions);

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
      
            const hoveredOverImage = tempImagePositions.some(position => {
              return x >= position.x && x <= position.x + position.w && y >= position.y && y <= position.y + position.h;
            });
      
            setCursor(hoveredOverImage ? "pointer" : "default");
        };
      
        const handleClick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
        
            tempImagePositions.forEach((position) => {
                if (x >= position.x && x <= position.x + position.w && y >= position.y && y <= position.y + position.h) {
                handleImageClick(position);
                //console.log(`Image at coordinates (${position.origX}, ${position.origY}) was clicked`);
                }
            });
        };
    
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("click", handleClick);
    
        return () => {
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("click", handleClick);
        };
    }, [width, height,estructura,image,status,status2,status3,status4,status5,scale]);

    const handleImageClick = (position) => {
        // canvas de elementos para poder cambiar la imagen 
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        var option = "showcard";
        if (option === "showcard") {
          if (position.type === 'aut') {
            setSelectedImage({ type: 'card', position });
          } else if (position.type === 'endpoint') {
            setSelectedImage({ type: 'endpoint', position });
          }
          setTimeout(() => {
            setSelectedImage(null);
          }, 3000);
        } 
        else {
            alert(`Image at coordinates (${position.origX}, ${position.origY}) was clicked`);
        }
    };

    const plotImage = (x, y, img, factor,placaVehi,tipoVehi) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        
        const adjustedX = x * scale;
        const adjustedY = canvas.height - y * scale;

        const vertexX = Math.round(adjustedX / scale) * scale;
        const vertexY = Math.round(adjustedY / scale) * scale;

    
       //Definimos la posición de la imagen, su ancho y alto de acuerdo a la escala y factor
        const position = {
          x: vertexX - scale / 2,
          y: vertexY - scale / 2,
          w: scale * factor,
          h: scale * factor,
          origX: x,
          origY: y,
          placa: placaVehi,
          tipo: tipoVehi,
        };
  
        ctx.drawImage(img, position.x, position.y, position.w, position.h);
    
        return position;
    };

    const plotImageNotClickeable = (x, y, img, factor) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
      
        const adjustedX = x * scale;
        const adjustedY = canvas.height - y * scale;
      
        const vertexX = Math.round(adjustedX / scale) * scale;
        const vertexY = Math.round(adjustedY / scale) * scale;

     
        ctx.drawImage(img, vertexX-scale/2, vertexY-scale/2, scale*factor, scale*factor);
    };
    
  
    const plotLine = (x1, y1, x2, y2, color, thickness) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
    
        const adjustedX1 = x1 * scale;
        const adjustedY1 = canvas.height - y1 * scale;
        const adjustedX2 = x2 * scale;
        const adjustedY2 = canvas.height - y2 * scale;
    
        ctx.beginPath();
        ctx.moveTo(adjustedX1, adjustedY1);
        ctx.lineTo(adjustedX2, adjustedY2);
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;
        ctx.stroke();
    };

    return (
        <div style={{ position: "relative" }}>
            {status === 'loaded' && (
                <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }}/>
            )}

            {selectedImage && selectedImage.type === 'card' && <Card coord={selectedImage.position} />}
            {selectedImage && selectedImage.type === 'endpoint' && <EndpointCard coord={selectedImage.position} />}
        </div>
    );
};
  
export default CartesianCoordinateSystem;