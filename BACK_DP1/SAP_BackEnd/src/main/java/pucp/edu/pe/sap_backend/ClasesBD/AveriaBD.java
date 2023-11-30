package pucp.edu.pe.sap_backend.ClasesBD;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "averia")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AveriaBD {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

    @Column(name = "fecha", columnDefinition = "datetime(0)", nullable = true)
    private LocalDateTime fecha;

    @Column(name = "id_vehiculo", nullable = true)
    private int id_vehiculo;

    @Column(name = "tipo_vehiculo", nullable = true)
    private int tipo_vehiculo;

    @Column(name = "nombre_vehiculo", nullable = true)
    private String nombre_vehiculo;

    @Column(name = "turno_averia", nullable = true)
    private int turno_averia;

    @Column(name = "tipo_averia", nullable = true)
    private int tipo_averia;

    @Column(name = "prox_turno_disponible", nullable = true)
    private int prox_turno_disponible;

    @Column(name = "prox_fecha_disponible", columnDefinition = "datetime(0)", nullable = true)
    private LocalDateTime prox_fecha_disponible;

    @Column(name = "descripcion", nullable = true)
    private String descripcion;

    @Column(name = "vuelta", nullable = true)
    private int vuelta;


    @Transient
    private int averiaCalculada;

    public AveriaBD(int id_vehiculo, int turno_averia, int tipo_averia) {
        this.id_vehiculo = id_vehiculo;
        this.turno_averia = turno_averia;
        this.tipo_averia = tipo_averia;
        this.averiaCalculada = 0;
    }

    @Column(name = "horas_inmovilizado", nullable = true)
    private int horas_inmovilizado;

    @Column(name = "fecha_inmovilizado", columnDefinition = "datetime(0)", nullable = true)
    private LocalDateTime fecha_inmovilizado;

    @Column(name = "coord_x", nullable = true)
    private int coord_x;

    @Column(name = "coord_y", nullable = true)
    private int coord_y;
}
