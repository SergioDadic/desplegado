package pucp.edu.pe.sap_backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import pucp.edu.pe.sap_backend.ClasesBD.AveriaBD;
import pucp.edu.pe.sap_backend.Repository.AveriaBDRepository;

import java.util.List;
import java.util.Map;

@Service
public class AveriaBDService {
    @Autowired
    private final AveriaBDRepository averiaBDRepository;
    public AveriaBDService(AveriaBDRepository averiaBDRepository) {
        this.averiaBDRepository = averiaBDRepository;
    }

    public List<AveriaBD> listar() {
        return averiaBDRepository.findAll();
    }

}
