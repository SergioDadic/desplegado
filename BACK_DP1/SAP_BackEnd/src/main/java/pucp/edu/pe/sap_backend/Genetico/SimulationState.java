package pucp.edu.pe.sap_backend.Genetico;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
@Getter
@Setter
public class SimulationState {
    private ArrayList<Vehiculo> vehiculo;
    private LocalDateTime currentTime;
    private LinkedList<Pedido> totalOrders;
}
