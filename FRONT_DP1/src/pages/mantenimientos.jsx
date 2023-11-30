import BarraSuperior from '../components/barraSuperior/barraSuperior' 
import Box from '@mui/material/Box';
import colores from '../colors/colores'
import Container from '@mui/material/Container';
import InputWithIcon from '../components/inputStandar/inputStandar'
import BotonVerde from '../components/botonVerde/botonVerde'
import ContenedorTabla from '../components/contenedorTabla/contenedorTabla'

const estilosContenedorMantenimiento = {
    backgroundColor: colores.blanco,
    padding: '25px',
    borderRadius: '10px',
    width: '100%',
};

function mantenimientos() {
    const data = [];
    return (
        <div style = {{backgroundColor: colores.fondo,minHeight: '100vh', overflow: 'hidden'}}>
            <Box sx={{ display: 'flex' }}>
                <BarraSuperior/>
                <Box component="main" sx={{ flexGrow: 1, p: 3,paddingTop: 8}}>
                    <h2 className='tituloPagina'>MANTENIMIENTOS</h2>
                    <BotonVerde texto={"Ingresar mantenimiento"} camino ={"NuevoMantenimiento"}/>
                    <Container sx = {estilosContenedorMantenimiento}>
                        <InputWithIcon texto = {"Ingresar placa:"}/>
                    </Container>
                    <ContenedorTabla titulo={"Mantenimientos"} descripcion = {"Histórico de mantenimientos realizados"} 
                    tipo={"mantenimiento"} datos={data}/>
                </Box>
            </Box>
        </div>
    );
}

export default mantenimientos;