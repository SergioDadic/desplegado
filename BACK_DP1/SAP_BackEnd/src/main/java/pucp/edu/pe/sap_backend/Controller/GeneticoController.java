package pucp.edu.pe.sap_backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pucp.edu.pe.sap_backend.ClasesBD.AveriaBD;
import pucp.edu.pe.sap_backend.ClasesBD.BloqueosBD;
import pucp.edu.pe.sap_backend.ClasesBD.PedidoBD;
import pucp.edu.pe.sap_backend.ClasesBD.VehiculoBD;
import pucp.edu.pe.sap_backend.Genetico.*;
import pucp.edu.pe.sap_backend.Repository.AveriaBDRepository;
import pucp.edu.pe.sap_backend.Ruta.BFS;
import pucp.edu.pe.sap_backend.Ruta.BlockMap;
import pucp.edu.pe.sap_backend.Ruta.Blocknode;
import pucp.edu.pe.sap_backend.Ruta.Cell;
import pucp.edu.pe.sap_backend.Service.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/back")
public class GeneticoController {


    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private Genetico genetico;

    private ArrayList<Vehiculo> listaVehiculosInicializados;

    private ArrayList<Almacen> listaAlmacenesInicializados;

    private LinkedList<Pedido> listaPedidosInicializados;

    private List<BloqueosBD>  listaBloqueosInicializados;


    @Autowired
    PedidoBDService pedidoBDService;

    @Autowired
    BloqueoBDService bloqueoBDService;

    @Autowired
    AveriaBDRepository averiaBDRepository;

    @Autowired
    AveriaBDService averiaBDService;

    private final ReporteSimulacionPDFService reporteSimulacionPDFService;

    private LocalDateTime fechaSimulacionInicio;
    private int duracionSimulacion;
    private SimulationState currentState;

    private static Map<Integer,BloqueosBD>bloqueosBDMap;
//    private List<GeneticAlgorithmState> capturedStates = new ArrayList<>();
    private static boolean recargaRealizada = false;

    private static boolean inicializado = false;
    private LocalDateTime midnightAux;

