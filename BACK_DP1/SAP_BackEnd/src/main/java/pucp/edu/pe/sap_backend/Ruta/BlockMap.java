package pucp.edu.pe.sap_backend.Ruta;

import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDateTime;

@ToString
@EqualsAndHashCode
public class BlockMap {
    private Blocknode[][] map;

    public BlockMap(int x, int y) {
        this.map = new Blocknode[x][y];
    }

    public Blocknode[][] getMap() {
        return map;
    }

    public void setMap(Blocknode[][] map) {
        this.map = map;
    }

}
