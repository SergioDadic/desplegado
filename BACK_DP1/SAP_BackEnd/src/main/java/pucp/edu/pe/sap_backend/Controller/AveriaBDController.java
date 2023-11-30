package pucp.edu.pe.sap_backend.Controller;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.univocity.parsers.common.record.Record;
import com.univocity.parsers.csv.CsvParser;
import com.univocity.parsers.csv.CsvParserSettings;
import pucp.edu.pe.sap_backend.ClasesBD.AveriaBD;
import pucp.edu.pe.sap_backend.Repository.AveriaBDRepository;
import pucp.edu.pe.sap_backend.Service.AveriaBDService;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/v1/Averia")
public class AveriaBDController {
    @Autowired
    private final AveriaBDService averiaBDService;

    private final AveriaBDRepository averiaBDRepository;

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final static Logger log = LoggerFactory.getLogger(AveriaBDController.class);

    public AveriaBDController(AveriaBDService averiaBDService, AveriaBDRepository averiaBDRepository) {
        this.averiaBDService = averiaBDService;
        this.averiaBDRepository = averiaBDRepository;
    }

//    @PostMapping("/guardar")
//    AveriaBD guardarAveriaBD(@RequestBody Map<String,Object> nuevaAveria) {
//        log.info("Agregando averia...");
//        var json = new JSONObject(nuevaAveria);
//        //var averia = new AveriaBD(json.getString("turno"),json.getString("matricula"),json.getString("tipo"));
//        return averiaBDRepository.saveAndFlush(averia);
//    }

    @GetMapping("/leer")
    List<AveriaBD> listarAveriaBD(){
        return averiaBDService.listar();
    }


