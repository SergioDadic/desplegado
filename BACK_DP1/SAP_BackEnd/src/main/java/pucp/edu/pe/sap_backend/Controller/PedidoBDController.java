package pucp.edu.pe.sap_backend.Controller;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pucp.edu.pe.sap_backend.ClasesBD.BloqueosBD;
import pucp.edu.pe.sap_backend.ClasesBD.PedidoBD;
import pucp.edu.pe.sap_backend.Repository.PedidoBDRepository;
import pucp.edu.pe.sap_backend.Service.PedidoBDService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/back")
public class PedidoBDController {

    @Autowired
    private final PedidoBDService pedidoBDService;

    private final PedidoBDRepository pedidoBDRepository;
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final static Logger log = LoggerFactory.getLogger(PedidoBDController.class);


    public PedidoBDController(PedidoBDService pedidoBDService, PedidoBDRepository pedidoBDRepository) {
        this.pedidoBDService = pedidoBDService;
        this.pedidoBDRepository = pedidoBDRepository;
    }

    @GetMapping("/api/v1/Pedido/leer")
    public List<PedidoBD> litarPedidosBD() {
        return pedidoBDService.listar();
    }

    @PostMapping("/api/v1/Pedido/CargaMasivaPedidos")
    public String cargaMasiva(@RequestParam("file") MultipartFile file) {
        return pedidoBDService.cargaMasivaParaPedidos(file);
    }

    @GetMapping("/api/v1/Pedido/listarPedidosPorFecha")
    public List<PedidoBD> listarPedidosPorFecha(@RequestParam String fechaInicio, @RequestParam String fechaFin) {
        LocalDateTime inicio = LocalDateTime.parse(fechaInicio, formatter);
        LocalDateTime fin = LocalDateTime.parse(fechaFin, formatter);
        return pedidoBDService.listarPedidosPorFechasParaSimulacion(inicio, fin);
    }

    @PostMapping("/api/v1/Pedido/guardar")
    PedidoBD guardarPedidoBD(@RequestBody Map<String, Object> nuevoPedido) {
        log.info("Agregando pedido...");
        var json = new JSONObject(nuevoPedido);
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        LocalDateTime fechaRecibida = LocalDateTime.parse(json.getString("fecha_recibida"), formatter);
        LocalDateTime fechaMaxEntrega = LocalDateTime.parse(json.getString("fecha_maxima_entrega"), formatter);

        var pedido = new PedidoBD(json.getString("nombre_pedido"), json.getInt("cantidad_pedido"),
                json.getDouble("pos_x"), json.getDouble("pos_y"));
        pedido.setFechaRecibida(fechaRecibida);
        pedido.setHoraEstimadaDeEntregaMaxima(fechaMaxEntrega);
        return pedidoBDRepository.saveAndFlush(pedido);
    }
}