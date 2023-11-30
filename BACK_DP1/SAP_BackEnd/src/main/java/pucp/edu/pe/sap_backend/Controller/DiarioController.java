package pucp.edu.pe.sap_backend.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pucp.edu.pe.sap_backend.Genetico.Genetico;

import java.time.format.DateTimeFormatter;
import java.util.concurrent.Future;

@RestController
@RequestMapping("/diario/simulacion")
public class DiarioController implements Runnable{

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    private Genetico genetico;
    //Para detener el scheduler
    private Future<?> future;

    //Bandera de planificacion
    private boolean planificando;
    @Override
    public void run() {

    }
}
