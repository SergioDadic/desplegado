package pucp.edu.pe.sap_backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import pucp.edu.pe.sap_backend.ClasesBD.AveriaBD;
import pucp.edu.pe.sap_backend.ClasesBD.BloqueosBD;
import pucp.edu.pe.sap_backend.Genetico.*;
import pucp.edu.pe.sap_backend.Repository.AveriaBDRepository;
import pucp.edu.pe.sap_backend.Ruta.BFS;
import pucp.edu.pe.sap_backend.Ruta.BlockMap;
import pucp.edu.pe.sap_backend.Ruta.Blocknode;
import pucp.edu.pe.sap_backend.Service.AveriaBDService;
import pucp.edu.pe.sap_backend.Service.BloqueoBDService;
import pucp.edu.pe.sap_backend.Service.PedidoBDService;
import pucp.edu.pe.sap_backend.Service.ReporteSimulacionPDFService;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.Future;

@RestController
@RequestMapping("/diario/simulacion")
public class DiarioController{

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private Genetico genetico;

    private ArrayList<Vehiculo> listaVehiculosInicializados;

    private ArrayList<Almacen> listaAlmacenesInicializados;

    private LinkedList<Pedido> listaPedidosInicializados;

    private List<BloqueosBD> listaBloqueosInicializados;


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

    private static Map<Integer,BloqueosBD> bloqueosBDMap;

    @Autowired
    public DiarioController(ReporteSimulacionPDFService reporteSimulacionPDFService){
        this.reporteSimulacionPDFService = reporteSimulacionPDFService;
    }

    public String iniciarlizarDatosGeneticoDiario(@RequestParam int durarion, @RequestParam String fechaInicio) {
        try {
            LocalDateTime currentTime = LocalDateTime.parse(fechaInicio,formatter);
            LocalDateTime StopTimeRecibido = currentTime.plusDays(durarion);
            fechaSimulacionInicio=currentTime;
            duracionSimulacion = durarion;
            //INICIALIZO LOS PEDIDOS DE LA SIMULACION DIARIA CON EL ARCHIVO/FECHA QUE ME DEN
            LinkedList<Pedido> listaPedidosReal = new LinkedList<>();
            listaPedidosReal = pedidoBDService.lecturaDePedidoDeArchivos(currentTime,StopTimeRecibido);

            //INICIALIZO LOS BLOQUEOS QUE ME MANDEN
            List<BloqueosBD> listaBloqueos = new ArrayList<>();
            listaBloqueos = bloqueoBDService.lecturaDeBloqueosDeArchivos(currentTime,StopTimeRecibido);
            bloqueosBDMap = new HashMap<>();
            int k = 0;
            for(BloqueosBD bloqueosBD:listaBloqueos){
                bloqueosBDMap.put(k,bloqueosBD);
                k++;
            }
            //API PARA INICIALIZAR ALMACENES
            BlockMap map = new BlockMap(71,51);
            for(BloqueosBD bloqueo:listaBloqueos){
                int auxX = (int) bloqueo.getPos_x();
                int auxY = (int) bloqueo.getPos_y();

                if(map.getMap()[auxX][auxY] == null) map.getMap()[auxX][auxY] = new Blocknode();
                map.getMap()[auxX][auxY].getStartTime().add(bloqueo.getInicioBloqueo());
                map.getMap()[auxX][auxY].getEndTime().add(bloqueo.getFinBloqueo());
            }
            //VEHICULOS INICIALIZADOS
            ArrayList<Vehiculo> listaVehiculos = new ArrayList<>();
            listaVehiculos = listaVehiculosInicializados;

            // AVERIAS QUE SE REGISTRARAN POCO A POCO
            List<AveriaBD> averias = new ArrayList<>();

            //ALMACENES INICIALIZADOS
            ArrayList<Almacen> listaAlmacenes = new ArrayList<>();
            listaAlmacenes = this.listaAlmacenesInicializados;


            genetico = new Genetico(currentTime,listaVehiculos,listaAlmacenes);
            this.genetico.setStopTime(StopTimeRecibido);
            this.genetico.setCurrentTime(currentTime);
            this.genetico.setTotalOrders(listaPedidosReal);
            // SE INICIALIZO LOS BLOQUEOS
            genetico.setBlocks(new BFS(map));

            System.out.println(genetico.getTotalOrders().size());




            return "genetico inicializado";
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/listarVehiculosDiario")
    public Map<String,List<?>> obtenerCaminoDeVehiculoFiltrado(@RequestParam Integer limit,@RequestParam int minutos,@RequestParam int continuidad){
        Map<String,List<?>> listaDeClases = new HashMap<>();
        List<Vehiculo>listaVehiculos = new ArrayList<>();
        List<BloqueosBD>listaBloqueosFiltrado = new ArrayList<>();

        this.genetico.setLimit(limit);
        LocalDateTime inicioBloqueo = genetico.getCurrentTime();
        ArrayList<Vehiculo> auxVehiculos = new ArrayList<>();
        genetico.executeAlgorithm(minutos);
        LocalDateTime finBloqueo = genetico.getCurrentTime();

        if(genetico.getLimit() == -1){
            return null;
        }
        System.out.println("Ejecucion hasta: "+ genetico.getCurrentTime() + " Pedidos restantes: " + genetico.getTotalOrders().size());
        auxVehiculos = genetico.getCars();
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

        return listaDeClases;
    }

    @PostMapping("/inicializarVehiculos")
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

    @PostMapping("/inicializarAlmacenes")
    public String inicializarAlmacenes(@RequestBody List<Almacen> listaAlmacenes){
        ArrayList<Almacen> listaAPasar = new ArrayList<>();
        for (Almacen almacen:listaAlmacenes){
            Almacen alma = new Almacen(almacen.getPos_x(),almacen.getPos_y(),almacen.getNombreAlmacen(), almacen.getCantMaximaLiquidoGLP(),almacen.getCantMaximaLiquidoM3());
            listaAPasar.add(alma);
        }
        this.listaAlmacenesInicializados = listaAPasar;
        return "Inicialización de almacenes completa";
    }
    @GetMapping(value = "/generar",produces =  MediaType.APPLICATION_PDF_VALUE)
    public ModelAndView generarPDF(){
        List<Vehiculo> vehiculos = this.genetico.getCars();
        Map<String, Object> model = new HashMap<>();
        model.put("Vehiculos", vehiculos);
        model.put("Fecha",genetico.getCurrentTime());
        return new ModelAndView(reporteSimulacionPDFService,model);
    }

}
