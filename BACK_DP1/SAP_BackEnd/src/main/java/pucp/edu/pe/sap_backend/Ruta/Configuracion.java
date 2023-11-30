package pucp.edu.pe.sap_backend.Ruta;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Configuracion {

    private int id;

    private int pos_x_almacen;

    private int pos_y_almacen;

    private int x_tamanho_mapa;

    private int y_tamanho_mapa;

    private int num_autos;

    private int tiempoMax;


}
