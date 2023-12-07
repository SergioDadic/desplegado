package pucp.edu.pe.sap_backend.Genetico;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
//@AllArgsConstructor
public class Almacen {

    private int pos_x;
    private int pos_y;
    private String nombreAlmacen;
    private double cantMaximaLiquidoGLP; //GLP EN M3
    private double cantMaximaLiquidoM3;
    private double cantidadOriginal;

    private double cantidadLiquidoGenerarRutas;
    private double cantidadLiquidoReplanificar;


    public Almacen(int pos_x, int pos_y, String nombreAlmacen, double cantMaximaLiquidoGLP,
                   double cantMaximaLiquidoM3) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.nombreAlmacen = nombreAlmacen;
        this.cantMaximaLiquidoGLP = cantMaximaLiquidoGLP;
        this.cantMaximaLiquidoM3 = cantMaximaLiquidoM3;
        this.cantidadOriginal = cantMaximaLiquidoGLP;
        this.cantidadLiquidoGenerarRutas = cantMaximaLiquidoGLP;
        this.cantidadLiquidoReplanificar = cantMaximaLiquidoGLP;
    }
}
