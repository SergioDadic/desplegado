package pucp.edu.pe.sap_backend.LecturaDatos;

import org.hibernate.boot.model.source.spi.PluralAttributeIndexNature;
import pucp.edu.pe.sap_backend.Genetico.Pedido;

import java.io.File;
import java.io.FileNotFoundException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class LecturaDatos {


    public static LinkedList<Pedido> lecturaDecliente(LocalDateTime fechaInicio, Integer duracion){
        LinkedList<Pedido> nuevaLista = new LinkedList<>();

        LocalDateTime fechaFinal = fechaInicio.plusDays(duracion); // Calcula la fecha final basada en la duración
        String auxName = "pedidos/Prueba";
        String auxYearFormat = String.format("%04d", fechaInicio.getYear());
        String auxMonthFormat = String.format("%02d", fechaInicio.getMonthValue());
        try {
            File myObj = new File(auxName + auxYearFormat + auxMonthFormat + ".txt");
            String auxLine;
            Scanner myReader = new Scanner(myObj);
            int auxDate = Integer.parseInt(myObj.getName().substring(6, 12));
            int auxId, auxDD, auxHH, auxMM, auxX, auxY, auxCant, auxLimit;
            int idOrder = 1;
            while (myReader.hasNextLine()) {
                auxLine = myReader.nextLine();
                String[] parts = auxLine.split(":");

                String duration = parts[0];
                int days = Integer.parseInt(duration.split("d")[0]);
                int hours = Integer.parseInt(duration.split("d")[1].split("h")[0]);
                int minutes = Integer.parseInt(duration.split("h")[1].split("m")[0]);

                auxDD = days;
                auxHH = hours;
                auxMM = minutes;
                auxLine = parts[1];
                parts = auxLine.split(",");
                auxX = Integer.parseInt(parts[0]);
                auxY = Integer.parseInt(parts[1]);
                auxId = Integer.parseInt(parts[2]);
                auxCant = Integer.parseInt(parts[3].split("m")[0]);
                auxLimit = Integer.parseInt(parts[4].split("h")[0]);


                LocalDateTime fechaPedido = LocalDateTime.of(Integer.parseInt(auxYearFormat), Integer.parseInt(auxMonthFormat), days, hours, minutes);

                if(fechaPedido.isAfter(fechaInicio)  && fechaPedido.isBefore(fechaFinal) ){

                    nuevaLista.add(new Pedido(idOrder, auxId, auxX, auxY, auxCant, auxDate / 100, (auxDate % 100) * 100 + auxDD, auxHH * 100 + auxMM, auxLimit,"aaa"));
                    idOrder++;
                }


                //fechaInicio = fechaInicio.plusDays(1); // Incrementa la fecha de inicio en un día
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        //fechaInicio = fechaInicio.plusDays(1); // Incrementa la fecha de inicio en un día

        return nuevaLista;


    }
}
