package pucp.edu.pe.sap_backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import pucp.edu.pe.sap_backend.ClasesBD.VehiculoBD;
import pucp.edu.pe.sap_backend.Genetico.Genetico;
import pucp.edu.pe.sap_backend.Service.ReporteSimulacionPDFService;
import pucp.edu.pe.sap_backend.Service.VehiculoBDService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RestController
@RequestMapping(path = "/back")
public class ReporteSimulacionPDFController {
    private final ReporteSimulacionPDFService reporteSimulacionPDFService;
    private final VehiculoBDService vehiculoBDService;
    @Autowired
    public ReporteSimulacionPDFController(ReporteSimulacionPDFService reporteSimulacionPDFService,
                                          VehiculoBDService vehiculoBDService){
        this.reporteSimulacionPDFService = reporteSimulacionPDFService;
        this.vehiculoBDService = vehiculoBDService;
    }

    @GetMapping(value = "/api/v1/reportePDF/generar",produces =  MediaType.APPLICATION_PDF_VALUE)
    public ModelAndView generarPDF(){
        List<VehiculoBD> vehiculos = vehiculoBDService.listar();
        Map<String, Object> model = new HashMap<>();
        model.put("Vehiculos", vehiculos);
        return new ModelAndView(reporteSimulacionPDFService,model);
    }
}
