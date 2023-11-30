package pucp.edu.pe.sap_backend.ClasesBD;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Entity
@Table(name = "bloqueo")
@NoArgsConstructor
@Getter
@Setter
public class BloqueosBD {
//01d06h00m-01d15h00m:31,21,34,21

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",nullable = false)
    private int id;

    @Column(name = "tiempo_inicio_bloqueo")
    private LocalDateTime inicioBloqueo;

    @Column(name = "tiempo_fin_bloqueo")
    private LocalDateTime finBloqueo;

    @Column(name = "pos_x")
    private double pos_x;

    @Column(name = "pos_y")
    private double pos_y;
//    @OneToMany(mappedBy = "bloqueo", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<CoordenaBloqueo> coordenadas;

    public BloqueosBD(int YYYYIni, int MMDDIni, int hhmmIni,int YYYYFin, int MMDDFin, int hhmmFin, double pos_x, double pos_y) {
        String aux= createDate(YYYYIni,MMDDIni/100,MMDDIni%100,hhmmIni/100,hhmmIni%100);
        String aux2= createDate(YYYYFin,MMDDFin/100,MMDDFin%100,hhmmFin/100,hhmmFin%100);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        LocalDateTime fechaRecibida1 = LocalDateTime.parse(aux,formatter);
        LocalDateTime fechaRecibida2 = LocalDateTime.parse(aux2,formatter);
        this.inicioBloqueo = fechaRecibida1;
        this.finBloqueo = fechaRecibida2;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
    }
    public BloqueosBD(double pos_x, double pos_y) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;
    }


    public String createDate(int YYYY, int MM, int DD, int hour, int minutes){
        String auxYear = String.format("%02d", YYYY);
        String auxMonth = String.format("%02d", MM);
        String auxDay = String.format("%02d", DD);
        String auxHour = String.format("%02d", hour);
        String auxMinute = String.format("%02d", minutes);
        String date = auxYear+"-"+auxMonth+"-"+auxDay+" "+auxHour+":"+auxMinute;
        return date;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        BloqueosBD that = (BloqueosBD) o;

        if (pos_x != that.pos_x) return false;
        if (pos_y != that.pos_y) return false;
        // Añade otras comparaciones si es necesario

        return true;
    }

    @Override
    public int hashCode() {
        int result = (int) pos_x;
        result = (int) (31 * result + pos_y);
        // Calcula un código hash basado en los campos relevantes de tu clase
        return result;
    }
}



