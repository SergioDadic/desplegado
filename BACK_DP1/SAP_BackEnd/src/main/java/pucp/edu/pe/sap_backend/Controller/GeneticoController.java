package pucp.edu.pe.sap_backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pucp.edu.pe.sap_backend.ClasesBD.AveriaBD;
import pucp.edu.pe.sap_backend.ClasesBD.BloqueosBD;
import pucp.edu.pe.sap_backend.ClasesBD.PedidoBD;
import pucp.edu.pe.sap_backend.Genetico.*;
import pucp.edu.pe.sap_backend.Repository.AveriaBDRepository;
import pucp.edu.pe.sap_backend.Ruta.BFS;
import pucp.edu.pe.sap_backend.Ruta.BlockMap;
import pucp.edu.pe.sap_backend.Ruta.Blocknode;
import pucp.edu.pe.sap_backend.Service.BloqueoBDService;
import pucp.edu.pe.sap_backend.Service.PedidoBDService;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/v1/simulacion")
public class GeneticoController {


    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private Genetico genetico;

    @Autowired
    PedidoBDService pedidoBDService;

    @Autowired
    BloqueoBDService bloqueoBDService;

    @Autowired
    AveriaBDRepository averiaBDRepository;


    private LocalDateTime fechaSimulacionInicio;
    private int duracionSimulacion;
    private SimulationState currentState;

//    private List<GeneticAlgorithmState> capturedStates = new ArrayList<>();
    @GetMapping("/genetico/iniciacion")
    public String iniciarlizarDatosGenetico(@RequestParam int durarion,@RequestParam String fechaInicio){
        try{
            int día, mes,anho;
            LocalDateTime currentTime = LocalDateTime.parse(fechaInicio,formatter);
            LocalDateTime StopTimeRecibido = currentTime.plusDays(durarion);

            fechaSimulacionInicio=currentTime;
            duracionSimulacion = durarion;
            //SELECCIONAR PEDIDOS DE BD
            List<PedidoBD> listaPedidos = new ArrayList<>();
            listaPedidos = pedidoBDService.listarPedidosPorFechasParaSimulacion(currentTime,StopTimeRecibido);
            LinkedList<Pedido> listaPedidosReal = new LinkedList<>();
            //----> pasarlos a la clase del genetico
            for (PedidoBD ped: listaPedidos){
                Pedido pedido = new Pedido(ped);
                listaPedidosReal.add(pedido);
            }

            //SELECCIONAR BLOQUEOS DE BD HASTA LA FECHA
            List<BloqueosBD> listaBloqueos = new ArrayList<>();
            listaBloqueos = bloqueoBDService.listarBloqueosPorFechasParaSimulacion(currentTime,StopTimeRecibido);


            //INICIALIZAR VEHICULOS
            ArrayList<Vehiculo> listaVehiculos = new ArrayList<>();
//            vehiculoBDService.limpiarVehiculosBD();
            //CREACIÓN DE VEHICULOS
            // 1 2
            //TIPO A SON 2
            int aux=0;
            int n = 1;
            for (int i=1;i<3;i++){
                Vehiculo vehiculo = new Vehiculo(i,50,12,8,2.5,25.0,12.5,15.0,"TA"+i);
                vehiculo.setPlaca(vehiculo.generarPlaca());
                listaVehiculos.add(vehiculo);
                n++;
            }// 3 4 5 6
            //TIPO B SON 4
            int j=0;
            aux=j;
            for (int i=3;i<7;i++){
                aux=j+1;
                Vehiculo vehiculo = new Vehiculo(i,50,12,8,2.0,15.0,7.5,9.5,"TB"+aux);
                vehiculo.setPlaca(vehiculo.generarPlaca());
                listaVehiculos.add(vehiculo);
                j++;
                n++;
            }
            //TIPO C SON 4
            // 7 8 9 10
            j=0;
            aux=j;
            for (int i=7;i<11;i++){
                aux=j+1;
                Vehiculo vehiculo = new Vehiculo(i,50,12,8,1.5,10.0,5.0,6.5,"TC"+aux);
                vehiculo.setPlaca(vehiculo.generarPlaca());
                listaVehiculos.add(vehiculo);
                j++;
                n++;
            }
            //TIPO D SON 10
            // 11 12 13 14 15 16 17 18 19 20
            j=0;
            aux=j;
            for (int i=11;i<21;i++){
                aux=j+1;
                Vehiculo vehiculo = new Vehiculo(i,50,12,8,1.0,5.0,2.5,3.5,"TD"+aux);
                vehiculo.setPlaca(vehiculo.generarPlaca());

                listaVehiculos.add(vehiculo);
                j++;
                n++;
                //                vehiculoBDService.guardarVehiculoBD(vehiculoBD);
            }
            //INICIALIZAR ALMACENES
            //DESPUES
            ArrayList<Almacen> almacenes = new ArrayList<>();
            Almacen almacenC = new Almacen(12,8,"Central",0.0,0.0);
            Almacen almacenN = new Almacen(42,42,"Norte",0.0,0.0);
            Almacen almacenE = new Almacen(63,3,"Este",0.0,0.0);
            almacenes.add(almacenC);almacenes.add(almacenN);almacenes.add(almacenE);


            //INICIALIZAR GENETICOS
            genetico = new Genetico(currentTime,listaVehiculos,almacenes);


            this.genetico.setTotalOrders(listaPedidosReal);

            //LLENAS DATOS DE BLOQUEOS
            BlockMap map = new BlockMap(71,51);

            for(BloqueosBD bloqueo:listaBloqueos){
                int auxX = (int) bloqueo.getPos_x();
                int auxY = (int) bloqueo.getPos_y();

                if(map.getMap()[auxX][auxY] == null) map.getMap()[auxX][auxY] = new Blocknode();
                map.getMap()[auxX][auxY].getStartTime().add(bloqueo.getInicioBloqueo());
                map.getMap()[auxX][auxY].getEndTime().add(bloqueo.getFinBloqueo());
            }
            genetico.setBlocks(new BFS(map));

            if(durarion !=0){
                List<AveriaBD> averias = averiaBDRepository.findAll();
                genetico.setTotalAveriasBD(new LinkedList<>());
                for (AveriaBD averia : averias){
                    averia.setAveriaCalculada(0);
                    genetico.getTotalAveriasBD().add(averia);
                }
            }else genetico.setTotalAveriasBD(new LinkedList<>());


            System.out.println(genetico.getTotalOrders().size());

            return "genetico inicializado";
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/listarVehiculos")
    public ArrayList<Vehiculo> obtenerCaminoDeVehiculo(@RequestParam Integer limit,@RequestParam int minutos){
        genetico.setLimit(limit);
        ArrayList<Vehiculo> auxVehiculos;
        genetico.executeAlgorithm(minutos);
        if(genetico.getLimit() == -1){
            return null;
        }
        System.out.println("Ejecucion hasta: "+ genetico.getCurrentTime() + " Pedidos restantes: " + genetico.getTotalOrders().size());
        auxVehiculos = genetico.getCars();
        return auxVehiculos;
    }

    @GetMapping("/listarVehiculosFiltrado")
    public ArrayList<Vehiculo> obtenerCaminoDeVehiculoFiltrado(@RequestParam Integer limit,@RequestParam int minutos){

        genetico.setLimit(limit);
        ArrayList<Vehiculo> auxVehiculos = new ArrayList<>();
        genetico.executeAlgorithm(minutos);

        if(genetico.getLimit() == -1){
            return null;
        }
        System.out.println("Ejecucion hasta: "+ genetico.getCurrentTime());
        //auxVehiculos = genetico.getCars();
        for( Vehiculo vehiculo: genetico.getCars()){
            if(vehiculo.getDeliveredOrder().size() !=0){
                auxVehiculos.add(vehiculo);
            }
        }
        
        
        return auxVehiculos;
    }

    @GetMapping("/listarVehiculosSeleccionados")
    public ArrayList<Vehiculo> mostrarInformacionVehiculo(@RequestParam String tipo){
        ArrayList<Vehiculo> auxVehiculos=new ArrayList<>();
        for (Vehiculo vehiculo: genetico.getCars()){
            if (vehiculo.getTipo().contains(tipo)){
                auxVehiculos.add(vehiculo);
            }
        }

        return auxVehiculos;
    }


    @GetMapping("/listarClaseGenetico")
    public Genetico pintarGenetico(@RequestParam Integer limit,@RequestParam int minutos){
        genetico.setLimit(limit);
        genetico.executeAlgorithm(minutos);
        if(genetico.getLimit() == -1){
            return null;
        }
        System.out.println("Ejecucion hasta: "+ genetico.getCurrentTime());

        return genetico;
    }
    @GetMapping("/listarPedidosSeleccionados")
    public LinkedList<Pedido> obtenerPedidos(){
        return genetico.getTotalOrders();
    }

    @GetMapping("/listarBloqueosDentroDelPeriodo")
    public List<BloqueosBD> obtenerBloqueos(){
        List<BloqueosBD> listaBloqueo = new ArrayList<>();
        listaBloqueo = bloqueoBDService.listarBloqueosPorFechasParaSimulacion(fechaSimulacionInicio,fechaSimulacionInicio.plusDays(duracionSimulacion));
        return listaBloqueo;
    }

    @GetMapping("/listarVehiculosDisponibles")
    public List<Vehiculo> obtenerVehiculosDisponibles(){
        List<Vehiculo> listaVehiculosDisp = new ArrayList<>();
        for(Vehiculo vehiculo:genetico.getCars()){
            if((vehiculo.getEstado() == "Disponible")){
                listaVehiculosDisp.add(vehiculo);
            }
        }
        return listaVehiculosDisp;
    }

    @GetMapping("/dosClases")
    public Map<String,List<?>> listaDeClases(){
        Map<String,List<?>> listasDeClases = new HashMap<>();
        List<Vehiculo>listaVehiculos = new ArrayList<>();
        List<BloqueosBD>listaBloqueos = new ArrayList<>();

        for(Vehiculo vehiculo:genetico.getCars()){
            listaVehiculos.add(vehiculo);
        }
        listaBloqueos = bloqueoBDService.listarBloqueosPorFechasParaSimulacion(fechaSimulacionInicio,genetico.getCurrentTime());
        listasDeClases.put("Vehiculos",listaVehiculos);
        listasDeClases.put("Bloqueos",listaBloqueos);
        return  listasDeClases;
    }




//    @GetMapping("/listarGeneticStates")
//    public List<GeneticAlgorithmState> listarGeneticStates() {
//        return capturedStates;
//    }


}
