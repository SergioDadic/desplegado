import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Lupa from '@mui/icons-material/Search';


export default function InputWithIcon({texto}) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
        <InputLabel>{texto}</InputLabel>
        <Input
          id="idPedido"
          startAdornment={
            <InputAdornment position="start">
              <Lupa/>
            </InputAdornment>
          }
          />
      </FormControl>
    </Box>
  );
}