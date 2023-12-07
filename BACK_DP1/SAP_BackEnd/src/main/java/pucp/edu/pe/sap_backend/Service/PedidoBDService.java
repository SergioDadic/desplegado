package pucp.edu.pe.sap_backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.relational.core.sql.In;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pucp.edu.pe.sap_backend.ClasesBD.BloqueosBD;
import pucp.edu.pe.sap_backend.ClasesBD.PedidoBD;
import pucp.edu.pe.sap_backend.Genetico.Pedido;
import pucp.edu.pe.sap_backend.Repository.PedidoBDRepository;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Service
public class PedidoBDService {
    @Autowired
    private final PedidoBDRepository pedidoBDRepository;

    public PedidoBDService(PedidoBDRepository pedidoBDRepository) {
        this.pedidoBDRepository = pedidoBDRepository;
    }

    public void guardarPedidoBD(PedidoBD pedidoBD) {
        pedidoBDRepository.saveAndFlush(pedidoBD);
    }

    public List<PedidoBD> listar() {
        return pedidoBDRepository.findAll();
    }

    public List<PedidoBD> listarPedidosPorFechasParaSimulacion(LocalDateTime fechaInicio, LocalDateTime fechaFin){
        List<PedidoBD> lista = new ArrayList<>();

        lista = pedidoBDRepository.findAllByFechaRecibidaIsBetween(fechaInicio,fechaFin);
        return lista;

    }


