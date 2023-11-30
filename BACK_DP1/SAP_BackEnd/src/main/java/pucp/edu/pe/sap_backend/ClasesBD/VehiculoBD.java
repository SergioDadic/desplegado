package pucp.edu.pe.sap_backend.ClasesBD;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehiculo")
@NoArgsConstructor
@Getter
@Setter
public class VehiculoBD {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",nullable = false)
    private int id;

    @Column(name = "tipo_vehiculo") // Tipo : {TA,TB,TC,TD}
    private String tipo;

    @Column(name = "tara_vehiculo")
    private double tara;

    @Column(name = "glp_vehiculo_m3")
    private double glpVehiculoM3;

    @Column(name = "glp_vehiculo_tn")
    private double glpVehiculoTn;

    @Column(name = "peso_combinado_vehiculo")
    private double pesoCombinado;



    public VehiculoBD(String tipo, double tara, double glpVehiculoM3, double glpVehiculoTn,
                      double pesoCombinado) {
        this.tipo = tipo;
        this.tara = tara;
        this.glpVehiculoM3 = glpVehiculoM3;
        this.glpVehiculoTn = glpVehiculoTn;
        this.pesoCombinado = pesoCombinado;
    }
}
