package pucp.edu.pe.sap_backend.Controller;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pucp.edu.pe.sap_backend.ClasesBD.BloqueosBD;
import pucp.edu.pe.sap_backend.ClasesBD.PedidoBD;
import pucp.edu.pe.sap_backend.Repository.BloqueoBDRepository;
import pucp.edu.pe.sap_backend.Service.BloqueoBDService;
import pucp.edu.pe.sap_backend.Service.PedidoBDService;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/back")
public class BloqueoBDController {
    @Autowired
    private final BloqueoBDService bloqueoBDService;
    private final BloqueoBDRepository bloqueoBDRepository;
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    private final static Logger log = LoggerFactory.getLogger(BloqueoBDController.class);

    public BloqueoBDController(BloqueoBDService bloqueoBDService, BloqueoBDRepository bloqueoBDRepository){
        this.bloqueoBDService = bloqueoBDService;
        this.bloqueoBDRepository = bloqueoBDRepository;
    }

    @PostMapping("/api/v1/Bloqueo/guardar")
    BloqueosBD guardarBloqueoBD(@RequestBody Map<String,Object>nuevoBloqueo){
        log.info("Agregando bloqueo...");
        var json = new JSONObject(nuevoBloqueo);
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        LocalDateTime tiempoInicioBloqueo = LocalDateTime.parse(json.getString("tiempo_inicio_bloqueo"), formatter);
        LocalDateTime tiempoFinBloqueo = LocalDateTime.parse(json.getString("tiempo_fin_bloqueo"), formatter);
        var bloqueo = new BloqueosBD(json.getDouble("pos_x"), json.getDouble("pos_y"));
        bloqueo.setInicioBloqueo(tiempoInicioBloqueo);
        bloqueo.setFinBloqueo(tiempoFinBloqueo);
        return bloqueoBDRepository.saveAndFlush(bloqueo);
    }
    @GetMapping("/api/v1/Bloqueo/leer")
    public List<BloqueosBD> litarBloqueoBD(){
        return bloqueoBDService.listar();
    }

    @PostMapping("/api/v1/Bloqueo/CargaMasivaBloqueos")
    public String cargaMasiva(@RequestParam("file") MultipartFile file){
        return bloqueoBDService.cargaMasivaParaBloqueos(file);
    }

    @GetMapping("/api/v1/Bloqueo/listarBloqueosPorFechas")
    public List<BloqueosBD> listarBloqueosBDPorFecha(@RequestParam String fechaInicio, @RequestParam String fechaFin){
        LocalDateTime inicio = LocalDateTime.parse(fechaInicio,formatter);
        LocalDateTime fin = LocalDateTime.parse(fechaFin,formatter);
        return bloqueoBDService.listarBloqueosPorFechasParaSimulacion(inicio,fin);
    }


}