    @Autowired
    public GeneticoController(ReporteSimulacionPDFService reporteSimulacionPDFService){
        this.reporteSimulacionPDFService = reporteSimulacionPDFService;
    }
    @GetMapping("/api/v1/simulacion/genetico/iniciacion")
    public String iniciarlizarDatosGenetico(@RequestParam int durarion,@RequestParam String fechaInicio){
        try{
            int día, mes,anho;
            LocalDateTime currentTime = LocalDateTime.parse(fechaInicio,formatter);
            LocalDateTime StopTimeRecibido = currentTime.plusDays(durarion);

            fechaSimulacionInicio=currentTime;
            duracionSimulacion = durarion;
            //SELECCIONAR PEDIDOS DE BD
            List<PedidoBD> listaPedidos = new ArrayList<>();
            LinkedList<Pedido> listaAux= new LinkedList<>();
            LinkedList<Pedido> listaPedidosReal = new LinkedList<>();
//            listaPedidos = pedidoBDService.listarPedidosPorFechasParaSimulacion(currentTime,StopTimeRecibido);
//            //----> pasarlos a la clase del genetico
//            for (PedidoBD ped: listaPedidos){
//                Pedido pedido = new Pedido(ped);
//                listaPedidosReal.add(pedido);
//            }
            //CARGA LOS PEDIDOS CON LOS ARCHIVOS QUE TIENE
            listaPedidosReal = pedidoBDService.lecturaDePedidoDeArchivos(currentTime,StopTimeRecibido);


            //SELECCIONAR BLOQUEOS DE BD HASTA LA FECHA
            List<BloqueosBD> listaBloqueos = new ArrayList<>();
//            listaBloqueos = bloqueoBDService.listarBloqueosPorFechasParaSimulacion(currentTime,StopTimeRecibido);
//
            listaBloqueos = bloqueoBDService.lecturaDeBloqueosDeArchivos(currentTime,StopTimeRecibido);
            bloqueosBDMap = new HashMap<>();
            int k = 0;
            for(BloqueosBD bloqueosBD:listaBloqueos){
                bloqueosBDMap.put(k,bloqueosBD);
                k++;
            }

            //INICIALIZAR VEHICULOS
            ArrayList<Vehiculo> listaVehiculos = new ArrayList<>();
//            vehiculoBDService.limpiarVehiculosBD();
            //CREACIÓN DE VEHICULOS
            // 1 2
            //TIPO A SON 2
            int aux=0;
            int n = 1;
            for (int i=1;i<3;i++){
                Vehiculo vehiculo = new Vehiculo(i,1,12,8,2.5,25.0,12.5,15.0,"TA"+i);
                vehiculo.setPlaca(vehiculo.generarPlaca());
                listaVehiculos.add(vehiculo);
                n++;
            }// 3 4 5 6
            //TIPO B SON 4
            int j=0;
            aux=j;
            for (int i=3;i<7;i++){
                aux=j+1;
                Vehiculo vehiculo = new Vehiculo(i,1,12,8,2.0,15.0,7.5,9.5,"TB"+aux);
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
                Vehiculo vehiculo = new Vehiculo(i,1,12,8,1.5,10.0,5.0,6.5,"TC"+aux);
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
                Vehiculo vehiculo = new Vehiculo(i,1,12,8,1.0,5.0,2.5,3.5,"TD"+aux);
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
            Almacen almacenN = new Almacen(42,42,"Norte",160.0,0.0);
            Almacen almacenE = new Almacen(63,3,"Este",160.0,0.0);
            almacenes.add(almacenC);almacenes.add(almacenN);almacenes.add(almacenE);


            //INICIALIZAR GENETICOS
            genetico = new Genetico(currentTime,listaVehiculos,almacenes);
            this.genetico.setStopTime(StopTimeRecibido);
            this.genetico.setCurrentTime(currentTime);
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



            List<AveriaBD> averias = averiaBDService.lecturaDeAveriasDeArchivos();
//            if(durarion !=0){
//
//                genetico.setTotalAveriasBD(new LinkedList<>());
//                for (AveriaBD averia : averias){
//                    averia.setAveriaCalculada(0);
//                    genetico.getTotalAveriasBD().add(averia);
//                }
//            }else genetico.setTotalAveriasBD(new LinkedList<>());
//
//
            //ASIGNAMOS LAS AVERIAS DE LOS ARCHIVOS :) a los vehiculos
            if(!averias.isEmpty()){
                for (AveriaBD averiaBD:averias){
                    int i=0;
                    for (i=0;i<genetico.getCars().size();i++){
                        if(genetico.getCars().get(i).getTipo().equals(averiaBD.getNombre_vehiculo())){
                            genetico.getCars().get(i).setAveriaAsignada(averiaBD);
                            break;
                        }
                    }

                }
            }

            System.out.println(genetico.getTotalOrders().size());

            return "genetico inicializado";
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/api/v1/simulacion/listarVehiculos")
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

//    @GetMapping("/listarVehiculosFiltrado")
//    public ArrayList<Vehiculo> obtenerCaminoDeVehiculoFiltrado(@RequestParam Integer limit,@RequestParam int minutos){
//
//        genetico.setLimit(limit);
//        LocalDateTime inicioBloqueo = genetico.getCurrentTime();
//        ArrayList<Vehiculo> auxVehiculos = new ArrayList<>();
//        genetico.executeAlgorithm(minutos);
//        LocalDateTime finBloqueo = genetico.getCurrentTime();
//
//
//        if(genetico.getLimit() == -1){
//            return null;
//        }
//        System.out.println("Ejecucion hasta: "+ genetico.getCurrentTime());
//        //auxVehiculos = genetico.getCars();
//        for( Vehiculo vehiculo: genetico.getCars()){
//            if(vehiculo.getDeliveredOrder().size() !=0){
//                auxVehiculos.add(vehiculo);
//            }
//        }
//        List<BloqueosBD> listaBloqueos = new ArrayList<>();
//        for(BloqueosBD bloqueo :bloqueosGlobal){
//
//            if (inicioBloqueo.isAfter(bloqueo.getInicioBloqueo()) && inicioBloqueo.isBefore(bloqueo.getFinBloqueo())) {
//                listaBloqueos.add(bloqueo);
//            } else if (finBloqueo.isAfter(bloqueo.getInicioBloqueo()) && finBloqueo.isBefore(bloqueo.getFinBloqueo())) {
//                listaBloqueos.add(bloqueo);
//            } else if (inicioBloqueo.isBefore(bloqueo.getInicioBloqueo()) && finBloqueo.plusMinutes(minutos).isAfter(bloqueo.getInicioBloqueo())){
//                listaBloqueos.add(bloqueo);
//            } else if (inicioBloqueo.plusMinutes(minutos).isBefore(bloqueo.getFinBloqueo()) && finBloqueo.isAfter(bloqueo.getFinBloqueo())){
//                listaBloqueos.add(bloqueo);
//            }
//        }
//
//        return auxVehiculos;
//    }
    @GetMapping("/api/v1/simulacion/listarVehiculosFiltrado")
    public Map<String,List<?>> obtenerCaminoDeVehiculoFiltrado(@RequestParam Integer limit,@RequestParam int minutos,@RequestParam int continuidad){
        Map<String,List<?>> listaDeClases = new HashMap<>();
        List<Vehiculo>listaVehiculos = new ArrayList<>();
        List<BloqueosBD>listaBloqueosFiltrado = new ArrayList<>();

        this.genetico.setLimit(limit);
        this.genetico.setContinuidad(continuidad);
        LocalDateTime inicioBloqueo = genetico.getCurrentTime();
        ArrayList<Vehiculo> auxVehiculos = new ArrayList<>();
        genetico.executeAlgorithm(minutos);

        if(!inicializado){
            LocalDateTime midnight = genetico.getCurrentTime().toLocalDate().atTime(LocalTime.MIDNIGHT);
            midnightAux = midnight;
            inicializado = true;
        }
        else{
            if (genetico.getCurrentTime().isAfter(midnightAux.plusDays(1))){
                for (Almacen almacen : genetico.getAlmacenes()) {
                    almacen.setCantMaximaLiquidoGLP(160.0);
                    almacen.setCantidadLiquidoGenerarRutas(160.0);
                    almacen.setCantidadLiquidoReplanificar(160.0);
                }
                inicializado = false;
            }
        }
        LocalDateTime finBloqueo = genetico.getCurrentTime();

        if(genetico.getLimit() == -1){
            return null;
        }
        System.out.println("Ejecucion hasta: "+ genetico.getCurrentTime() + " Pedidos restantes: " + genetico.getTotalOrders().size());
        auxVehiculos = genetico.getCars();
        //auxVehiculos = genetico.getCars();
//        for( Vehiculo vehiculo: genetico.getCars()){
//            if(vehiculo.getDeliveredOrder().size() !=0){
//                auxVehiculos.add(vehiculo);
//            }
//        }

        List<BloqueosBD> listaBloqueos = new ArrayList<>();
        for(BloqueosBD bloqueo :bloqueosBDMap.values()){

            if (inicioBloqueo.isAfter(bloqueo.getInicioBloqueo()) && inicioBloqueo.isBefore(bloqueo.getFinBloqueo())) {
                listaBloqueos.add(bloqueo);
            } else if (finBloqueo.isAfter(bloqueo.getInicioBloqueo()) && finBloqueo.isBefore(bloqueo.getFinBloqueo())) {
                listaBloqueos.add(bloqueo);
            } else if (inicioBloqueo.isBefore(bloqueo.getInicioBloqueo()) && finBloqueo.plusMinutes(minutos).isAfter(bloqueo.getInicioBloqueo())){
                listaBloqueos.add(bloqueo);
            } else if (inicioBloqueo.plusMinutes(minutos).isBefore(bloqueo.getFinBloqueo()) && finBloqueo.isAfter(bloqueo.getFinBloqueo())){
                listaBloqueos.add(bloqueo);
            }
        }
       // listaVehiculos = auxVehiculos;
       // listaBloqueosFiltrado = listaBloqueos;
        listaDeClases.put("Vehiculos",auxVehiculos);
        listaDeClases.put("Bloqueos",listaBloqueos);
        listaDeClases.put("Almacenes",this.genetico.getAlmacenes());
        return listaDeClases;
    }

    @GetMapping("/api/v1/simulacion/listarVehiculosSeleccionados")
    public ArrayList<Vehiculo> mostrarInformacionVehiculo(@RequestParam String tipo){
        ArrayList<Vehiculo> auxVehiculos=new ArrayList<>();
        for (Vehiculo vehiculo: genetico.getCars()){
            if (vehiculo.getTipo().contains(tipo)){
                auxVehiculos.add(vehiculo);
            }
        }

        return auxVehiculos;
    }

    @PostMapping("/api/v1/simulacion/inicializarVehiculos")
    public String inicializarVehiculosPorAPI(@RequestBody List<Vehiculo> listaVehiculos){
        ArrayList<Vehiculo> listaAPasar = new ArrayList<>();
        for (Vehiculo vehiculo:listaVehiculos){
            Vehiculo veh = new Vehiculo(vehiculo.getId(),vehiculo.getType(),vehiculo.getX(),vehiculo.getY(),vehiculo.getTara(),vehiculo.getCargaGLP(),
                                vehiculo.getPesoCargaGLP(),vehiculo.getPesoCombinado(),vehiculo.getTipo());
            veh.setPlaca(vehiculo.generarPlaca());
            listaAPasar.add(veh);
        }
        this.listaVehiculosInicializados = listaAPasar;
        return "Inicialización de vehiculos completada";
    }


    @PostMapping("/api/v1/simulacion/inicializarAlmacenes")
    public String inicializarAlmacenesPorAPI(@RequestBody List<Almacen> listaAlmacenes){
        this.listaAlmacenesInicializados = (ArrayList<Almacen>) listaAlmacenes;
        return "Inicialización de almacenes completada";
    }

    @GetMapping("/api/v1/simulacion/listarPedidosSeleccionados")
    public LinkedList<Pedido> obtenerPedidos(){
        return genetico.getTotalOrders();
    }

    @GetMapping("/api/v1/simulacion/listarBloqueosDentroDelPeriodo")
    public List<BloqueosBD> obtenerBloqueos(){
        List<BloqueosBD> listaBloqueo = new ArrayList<>();
        listaBloqueo = bloqueoBDService.listarBloqueosPorFechasParaSimulacion(fechaSimulacionInicio,fechaSimulacionInicio.plusDays(duracionSimulacion));
        return listaBloqueo;
    }

    @GetMapping("/api/v1/simulacion/listarVehiculosDisponibles")
    public List<Vehiculo> obtenerVehiculosDisponibles(){
        List<Vehiculo> listaVehiculosDisp = new ArrayList<>();
        for(Vehiculo vehiculo:genetico.getCars()){
            if((vehiculo.getEstado() == "Disponible")){
                listaVehiculosDisp.add(vehiculo);
            }
        }
        return listaVehiculosDisp;
    }

    @GetMapping("/api/v1/simulacion/dosClases")
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

    @GetMapping("/api/v1/simulacion/api/genetico/pedido/colapso")
    public Object colapso(){
        Map<String, Object> object = new HashMap<>();
        Pedido auxPedido = genetico.getOrders().getFirst();
        object.put("hora_colapso", genetico.getCurrentTime());
        object.put("pedido",auxPedido.getIdPedido());
        object.put("Cantidad", auxPedido.getAmount() );
        object.put("fecha_limite", auxPedido.getLimitDate());
        return object;
    }
    @GetMapping(value = "/api/v1/simulacion/generar",produces =  MediaType.APPLICATION_PDF_VALUE)
    public ModelAndView generarPDF(){
        List<Vehiculo> vehiculos = this.genetico.getCars();
        Map<String, Object> model = new HashMap<>();
        model.put("Vehiculos", vehiculos);
        model.put("Fecha",genetico.getCurrentTime());
        return new ModelAndView(reporteSimulacionPDFService,model);
    }






//    @GetMapping("/listarGeneticStates")
//    public List<GeneticAlgorithmState> listarGeneticStates() {
//        return capturedStates;
//    }


}
