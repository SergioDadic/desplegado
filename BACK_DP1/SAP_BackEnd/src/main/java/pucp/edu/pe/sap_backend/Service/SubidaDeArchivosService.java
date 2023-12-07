package pucp.edu.pe.sap_backend.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class SubidaDeArchivosService {

    private final Path root= Paths.get("DataSet");


    public void saveFile(MultipartFile file){
        try{
            if (doesFileExist(file)){
                Files.delete(this.root.resolve(file.getOriginalFilename()));
            }
            Files.copy(file.getInputStream(),this.root.resolve(file.getOriginalFilename()));
        }catch (Exception e){
            if(e instanceof FileAlreadyExistsException){
                throw new RuntimeException(" un archivo con ese nombre existe");
            }
            throw new RuntimeException(e.getMessage());
        }
    }

    public boolean doesFileExist(MultipartFile file){
        return Files.exists(this.root.resolve(file.getOriginalFilename()));
    }
}
