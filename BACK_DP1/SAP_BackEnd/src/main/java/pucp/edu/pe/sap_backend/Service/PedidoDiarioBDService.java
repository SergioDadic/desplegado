package pucp.edu.pe.sap_backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sap_backend.Repository.PedidoDiarioBDRepository;

@Service
public class PedidoDiarioBDService {
    @Autowired
    private final PedidoDiarioBDRepository pedidoDiarioBDRepository;
    public PedidoDiarioBDService(PedidoDiarioBDRepository pedidoDiarioBDRepository){
        this.pedidoDiarioBDRepository = pedidoDiarioBDRepository;
    }

}
