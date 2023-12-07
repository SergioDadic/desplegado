package pucp.edu.pe.sap_backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import pucp.edu.pe.sap_backend.Service.SubidaDeArchivosService;

import java.io.IOException;

@RestController
@RequestMapping("/back")
public class SubidaDeArchivosController {

    @Autowired
    private final SubidaDeArchivosService subidaDeArchivosService;

    public SubidaDeArchivosController(SubidaDeArchivosService subidaDeArchivosService) {
        this.subidaDeArchivosService = subidaDeArchivosService;
    }

    @PostMapping("/api/v1/SubidaDeArchivos/subidaDeArchivos")
    public String subidaPedidos(@RequestParam("files")MultipartFile[] files){
        for (MultipartFile file : files) {
            subidaDeArchivosService.saveFile(file);
        }
        return "Archivos subidos y reemplazados con éxito si era necesario";
    }


}
