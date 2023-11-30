package pucp.edu.pe.sap_backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pucp.edu.pe.sap_backend.ClasesBD.PedidoBD;
import pucp.edu.pe.sap_backend.ClasesBD.PedidosDiarioBD;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PedidoBDRepository extends JpaRepository<PedidoBD, Integer> {

//    List<PedidoBD> findAllByFechaRecibidaBetween(LocalDateTime FechaInicio, LocalDateTime FechaFin);
    List<PedidoBD> findAllByFechaRecibidaIsBetween(LocalDateTime FechaInicio,LocalDateTime FechaFin);


}
