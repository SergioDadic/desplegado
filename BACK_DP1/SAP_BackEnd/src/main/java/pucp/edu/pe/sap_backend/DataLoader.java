package pucp.edu.pe.sap_backend;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pucp.edu.pe.sap_backend.ClasesBD.VehiculoBD;
import pucp.edu.pe.sap_backend.Genetico.Vehiculo;
import pucp.edu.pe.sap_backend.Repository.VehiculoBDRepository;

@Component
public class DataLoader implements ApplicationRunner {
    private final static Logger log = LoggerFactory.getLogger(DataLoader.class);
    private final VehiculoBDRepository vehiculoBDRepository;

    public DataLoader(VehiculoBDRepository vehiculoBDRepository){
        this.vehiculoBDRepository = vehiculoBDRepository;
    }
    @Override
    public void run(ApplicationArguments args) {
        insertarVehiculos();
    }
    private void insertarVehiculos() {
        if (!vehiculoBDRepository.findAll().isEmpty()) return;
        for (int i=0;i<2;i++){
            log.info("Agregando vehículos TA .../n");
            VehiculoBD vehiculoBD = new VehiculoBD("TA",2.5,25.0,12.5
                    ,15);
            vehiculoBDRepository.save(vehiculoBD);
        }
        //TIPO B
        for (int i=0;i<4;i++){
            log.info("Agregando vehículos TB .../n");
            VehiculoBD vehiculoBD = new VehiculoBD("TB",2.0,15.0,7.5
                    ,9.5);
            vehiculoBDRepository.save(vehiculoBD);
        }
        //TIPO C
        for (int i=0;i<4;i++){
            log.info("Agregando vehículos TC .../n");
            VehiculoBD vehiculoBD = new VehiculoBD("TC",1.5,10.0,5.0
                    ,6.5);
            vehiculoBDRepository.save(vehiculoBD);
        }
        //TIPO D
        for (int i=0;i<10;i++){
            log.info("Agregando vehículos TD .../n");
            VehiculoBD vehiculoBD = new VehiculoBD("TD",1.0,5.0,2.5
                    ,3.5);
            vehiculoBDRepository.save(vehiculoBD);
        }
    }
}
