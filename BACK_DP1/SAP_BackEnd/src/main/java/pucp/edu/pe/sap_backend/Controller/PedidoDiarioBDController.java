package pucp.edu.pe.sap_backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pucp.edu.pe.sap_backend.Repository.PedidoDiarioBDRepository;
import pucp.edu.pe.sap_backend.Service.PedidoDiarioBDService;

import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("api/v1/PedidoDiario")
public class PedidoDiarioBDController {
    @Autowired
    private final PedidoDiarioBDService pedidoDiarioBDService;
    private final PedidoDiarioBDRepository pedidoDiarioBDRepository;
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public PedidoDiarioBDController(PedidoDiarioBDService pedidoDiarioBDService,
                                    PedidoDiarioBDRepository pedidoDiarioBDRepository){
        this.pedidoDiarioBDRepository = pedidoDiarioBDRepository;
        this.pedidoDiarioBDService = pedidoDiarioBDService;

    }

}
