package pucp.edu.pe.sap_backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sap_backend.ClasesBD.PedidoBD;
import pucp.edu.pe.sap_backend.ClasesBD.VehiculoBD;
import pucp.edu.pe.sap_backend.Repository.VehiculoBDRepository;

@Service
public class VehiculoBDService {
    @Autowired
    private final VehiculoBDRepository vehiculoBDRepository;
    public VehiculoBDService(VehiculoBDRepository vehiculoBDRepository) {
        this.vehiculoBDRepository = vehiculoBDRepository;
    }

    public void guardarVehiculoBD(VehiculoBD vehiculoBD) {
        vehiculoBDRepository.saveAndFlush(vehiculoBD);
    }
    public void limpiarVehiculosBD(){
        vehiculoBDRepository.deleteAll();
    }
}
