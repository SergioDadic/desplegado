import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import './tabla.css'

const columnasVehiculo = [
    { field: 'id', headerName: 'ID Vehículo', sortable: false,width: 130},
    { field: 'tipo', headerName: 'Tipo', sortable: false,width: 160},
    { field: 'estado', headerName: 'Estado', sortable: false,width: 160},
    { field: 'capacidad', headerName: 'Capacidad (m³)', type: 'number',width: 200},
    { field: 'pesoCombinado', headerName: 'Peso combinado (Ton)', type: 'number', width: 200},
  ];

const columnasPedidos = [
  { field: 'id', headerName: 'ID Pedido', width: 130},
  { field: 'idPedido', headerName: 'ID Cliente', width: 130},
  { field: 'cantidadPedido', headerName: 'Cantidad  (m³) ', width: 130},
  { field: 'fechaRecibida', headerName: 'Hora Llegada', width: 200, 
    valueGetter: (params) => {
    const fecha = new Date(params.row.fechaRecibida);
    return fecha.toLocaleString();},
  },
  { field: 'horaEstimadaDeEntregaMaxima', headerName: 'Tiempo límite entrega (h)', width: 200,
    valueGetter: (params) => {
    const fecha = new Date(params.row.fechaRecibida);
    return fecha.toLocaleString();},
  },
  { field: 'pos_x', headerName: 'Posicion X', width: 130},
  { field: 'pos_y', headerName: 'Posicion Y', width: 130},
];

const columnasMantenimientos = [
  { field: 'fecha', headerName: 'Fecha', width: 200},
  { field: 'tipoVehiculo', headerName: 'Tipo de vehículo', width: 200},
  { field: 'numVehiculo', headerName: 'N° de vehículo', width: 200},
  { field: 'placa',headerName: 'Placa', sortable: false,width: 200},
];

const columnasBloqueos = [
  { field: 'inicioBloqueo1', headerName: 'Fecha Inicio', width: 200, 
    valueGetter: (params) => {
    const fecha = new Date(params.row.inicioBloqueo);
    return fecha.toLocaleDateString();},
  },
  { field: 'finBloqueo1', headerName: 'Hora Inicio', width: 200, 
  valueGetter: (params) => {
  const fecha = new Date(params.row.inicioBloqueo);
  return fecha.toLocaleTimeString();},
  },
  { field: 'inicioBloqueo2', headerName: 'Fecha Fin', width: 200, 
    valueGetter: (params) => {
    const fecha = new Date(params.row.finBloqueo);
    return fecha.toLocaleDateString();},
  },
  { field: 'finBloqueo2', headerName: 'Hora Fin', width: 200, 
  valueGetter: (params) => {
  const fecha = new Date(params.row.finBloqueo);
  return fecha.toLocaleTimeString();},
  }
];


export default function DataTable(props) {
  const { nombre, datos } = props;
  let columns =[];

  //console.log("Props en contenedorTabla: ", nombre, datos);

  if (nombre === "vehiculo")
    columns = columnasVehiculo
  else if(nombre === "pedido")
    columns = columnasPedidos
  else if(nombre === "mantenimiento")
    columns = columnasMantenimientos
  else if(nombre === "bloqueo")
    columns = columnasBloqueos

  columns = columns.map(column => ({
    ...column,
    headerClassName: 'estilosCabecera',
  }));


  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={datos}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
     <style>
        {`
          .estilosCabecera {
            font-weight: bold;
            color: var(--colorSecundario)
          }
        `}
      </style>
    </div>
  );
}