    public List<PedidoBD> lecturaDeArchivos(MultipartFile file){
        if (file.isEmpty()){
            return null;
        }
        List<PedidoBD> listaPedidos = new ArrayList<>();
        try(BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))){
            String line;
//            br.readLine();
//            01d00h03m:1,39,c-70,22m3,13h
            int  auxDD, auxHH, auxMM, auxX, auxY, auxCant, auxLimit;
            String auxId;
            LocalDate fechaActual = LocalDate.now();
            // Formatear la fecha en formato yyyymmdd
            DateTimeFormatter formato = DateTimeFormatter.ofPattern("yyyyMMdd");
            String fechaFormateada = fechaActual.format(formato);
            // Convertir la fecha formateada a un entero

            String nombreArchivo = file.getOriginalFilename();
            System.out.println(nombreArchivo);

            if(nombreArchivo!=null) {
                String anioMesArch = nombreArchivo.substring(6, 12);
                int anhiMes = Integer.parseInt(anioMesArch);
                int fechaEntero = 0;
                while ((line = br.readLine()) != null) {
                    String[] parts = line.split(":");
                    String duration = parts[0];
                    int days = Integer.parseInt(duration.split("d")[0]);
                    int hours = Integer.parseInt(duration.split("d")[1].split("h")[0]);
                    int minutes = Integer.parseInt(duration.split("h")[1].split("m")[0]);
                    fechaEntero = anhiMes * 100 + days;

                    auxDD = days;
                    auxHH = hours;
                    auxMM = minutes;
                    line = parts[1];
                    parts = line.split(",");
                    auxX = Integer.parseInt(parts[0]);
                    auxY = Integer.parseInt(parts[1]);
                    auxId = parts[2];
                    auxCant = Integer.parseInt(parts[3].split("m")[0]);
                    auxLimit = Integer.parseInt(parts[4].split("h")[0]);

                    PedidoBD ped = new PedidoBD(auxId, auxCant, fechaEntero / 10000, fechaEntero % 10000, auxHH * 100 + auxMM, auxLimit, auxX, auxY);
                    listaPedidos.add(ped);

                    System.out.println(fechaEntero);
                }
            }
            return listaPedidos;
        } catch (IOException e) {
            return null;
        }
    }


    private final Path root= Paths.get("DataSet");
    public LinkedList<Pedido> lecturaDePedidoDeArchivos(LocalDateTime fechaInicio, LocalDateTime fechaFin){
        int anhoInicio=fechaInicio.getYear(),mesInicio=fechaInicio.getMonthValue();
        int anhoFin= fechaFin.getYear(), mesFin= fechaFin.getMonthValue();
        String fechaIni = String.valueOf(anhoInicio*100 + mesInicio);
        String fechaCierre = String.valueOf(anhoFin*100 + mesFin);

        LinkedList<Pedido> pedidos = new LinkedList<>();

        List<String> nombreArchivos = new ArrayList<>();
        int contador=0;
        //SACO LOS NOMBRES DE LOS ARCHIVOS QUE TENGO QUE LEER DE PEDIDOS
        if(root.toFile().exists()){
            File[] archivos = root.toFile().listFiles();
            for (File archivo : archivos){
                String palabra = "ventas";
                String nombreArchivoRealInicio = palabra.concat(fechaIni) ;
                String nombreArchivoRealFin = palabra.concat(fechaCierre);
                if(archivo.isFile()){
                    if(archivo.getName().contains(nombreArchivoRealInicio) || archivo.getName().contains(nombreArchivoRealFin) ){
                        //se procesa el archivo
                        pedidos.addAll(procesarArchivo(archivo,fechaInicio,fechaFin,contador));
                    }
                }
            }
        }

        return pedidos;
    }

    public LinkedList<Pedido> procesarArchivo(File archivo,LocalDateTime fechaInicio,LocalDateTime fechaFin,int contador){
        LinkedList<Pedido> listaPedidos = new LinkedList<>();
        int  auxDD, auxHH, auxMM, auxX, auxY, auxCant, auxLimit;
        int anhiMes= Integer.parseInt(archivo.getName().substring(6,12));
        String nombrePedido;
        try (BufferedReader br = new BufferedReader(new FileReader(archivo))){
            String line;
            int fechaEntero = 0;
            while((line=br.readLine())!=null){
                String[] parts = line.split(":");
                String duration = parts[0];
                int days = Integer.parseInt(duration.split("d")[0]);
                int hours = Integer.parseInt(duration.split("d")[1].split("h")[0]);
                int minutes = Integer.parseInt(duration.split("h")[1].split("m")[0]);
                fechaEntero = anhiMes * 100 + days;
                auxDD = days;
                auxHH = hours;
                auxMM = minutes;
                line = parts[1];
                parts = line.split(",");
                auxX = Integer.parseInt(parts[0]);
                auxY = Integer.parseInt(parts[1]);
                nombrePedido = parts[2];
                auxCant = Integer.parseInt(parts[3].split("m")[0]);
                auxLimit = Integer.parseInt(parts[4].split("h")[0]);
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmm");
                String fechaStr = String.valueOf(fechaEntero);
                String horaStr = String.format("%04d",auxHH*100+auxMM);
                LocalDateTime fechaAcomparar= LocalDateTime.parse(fechaStr+horaStr,formatter);
                if ((fechaAcomparar.isEqual(fechaInicio) || fechaAcomparar.isAfter(fechaInicio)) && (fechaAcomparar.isEqual(fechaFin) || fechaAcomparar.isBefore(fechaFin))) {
                    Pedido ped = new Pedido(contador,contador,auxX,auxY,auxCant,fechaEntero/10000,fechaEntero%10000,auxHH*100+auxMM,auxLimit,nombrePedido);
                    listaPedidos.add(ped);
                    contador++;
                }
            }
        }catch (IOException e){
            return null;
        }
        return listaPedidos;
    }

    public String cargaMasivaParaPedidos(MultipartFile file) {
        if(file.isEmpty()){
            return "El archivo está vacio";
        }
        List<PedidoBD> listaPedidos = new ArrayList<>();
        try(BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))){
            String line;
//            br.readLine();
//            01d00h03m:1,39,c-70,22m3,13h
            int  auxDD, auxHH, auxMM, auxX, auxY, auxCant, auxLimit;
            String auxId;
            LocalDate fechaActual = LocalDate.now();
            // Formatear la fecha en formato yyyymmdd
            DateTimeFormatter formato = DateTimeFormatter.ofPattern("yyyyMMdd");
            String fechaFormateada = fechaActual.format(formato);
            // Convertir la fecha formateada a un entero

            String nombreArchivo = file.getOriginalFilename();
            System.out.println(nombreArchivo);

            if(nombreArchivo!=null) {
                String anioMesArch = nombreArchivo.substring(6, 12);
                int anhiMes = Integer.parseInt(anioMesArch);


                int fechaEntero = 0;
                while ((line = br.readLine()) != null) {
                    String[] parts = line.split(":");
                    String duration = parts[0];
                    int days = Integer.parseInt(duration.split("d")[0]);
                    int hours = Integer.parseInt(duration.split("d")[1].split("h")[0]);
                    int minutes = Integer.parseInt(duration.split("h")[1].split("m")[0]);
                    fechaEntero = anhiMes * 100 + days;

                    auxDD = days;
                    auxHH = hours;
                    auxMM = minutes;
                    line = parts[1];
                    parts = line.split(",");
                    auxX = Integer.parseInt(parts[0]);
                    auxY = Integer.parseInt(parts[1]);
                    auxId = parts[2];
                    auxCant = Integer.parseInt(parts[3].split("m")[0]);
                    auxLimit = Integer.parseInt(parts[4].split("h")[0]);

                    PedidoBD ped = new PedidoBD(auxId, auxCant, fechaEntero / 10000, fechaEntero % 10000, auxHH * 100 + auxMM, auxLimit, auxX, auxY);
                    listaPedidos.add(ped);

                    System.out.println(fechaEntero);
                }

                pedidoBDRepository.saveAllAndFlush(listaPedidos);
            }

            return "Archivo CSV cargado exitosamente";
        } catch (IOException e) {
            return "Error al cargar el archivo csv: "+ e.getMessage();
        }
    }
    private String getSeparator(String line) {
        String[] separators = {",", ";", "\t"}; // Posibles separadores: coma, punto y coma, tabulación
        for (String separator : separators) {
            if (line.contains(separator)) {
                return separator;
            }
        }
        // Si no se encuentra un separador conocido, se puede lanzar una excepción o utilizar un separador predeterminado
        return ",";
    }


}
