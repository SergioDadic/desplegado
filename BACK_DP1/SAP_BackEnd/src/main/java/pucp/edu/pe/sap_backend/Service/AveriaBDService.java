package pucp.edu.pe.sap_backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import pucp.edu.pe.sap_backend.ClasesBD.AveriaBD;
import pucp.edu.pe.sap_backend.Repository.AveriaBDRepository;

import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
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


    private final Path root= Paths.get("DataSet");
    public List<AveriaBD> lecturaDeAveriasDeArchivos(){
        List<AveriaBD> listaAverias =new ArrayList<>();
        if(root.toFile().exists()){
            File[] archivos = root.toFile().listFiles();
            for (File archivo:archivos){
                if(archivo.isFile()){
                    if (archivo.getName().contains("averias")){
                        //PROCESAR INFO DE AVERIAS
                        listaAverias.addAll(procesarArchivo(archivo));
                    }
                }
            }
        }



        return  listaAverias;
    }

    public List<AveriaBD> procesarArchivo(File archivo){
        List<AveriaBD> listaAverias=new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(archivo))){
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
                nuevaAveriaBD.setTipo_vehiculo(1);
                nuevaAveriaBD.setNombre_vehiculo(idVehiculoArchivo); //TD01 ASÍ CHAPA ESO
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
                            fechaDisponible= LocalDateTime.of(fechaActual.plusDays(1), LocalTime.of(0,0));
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

                nuevaAveriaBD.setDeArchivo(1);
                listaAverias.add(nuevaAveriaBD);


            }

        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return  listaAverias;
    }

}
