package pucp.edu.pe.sap_backend.ClasesBD;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "coordenada_bloqueo")
@NoArgsConstructor
@Getter
@Setter
public class CoordenaBloqueo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

    @Column(name = "coordenada_x")
    private int coordenadaX;

    @Column(name = "coordenada_y")
    private int coordenadaY;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bloqueo_id")
    private BloqueosBD bloqueo;
}
