package pucp.edu.pe.sap_backend.Ruta;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;
import java.util.List;

@ToString
@EqualsAndHashCode
@Getter
@Setter
public class Cell {
    public int x;
    public int y;
    public int dist;      //distance
    public boolean blocked;
    public LocalDateTime tiempoActual;
    public Cell prev;  //parent cell in the path
    public Cell(int x, int y, int dist, Cell prev, LocalDateTime tiempo) {
        this.x = x;
        this.y = y;
        this.dist = dist;
        double tiempoEnMinutos = dist*60/50;
        int minutesPart= (int) tiempoEnMinutos;
        int segundosPart = (int) ((tiempoEnMinutos - minutesPart) *60);
        this.tiempoActual = tiempo.plusMinutes(minutesPart).plusSeconds(segundosPart);
        this.prev = prev;
        this.blocked=false;
    }
    public Cell(){

    }
    public Cell( int x, int y){
        this.x = x;
        this.y= y;
    }
    public double calculateDistance ( Cell uno){


        return Math.sqrt(Math.pow(this.x - uno.getX(), 2) + Math.pow(this.y - uno.getY(), 2));
    }
    public Cell(LocalDateTime tiempo,int x, int y, int dist, Cell prev) {
        this.x = x;
        this.y = y;
        this.dist = dist;
        this.tiempoActual = tiempo;
        this.prev = prev;
        this.blocked=false;
    }

    @Override
    public String toString(){
        return "(" + x + "," + y + ") , ";
    }


    public Cell encontraPuntoMasCercano(Cell inicial, List<Cell> puntos){
        Cell masCercano = puntos.get(0);
        double distanciaMinima = inicial.calculateDistance(masCercano);

        for (Cell cell: puntos){
            double distanciaActual = inicial.calculateDistance(cell);
            if(distanciaActual<distanciaMinima){
                distanciaMinima=distanciaActual;
                masCercano = cell;
            }
        }
        return masCercano;
    }
}