    @PostMapping("/nueva_averia")
    public AveriaBD nuevaAveria(@RequestBody AveriaBD nuevaAveriaBD){

        String nombreCamion=" ";

        nombreCamion = "Aut" + String.format("%03d",nuevaAveriaBD.getId_vehiculo());

        nuevaAveriaBD.setNombre_vehiculo(nombreCamion);

        if(nuevaAveriaBD.getFecha()==null){
            nuevaAveriaBD.setFecha(LocalDateTime.now());
        }
        LocalTime horaActual = nuevaAveriaBD.getFecha().toLocalTime();
        LocalDate fechaActual = nuevaAveriaBD.getFecha().toLocalDate();

        int turnoActual;

        int turno_actual;
        if (horaActual.isAfter(LocalTime.of(0, 0)) && horaActual.isBefore(LocalTime.of(8, 0))) {
            turno_actual = 1;
        } else if (horaActual.isAfter(LocalTime.of(8, 0)) && horaActual.isBefore(LocalTime.of(16, 0))) {
            turno_actual = 2;
        } else {// ENTRE 16 Y 24
            turno_actual = 3;
        }
        nuevaAveriaBD.setTurno_averia(turno_actual);

        int vuelta =1;
        int proximoTurno;
        int horas_inmovilizado=0;
        LocalDateTime fechaInmovilizacion;
        LocalDateTime fechaDisponible;

        if(nuevaAveriaBD.getTipo_averia()==1){
            horas_inmovilizado = 2;
            fechaInmovilizacion = LocalDateTime.of(fechaActual,horaActual);
            fechaInmovilizacion = fechaInmovilizacion.plusHours(horas_inmovilizado);
            nuevaAveriaBD.setHoras_inmovilizado(horas_inmovilizado);
            nuevaAveriaBD.setFecha_inmovilizado(fechaInmovilizacion);

            int turno_auxiliar=0;
            if (horaActual.isAfter(LocalTime.of(0, 0)) && horaActual.isBefore(LocalTime.of(8, 0))) {
                turno_auxiliar = 1;
            } else if (horaActual.isAfter(LocalTime.of(8, 0)) && horaActual.isBefore(LocalTime.of(16, 0))) {
                turno_auxiliar = 2;
            } else {// ENTRE 16 Y 24
                turno_auxiliar = 3;
            }

            if(turno_auxiliar == nuevaAveriaBD.getTurno_averia()){
                nuevaAveriaBD.setProx_turno_disponible(turno_auxiliar);
                nuevaAveriaBD.setProx_fecha_disponible(fechaInmovilizacion);
                vuelta=1;
            }else{
                if(fechaInmovilizacion.toLocalDate()== fechaActual){
                    nuevaAveriaBD.setProx_turno_disponible(turno_auxiliar);
                    nuevaAveriaBD.setProx_fecha_disponible(fechaInmovilizacion);
                    vuelta=1;

                }else if (fechaInmovilizacion.toLocalDate().isAfter(fechaActual)){
                    nuevaAveriaBD.setProx_turno_disponible(1);
                    nuevaAveriaBD.setProx_fecha_disponible(fechaInmovilizacion);
                    vuelta = 2;
                }
            }
            nuevaAveriaBD.setVuelta(vuelta);


        } else if (nuevaAveriaBD.getTipo_averia()==2) {
            nuevaAveriaBD.setHoras_inmovilizado(horas_inmovilizado);
            nuevaAveriaBD.setFecha_inmovilizado(LocalDateTime.of(fechaActual,horaActual).plusHours(2));
            if (turno_actual == 1) {
                vuelta = 1;
                proximoTurno = turno_actual + 2; // prox = 3 vuelta 1
            } else if (turno_actual == 2) {
                vuelta = 2;
                proximoTurno = 1; // prox = 1 vuelta 2
            } else {
                vuelta = 2;
                proximoTurno = turno_actual - 1; // prox = 2 vuelta 2
            }
            nuevaAveriaBD.setProx_turno_disponible(proximoTurno);
            if (vuelta==2){
                if (nuevaAveriaBD.getProx_turno_disponible()==1){
                    fechaDisponible= LocalDateTime.of(fechaActual.plusDays(1),LocalTime.of(0,0));
                }else{
                    fechaDisponible= LocalDateTime.of(fechaActual.plusDays(1),LocalTime.of(8,0));
                }
            }else{
                if(nuevaAveriaBD.getProx_turno_disponible()==2){
                    fechaDisponible = LocalDateTime.of(fechaActual,LocalTime.of(8,0));
                }else{
                    fechaDisponible = LocalDateTime.of(fechaActual,LocalTime.of(16,0));
                }
            }
            nuevaAveriaBD.setVuelta(vuelta);
            nuevaAveriaBD.setProx_fecha_disponible(fechaDisponible);

        }else if (nuevaAveriaBD.getTurno_averia()==3){
            vuelta=4;
            nuevaAveriaBD.setHoras_inmovilizado(4);
            nuevaAveriaBD.setFecha_inmovilizado(LocalDateTime.of(fechaActual,horaActual).plusHours(4));
            nuevaAveriaBD.setProx_turno_disponible(1);
            nuevaAveriaBD.setProx_fecha_disponible(LocalDateTime.of(fechaActual.plusDays(3),LocalTime.of(0,0)));
            nuevaAveriaBD.setVuelta(vuelta);
        }
        return averiaBDRepository.save(nuevaAveriaBD);

    }

