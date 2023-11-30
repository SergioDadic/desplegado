package pucp.edu.pe.sap_backend.Genetico;

import lombok.*;
import pucp.edu.pe.sap_backend.Ruta.BFS;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedList;

@ToString
@EqualsAndHashCode
@NoArgsConstructor
@Getter
@Setter
public class GeneticAlgorithmState {
    //PEDIDOS
    private LinkedList<Pedido> orders;
    private LinkedList<Pedido> totalOrders;
    //BLOQUEOS
    private BFS blocks;
    //VEHICULOS
    private ArrayList<Vehiculo> cars;

    //TIEMPO
    private LocalDateTime currentTime;
    private LocalDateTime stopTime;

    private int duracion;
    //ALMACEN -> SE MOVERA ACTUALIZARÁ DESPUES

    //private int almacenX;
    //private int almacenY;

    //Almacenes
    private ArrayList<Almacen>almacenes;

    private int autos;
    //Tipo de ejecucion: 1, dia a dia. 6, simulacion semanal, 12, simulacion colapso
    private int limit;

    //private PedidoRepository pedidoService;
    private int turnoAnt;

    private ArrayList<Genetico> geneticoStates = new ArrayList<>();

    public void addState(){
        Genetico genetico = new Genetico(this.currentTime,this.cars,this.almacenes);
        genetico.setOrders(this.getOrders());
        genetico.setTotalOrders(this.totalOrders);
        genetico.setBlocks(this.getBlocks());
        genetico.setCars(this.getCars());
        genetico.setCurrentTime(this.getCurrentTime());
        genetico.setStopTime(this.getStopTime());
        genetico.setDuracion(this.getDuracion());
        genetico.setLimit(this.getLimit());
        geneticoStates.add(genetico);
    }


}
