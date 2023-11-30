package pucp.edu.pe.sap_backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pucp.edu.pe.sap_backend.ClasesBD.BloqueosBD;
import pucp.edu.pe.sap_backend.ClasesBD.PedidoBD;
import pucp.edu.pe.sap_backend.Repository.BloqueoBDRepository;
import pucp.edu.pe.sap_backend.Repository.PedidoBDRepository;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class BloqueoBDService {
    @Autowired
    private final BloqueoBDRepository bloqueoBDRepository;
    public BloqueoBDService(BloqueoBDRepository bloqueoBDRepository) {
        this.bloqueoBDRepository = bloqueoBDRepository;
    }

    public List<BloqueosBD> listar() {
        return bloqueoBDRepository.findAll();
    }

    public void guardarBloqueoBD() {
        BloqueosBD bloq = new BloqueosBD();
        bloq.setInicioBloqueo(LocalDateTime.now().plusHours(2));
        bloq.setFinBloqueo(LocalDateTime.now().plusHours(2));
        bloqueoBDRepository.save(bloq);
    }

    public List<BloqueosBD> listarBloqueosPorFechasParaSimulacion(LocalDateTime fechaInicio, LocalDateTime fechaFin){
        List<BloqueosBD> lista = new ArrayList<>();

        lista = bloqueoBDRepository.findAllByInicioBloqueoIsBetween(fechaInicio,fechaFin);
        return lista;

    }

    public String cargaMasivaParaBloqueos(MultipartFile file) {
        if(file.isEmpty()){
            return "El archivo está vacio";
        }
        List<BloqueosBD> listaBloqueos = new ArrayList<>();
        try(BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))){
            String line;
//            01d00h37m-01d23h59m:05,20,05,35
            int  auxDD, auxHH1, auxMM1, auxX1, auxY1,auxDD2 , auxHH2, auxMM2, auxX2, auxY2 ,coorX, coorY;
            String auxId="";
            LocalDate fechaActual = LocalDate.now();
            // Formatear la fecha en formato yyyymmdd
            DateTimeFormatter formato = DateTimeFormatter.ofPattern("yyyyMMdd");
            String fechaFormateada = fechaActual.format(formato);
            String nombreArchivo = file.getOriginalFilename();
            System.out.println(nombreArchivo);
            if (nombreArchivo!=null){
                // Convertir la fecha formateada a un entero
                nombreArchivo = nombreArchivo.replace(".bloqueos.txt","");
                int anhioMes = Integer.parseInt(nombreArchivo);


                while((line=br.readLine())!=null){
                    String[] parts = line.split(":");
                    String duration = parts[0];

                    String[] durationParts = duration.split("-");
                    //01d00h37m-01d23h59m:05,20,05,35
                    String startDuration = durationParts[0];

                    int days = Integer.parseInt(startDuration.split("d")[0]);
                    int hours = Integer.parseInt(startDuration.split("d")[1].split("h")[0]);
                    int minutes = Integer.parseInt(startDuration.split("h")[1].split("m")[0]);
                    auxDD = days;
                    auxHH1 = hours;
                    auxMM1 = minutes;


                    //01d00h37m-01d23h59m:05,20,05,35

                    String endDuration = durationParts[1];


                    days = Integer.parseInt(endDuration.split("d")[0]);
                    hours = Integer.parseInt(endDuration.split("d")[1].split("h")[0]);
                    minutes = Integer.parseInt(endDuration.split("h")[1].split("m")[0]);
                    auxDD2 = days;
                    auxHH2 = hours;
                    auxMM2 = minutes;

                    int fechaInicio = anhioMes*100 + auxDD;
                    int fechaFin = anhioMes*100 + auxDD2;;

                    System.out.println(fechaInicio +" -- "+ fechaFin );

                    // 05,20,05,35
                    line = parts[1];
                    String[] datosPuntos = parts[1].split(",");
                    List<BloqueosBD> listaDeUnaFecha = new ArrayList<>();

                    Set<BloqueosBD> conjuntoDeUnaFecha = new HashSet<>();
                    for (int i = 0; i < datosPuntos.length -3; i += 2) {


                        int xInicio = Integer.parseInt(datosPuntos[i]);
                        int yInicio = Integer.parseInt(datosPuntos[i+1]);
                        int xFin = Integer.parseInt(datosPuntos[i+2]);
                        int yFin = Integer.parseInt(datosPuntos[i+3]);

                        int deltaX= xFin - xInicio;
                        int deltaY = yFin -yInicio;
                        int distancia = Math.max(Math.abs(deltaX), Math.abs(deltaY));
                        List<BloqueosBD> listaAuxiliar = new ArrayList<>();
                        for( int j=0; j<= distancia; j++){
                            int xIntermedio = xInicio + (deltaX*j)/distancia;
                            int yIntermedio = yInicio + (deltaY*j)/distancia;
                            //System.out.print(fechaInicio + "- " +fechaFin + "-- ("+ xIntermedio +", "+yIntermedio +")");

                            BloqueosBD bloq = new BloqueosBD(fechaInicio/10000,fechaInicio%10000,auxHH1 * 100 + auxMM1,
                                    fechaFin/10000,fechaFin%10000,auxHH2 * 100 + auxMM2,xIntermedio,yIntermedio);
                            conjuntoDeUnaFecha.add(bloq);
                        }



                    }
                    listaDeUnaFecha.addAll(conjuntoDeUnaFecha);
                    listaDeUnaFecha.sort(Comparator.comparingDouble(BloqueosBD::getPos_x).thenComparingDouble(BloqueosBD::getPos_y));

                    listaBloqueos.addAll(listaDeUnaFecha);


                    //System.out.print(fechaInicio + "- " +fechaFin);


//                    listaBloqueos.add(bloq);
                }

                bloqueoBDRepository.saveAllAndFlush(listaBloqueos);
            }

            return "Archivo CSV cargado exitosamente";
        } catch (IOException e) {
            return "Error al cargar el archivo csv: "+ e.getMessage();
        }
    }

    public static <T> List<T> eliminarDuplicados (List<T> lista){
        Set<T> conjunto = new LinkedHashSet<>(lista);
        lista.clear();
        lista.addAll(conjunto);
        return lista;
    }




}
