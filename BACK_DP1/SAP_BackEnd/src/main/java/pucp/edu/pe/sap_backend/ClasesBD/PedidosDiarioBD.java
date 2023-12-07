package pucp.edu.pe.sap_backend.ClasesBD;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
@Entity
@Table(name = "pedidoDiario")
@NoArgsConstructor
@Getter
@Setter
public class PedidosDiarioBD {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",nullable = false)
    private int id;

    @Column(name = "nombre_pedido",length = 235)
    private String idPedido;

    @Column(name = "cantidad_pedido")
    private int cantidadPedido;

    @Column(name = "fecha_recibida")
    private LocalDateTime fechaRecibida;

    @Column(name = "fecha_maxima_entrega")
    private LocalDateTime HoraEstimadaDeEntregaMaxima;

    @Column(name = "pos_x")
    private double pos_x;

    @Column(name = "pos_y")
    private double pos_y;

    public PedidosDiarioBD(String idPedido, int cantidadPedido, int YYYY, int MMDD, int hhmm, int maxHours, double pos_x, double pos_y) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.idPedido = idPedido;
        this.cantidadPedido = cantidadPedido;
        String aux= createDate(YYYY,MMDD/100,MMDD%100,hhmm/100,hhmm%100);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        fechaRecibida = LocalDateTime.parse(aux,formatter);
        HoraEstimadaDeEntregaMaxima = fechaRecibida.plusHours(maxHours);
    }
    public PedidosDiarioBD(String idPedido, int cantidadPedido,double pos_x, double pos_y) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.idPedido = idPedido;
        this.cantidadPedido = cantidadPedido;
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



}
