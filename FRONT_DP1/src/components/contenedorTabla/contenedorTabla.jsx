import * as React from 'react';
import colores from '../../colors/colores'
import Container from '@mui/material/Container';
import Tabla from '../tabla/tabla'

const estilosContenedorTabla = {
    backgroundColor: colores.blanco,
    padding: '20px',
    borderRadius: '25px',
    width: '100%',
    marginTop: '20px'
};

function contenedorTabla({titulo,descripcion,tipo,datos}) {
    return (
        <Container sx = {estilosContenedorTabla}>
            <h3 style={{ marginBottom: '3px' }}>{titulo}</h3>
            <p style={{ opacity: 0.6 , fontSize: '14px', marginTop: '2px'}}> {descripcion}</p>
            <Tabla nombre = {tipo} datos = {datos}/>
        </Container>
    );
}

export default contenedorTabla;