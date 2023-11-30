import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import colores from "../../colors/colores";

export default function InputSelect({ texto, opciones, valorSeleccionado, onCambiarValor }) {
  const [valor, setValor] = React.useState('');

  const handleChange = (event) => {
    onCambiarValor(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 250}}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{texto}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={valorSeleccionado}
          label={texto}
          onChange={handleChange}
          sx={{ backgroundColor: 'white'}}
        >
          {/* <MenuItem value="">
            <em>None</em>
          </MenuItem> */}
          {opciones.map((opcion) => (
            <MenuItem key={opcion.value} value={opcion.value}>
              {opcion.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}