    @PostMapping("/cargarAveria")
    public String cargaMasivaDeAverias(@RequestParam("file")MultipartFile file) throws Exception{
        if(file.isEmpty()){
            return "El archivo está vacio";
        }
        List<AveriaBD> averias = new ArrayList<>();
        try(BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))){
            String line;
            while((line=br.readLine())!=null){
                String[] parts = line.split("_");
                AveriaBD nuevaAveriaBD = new AveriaBD();
                String numeroTurnoArchivo = parts[0].substring(1);
                String idVehiculoArchivo = parts[1].substring(3);
                String tipoVehiculo = parts[1];
                String tipoAveriaArchivo = parts[2].substring(2);

                int numeroTurno = Integer.parseInt(numeroTurnoArchivo);
                //int idVehiculo = Integer.parseInt(idVehiculoArchivo);

                int tipoIncidente = Integer.parseInt(tipoAveriaArchivo);
                nuevaAveriaBD.setTurno_averia(numeroTurno);
                nuevaAveriaBD.setNombre_vehiculo(parts[1]);
                nuevaAveriaBD.setTipo_averia(tipoIncidente);


                nuevaAveriaBD.setFecha(LocalDateTime.now());
                LocalTime horaActual = LocalTime.now();
                LocalDate fechaActual = LocalDate.now();

                int vuelta =1;
                int proximoTurno;
                int horas_inmovilizado=0;
                LocalDateTime fechaInmovilizacion;
                LocalDateTime fechaDisponible;

                if(nuevaAveriaBD.getTipo_averia()==1){
                    horas_inmovilizado = 2;
                    fechaInmovilizacion = LocalDateTime.of(fechaActual,horaActual);
                    fechaInmovilizacion = fechaInmovilizacion.plusHours(horas_inmovilizado);
                    nuevaAveriaBD.setHoras_inmovilizado(horas_inmovilizado);
                    nuevaAveriaBD.setFecha_inmovilizado(fechaInmovilizacion);

                    int turno_auxiliar=0;
                    if (horaActual.isAfter(LocalTime.of(0, 0)) && horaActual.isBefore(LocalTime.of(8, 0))) {
                        turno_auxiliar = 1;
                    } else if (horaActual.isAfter(LocalTime.of(8, 0)) && horaActual.isBefore(LocalTime.of(16, 0))) {
                        turno_auxiliar = 2;
                    } else {// ENTRE 16 Y 24
                        turno_auxiliar = 3;
                    }

                    if(turno_auxiliar == nuevaAveriaBD.getTurno_averia()){
                        nuevaAveriaBD.setProx_turno_disponible(turno_auxiliar);
                        nuevaAveriaBD.setProx_fecha_disponible(fechaInmovilizacion);
                        vuelta=1;
                    }else{
                        if(fechaInmovilizacion.toLocalDate()== fechaActual){
                            nuevaAveriaBD.setProx_turno_disponible(turno_auxiliar);
                            nuevaAveriaBD.setProx_fecha_disponible(fechaInmovilizacion);
                            vuelta=1;

                        }else if (fechaInmovilizacion.toLocalDate().isAfter(fechaActual)){
                            nuevaAveriaBD.setProx_turno_disponible(1);
                            nuevaAveriaBD.setProx_fecha_disponible(fechaInmovilizacion);
                            vuelta = 2;
                        }
                    }
                    nuevaAveriaBD.setVuelta(vuelta);


                } else if (nuevaAveriaBD.getTipo_averia()==2) {
                    nuevaAveriaBD.setHoras_inmovilizado(horas_inmovilizado);
                    nuevaAveriaBD.setFecha_inmovilizado(LocalDateTime.of(fechaActual,horaActual).plusHours(2));
                    if (nuevaAveriaBD.getTurno_averia() == 1) {
                        vuelta = 1;
                        proximoTurno = nuevaAveriaBD.getTurno_averia() + 2; // prox = 3 vuelta 1
                    } else if (nuevaAveriaBD.getTurno_averia() == 2) {
                        vuelta = 2;
                        proximoTurno = 1; // prox = 1 vuelta 2
                    } else {
                        vuelta = 2;
                        proximoTurno = nuevaAveriaBD.getTurno_averia() - 1; // prox = 2 vuelta 2
                    }
                    nuevaAveriaBD.setProx_turno_disponible(proximoTurno);
                    if (vuelta==2){
                        if (nuevaAveriaBD.getProx_turno_disponible()==1){
                            fechaDisponible= LocalDateTime.of(fechaActual.plusDays(1),LocalTime.of(0,0));
                        }else{
                            fechaDisponible= LocalDateTime.of(fechaActual.plusDays(1),LocalTime.of(8,0));
                        }
                    }else{
                        if(nuevaAveriaBD.getProx_turno_disponible()==2){
                            fechaDisponible = LocalDateTime.of(fechaActual,LocalTime.of(8,0));
                        }else{
                            fechaDisponible = LocalDateTime.of(fechaActual,LocalTime.of(16,0));
                        }
                    }
                    nuevaAveriaBD.setVuelta(vuelta);
                    nuevaAveriaBD.setProx_fecha_disponible(fechaDisponible);

                }else if (nuevaAveriaBD.getTurno_averia()==3){
                    vuelta=4;
                    nuevaAveriaBD.setHoras_inmovilizado(4);
                    nuevaAveriaBD.setFecha_inmovilizado(LocalDateTime.of(fechaActual,horaActual).plusHours(4));
                    nuevaAveriaBD.setProx_turno_disponible(1);
                    nuevaAveriaBD.setProx_fecha_disponible(LocalDateTime.of(fechaActual.plusDays(3),LocalTime.of(0,0)));
                    nuevaAveriaBD.setVuelta(vuelta);
                }

                averias.add(nuevaAveriaBD);

            }

            averiaBDRepository.saveAll(averias);



            return "Archivo CSV cargado exitosamente";
        } catch (IOException e) {
            return "Error al cargar el archivo csv: "+ e.getMessage();
        }

    }





}
