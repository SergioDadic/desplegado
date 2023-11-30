import React, { useEffect, useRef, useState } from "react";
import colores from '../colors/colores'
import useImage from 'use-image';
import gasolineraPrincipal from '../img/gasolineraPrincipal.png'
import gasolineraIntermedia from '../img/gasolineraIntermedia.png'
import puntoLllegada from '../img/endpoint2.png'
import bloqueos from '../img/bloqueo.png'
import vehiculo from '../img/vehiculo.png'


const CartesianCoordinateSystem = ({width, height,scale,estructura}) => {
    const canvasRef = useRef(null);
    const [image,status] = useImage(gasolineraPrincipal);
    const [image2,status2] = useImage(gasolineraIntermedia);
    const [image3, status3] = useImage(puntoLllegada);
    const [image4, status4] = useImage(bloqueos);
    const [image5, status5] = useImage(vehiculo);
    const [imagePositions, setImagePositions] = useState([]);
    let tempImagePositions = [];


    useEffect(() => {
        if (status !== 'loaded' || status2 !== 'loaded' || status3 !== 'loaded' || status4 !== 'loaded' || status5 !== 'loaded') {
            return;
        }
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
    
        const gridSquareXsize= scale;
        const gridSquareYsize= scale;
    
        canvas.width = width*scale;
        canvas.height = height*scale;
        ctx.strokeStyle = colores.plomo;
        
        for (let x = 0; x <= canvas.width; x += gridSquareXsize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
    
        for (let y = 0; y <= canvas.height; y += gridSquareYsize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    
    
        //Se dibujan los almacenes
        plotImageNotClickeable(12, 8, image, 1.5);
        plotImageNotClickeable(42, 42, image2, 1.5);
        plotImageNotClickeable(63, 3, image2, 1.5);

        //const probando = [[[12,8],[13,8]],[[13,8],[14,8]],[[14,8],[15,8]],[[15,8],[16,8]]];
        //draw routes as line segments
        if (estructura && estructura.lineaDeRutas) {
            estructura.lineaDeRutas.forEach((segment) => {
                plotLine(segment[0][0], segment[0][1], segment[1][0], segment[1][1], "#00cc88", 2);
            });
        }


        //Se dibujan los vehiculos
        if (estructura && estructura.coordenadasVehiculos) {
            estructura.coordenadasVehiculos.forEach((coord) => {
                const position = plotImage(coord[0], coord[1], image5, 1);
                position.type = 'aut';
                tempImagePositions.push(position);
            });
        }
        
        //Se dibujan los puntos de llegada
        if (estructura && estructura.puntosDeLlegada) {
            estructura.puntosDeLlegada.forEach((coord) => {
                const position = plotImage(coord[0], coord[1], image3, 1);
                position.type = 'endpoint';
                tempImagePositions.push(position);
            });
        }

        // //Se dibujan los bloqueos
        // estructura.bloqueos.forEach((coord) => {
        //     coord.forEach((point) =>{  
                      
        //         const position = plotImage(point[0], point[1], image4, 0.8);
        //         //console.log("Coord" + point)
        //         position.type = 'locks';
        //         tempImagePositions.push(position);
                   
        //     });  
        // }); 
      
        setImagePositions(tempImagePositions);
    }, [width, height,estructura,image,status,status2,status3,status4,status5]);

    
    const plotImage = (x, y, img, factor) => {
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
        <div style={{ position: "absolute" }}>
            {status === 'loaded' && (
                <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }}/>
            )}
        </div>
    );
};
  
export default CartesianCoordinateSystem;