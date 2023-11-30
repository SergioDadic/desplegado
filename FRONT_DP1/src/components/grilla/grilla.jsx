import React, { useEffect, useRef } from "react";
import colores from '../../colors/colores'



const Grilla = ({ width, height, scale}) => {
    const canvasRef = useRef(null);
    useEffect(() => {

        //Se dibuja la grilla
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
       
    }, [width, height]);
      
    return (
        <div style={{ position: "relative" }}>
            {(
                <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }}/>
            )}
        </div>
    );
};

export default Grilla;