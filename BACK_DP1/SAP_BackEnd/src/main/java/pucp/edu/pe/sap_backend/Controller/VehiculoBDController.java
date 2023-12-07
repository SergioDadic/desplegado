package pucp.edu.pe.sap_backend.Controller;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pucp.edu.pe.sap_backend.ClasesBD.VehiculoBD;
import pucp.edu.pe.sap_backend.Repository.VehiculoBDRepository;
import pucp.edu.pe.sap_backend.Service.VehiculoBDService;

import java.util.Map;

@RestController
@RequestMapping("/back")
public class VehiculoBDController {
    @Autowired
    private final VehiculoBDService vehiculoBDService;
    private final VehiculoBDRepository vehiculoBDRepository;

    private final static Logger log = LoggerFactory.getLogger(AveriaBDController.class);

    public VehiculoBDController(VehiculoBDService vehiculoBDService,VehiculoBDRepository vehiculoBDRepository){
        this.vehiculoBDService = vehiculoBDService;
        this.vehiculoBDRepository = vehiculoBDRepository;
    }

    @PostMapping("/api/v1/Vehiculo/guardar")
    VehiculoBD guardarVehiculo(@RequestBody Map<String,Object>nuevoVehiculo){
        log.info("Agregando vehiculo...");
        var json = new JSONObject(nuevoVehiculo);
        var vehiculo = new VehiculoBD(json.getString("tipo"),json.getDouble("tara"),
                                      json.getDouble("glpm3"), json.getDouble("glptn"),
                                      json.getDouble("pesoCombinado"));
        return vehiculoBDRepository.saveAndFlush(vehiculo);
    }


}
