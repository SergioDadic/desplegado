package pucp.edu.pe.sap_backend.Controller;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import pucp.edu.pe.sap_backend.ClasesBD.AveriaBD;
import pucp.edu.pe.sap_backend.ClasesBD.BloqueosBD;
import pucp.edu.pe.sap_backend.ClasesBD.PedidoBD;
import pucp.edu.pe.sap_backend.Genetico.*;
import pucp.edu.pe.sap_backend.Repository.AveriaBDRepository;
import pucp.edu.pe.sap_backend.Ruta.BFS;
import pucp.edu.pe.sap_backend.Ruta.BlockMap;
import pucp.edu.pe.sap_backend.Ruta.Blocknode;
import pucp.edu.pe.sap_backend.Service.*;

import java.io.InputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.Future;

@RestController
@RequestMapping("/back")
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
    private final SubidaDeArchivosService subidaDeArchivosService;

    private LocalDateTime fechaSimulacionInicio;
    private int duracionSimulacion;
    private SimulationState currentState;

    private static Map<Integer,BloqueosBD> bloqueosBDMap;

    private static List<Vehiculo> vehiculosReporte = new ArrayList<>();

    @Autowired
    public DiarioController(ReporteSimulacionPDFService reporteSimulacionPDFService,SubidaDeArchivosService subidaDeArchivosService){
        this.reporteSimulacionPDFService = reporteSimulacionPDFService;
        this.subidaDeArchivosService = subidaDeArchivosService;
    }

    @GetMapping("/api/v1/simulacion/diaria/iniciacion")
    public String iniciarlizarDatosGeneticoDiario(@RequestParam int durarion, @RequestParam String fechaInicio) {
        try {
            LocalDateTime currentTime = LocalDateTime.parse(fechaInicio,formatter);
            LocalDateTime StopTimeRecibido = currentTime.plusDays(durarion);
            fechaSimulacionInicio=currentTime;
            duracionSimulacion = durarion;
            //INICIALIZO LOS PEDIDOS DE LA SIMULACION DIARIA CON EL ARCHIVO/FECHA QUE ME DEN
            LinkedList<Pedido> listaPedidosReal = new LinkedList<>();

            //listaPedidosReal=listaPedidosInicializados; // SE AÑADE LO QUE TIENE ANTES
            //LEE LO DEL ARCHIVO ESE RARO
            //listaPedidosReal.addAll(pedidoBDService.lecturaDePedidoDeArchivos(currentTime,StopTimeRecibido));


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


            // AVERIAS QUE SE REGISTRARAN POCO A POCO
            List<AveriaBD> averias = new ArrayList<>();

            //ALMACENES INICIALIZADOS
            ArrayList<Almacen> almacenes = new ArrayList<>();
            Almacen almacenC = new Almacen(12,8,"Central",0.0,0.0);
            Almacen almacenN = new Almacen(42,42,"Norte",0.0,0.0);
            Almacen almacenE = new Almacen(63,3,"Este",0.0,0.0);
            almacenes.add(almacenC);almacenes.add(almacenN);almacenes.add(almacenE);


            genetico = new Genetico(currentTime,listaVehiculos,almacenes);
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

    @GetMapping("/api/v1/simulacion/diaria/listarVehiculosDiario")
    public Map<String,List<?>> obtenerCaminoDeVehiculoFiltrado(@RequestParam Integer limit,@RequestParam int minutos,@RequestParam int continuidad) {
        Map<String, List<?>> listaDeClases = new HashMap<>();
        List<Vehiculo> listaVehiculos = new ArrayList<>();
        List<BloqueosBD> listaBloqueosFiltrado = new ArrayList<>();

        this.genetico.setLimit(limit);
        this.genetico.setContinuidad(continuidad);
        LocalDateTime inicioBloqueo = genetico.getCurrentTime();
        ArrayList<Vehiculo> auxVehiculos = new ArrayList<>();
        genetico.executeAlgorithm(minutos);
        LocalDateTime finBloqueo = genetico.getCurrentTime();

        if (genetico.getLimit() == -1) {
            return null;
        }
        System.out.println("Ejecucion hasta: " + genetico.getCurrentTime() + " Pedidos restantes: " + genetico.getTotalOrders().size());
        auxVehiculos = genetico.getCars();
        List<BloqueosBD> listaBloqueos = new ArrayList<>();
        for (BloqueosBD bloqueo : bloqueosBDMap.values()) {

            if (inicioBloqueo.isAfter(bloqueo.getInicioBloqueo()) && inicioBloqueo.isBefore(bloqueo.getFinBloqueo())) {
                listaBloqueos.add(bloqueo);
            } else if (finBloqueo.isAfter(bloqueo.getInicioBloqueo()) && finBloqueo.isBefore(bloqueo.getFinBloqueo())) {
                listaBloqueos.add(bloqueo);
            } else if (inicioBloqueo.isBefore(bloqueo.getInicioBloqueo()) && finBloqueo.plusMinutes(minutos).isAfter(bloqueo.getInicioBloqueo())) {
                listaBloqueos.add(bloqueo);
            } else if (inicioBloqueo.plusMinutes(minutos).isBefore(bloqueo.getFinBloqueo()) && finBloqueo.isAfter(bloqueo.getFinBloqueo())) {
                listaBloqueos.add(bloqueo);
            }
        }
        if(this.genetico.getTotalOrders().size() < 51){
            for(Vehiculo vehiculo: auxVehiculos){
                vehiculosReporte.add(vehiculo);
            }
        }
        // listaVehiculos = auxVehiculos;
        // listaBloqueosFiltrado = listaBloqueos;
        listaDeClases.put("Vehiculos",auxVehiculos);
        listaDeClases.put("Bloqueos",listaBloqueos);
        listaDeClases.put("Almacenes",genetico.getAlmacenes());

        return listaDeClases;
    }

    @PostMapping("/api/v1/simulacion/diaria/inicializarVehiculos")
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

    @PostMapping("/api/v1/simulacion/diaria/inicializarAlmacenes")
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
        List<Vehiculo> vehiculos =vehiculosReporte;
        Map<String, Object> model = new HashMap<>();
        model.put("Vehiculos", vehiculos);
        model.put("Fecha",genetico.getCurrentTime());
        return new ModelAndView(reporteSimulacionPDFService,model);
    }

    //DENTRO DE LA PESTAÑA
    @PostMapping("/api/v1/simulacion/diaria/pedidoTiempoReal")
    public String pedidosTiempoReal(@RequestParam("file") MultipartFile file){
        int contador = 0 ;
        if(this.genetico.getTotalOrders() != null){
            contador = this.genetico.getTotalOrders().size();
        }

        try {
            InputStream inputStream = file.getInputStream();
//            subidaDeArchivosService.saveFile(file);
//            LinkedList<Pedido> listaPedidosReal = pedidoBDService.procesarArchivoDiario(root.resolve(file.getOriginalFilename()).toFile(), contador);
            LinkedList<Pedido> listaPedidosReal = pedidoBDService.procesarArchivoDiario(inputStream, contador,file.getOriginalFilename());
            this.genetico.getTotalOrders().addAll(listaPedidosReal);
//            this.genetico.setTotalOrders(listaPedidosReal);
            return "Pedidos añadidos";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error al procesar el archivo: " + e.getMessage();
        }
    }
    //PARA SUBIR PEDIDOS FUERA

    @PostMapping("/api/v1/simulacion/diaria/pedidoAntesDeSimulacion")
    public String insertarPedidosAntesSimulacion(@RequestParam("file") MultipartFile file){
        int contador = listaPedidosInicializados.size();
        try {
            InputStream inputStream = file.getInputStream();
//            subidaDeArchivosService.saveFile(file);
//            LinkedList<Pedido> listaPedidosReal = pedidoBDService.procesarArchivoDiario(root.resolve(file.getOriginalFilename()).toFile(), contador);
            LinkedList<Pedido> listaPedidos = pedidoBDService.procesarArchivoDiario(inputStream, contador,file.getOriginalFilename());
            this.genetico.getTotalOrders().addAll(listaPedidos);
//            this.genetico.setTotalOrders(listaPedidosReal);
            return "Pedidos añadidos";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error al procesar el archivo: " + e.getMessage();
        }
    }


    @PostMapping("/api/v1/simulacion/diaria/pedidoUnitario")
    public String insertarPedidoUnitario(@RequestBody Map<String, Object> nuevoPedido){

        var json = new JSONObject(nuevoPedido);
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        LocalDateTime fechaRecibida = LocalDateTime.parse(json.getString("fecha_recibida"), formatter);
        LocalDateTime fechaMaxEntrega = LocalDateTime.parse(json.getString("fecha_maxima_entrega"), formatter);

        var pedido = new PedidoBD(json.getString("nombre_pedido"), json.getInt("cantidad_pedido"),
                json.getDouble("pos_x"), json.getDouble("pos_y"));
        pedido.setFechaRecibida(fechaRecibida);
        pedido.setHoraEstimadaDeEntregaMaxima(fechaMaxEntrega);




        int YYYYaux = pedido.getFechaRecibida().getYear();
        int MMDDaux =  pedido.getFechaRecibida().getMonthValue()*100 + pedido.getFechaRecibida().getDayOfMonth();
        int hhmmaux = pedido.getFechaRecibida().getHour()*100 +pedido.getFechaRecibida().getMinute();
        int valor = diferenciaEnHoras(pedido.getFechaRecibida(),pedido.getHoraEstimadaDeEntregaMaxima());


        int contador = this.genetico.getTotalOrders().size();
        Pedido ped = new Pedido(contador,contador, (int) pedido.getPos_x(), (int) pedido.getPos_y(),
                pedido.getCantidadPedido(),YYYYaux,MMDDaux, hhmmaux, valor,pedido.getIdPedido());

        this.genetico.getTotalOrders().add(ped);

        return "Se subio de forma correcta";
    }

    public int diferenciaEnHoras(LocalDateTime fechaInicio, LocalDateTime fechaFinal){
        Duration duration = Duration.between(fechaInicio,fechaFinal);
        return (int) duration.toHours();
    }

    @GetMapping("/api/v1/simulacion/diaria/listarPedidosUsadosEnDiario")
    public List<Pedido> listarPedidosUsarosEnDiario(){
        List<Pedido> list= new ArrayList<>();
        list = listaPedidosInicializados;
        return list;

    }

    @GetMapping("/obtenerOrdenes")
    public List<Pedido>obtenerTotalPedidos(){
        List<Pedido> list = new ArrayList<>();
        list = this.genetico.getTotalOrders();
        return list;
    }

}
