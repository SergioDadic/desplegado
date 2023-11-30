package pucp.edu.pe.sap_backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pucp.edu.pe.sap_backend.ClasesBD.BloqueosBD;

import java.time.LocalDateTime;
import java.util.List;

public interface BloqueoBDRepository extends JpaRepository<BloqueosBD,Integer> {
    List<BloqueosBD> findAllByInicioBloqueoIsBetween(LocalDateTime fechaInicioSimulacion, LocalDateTime fechaFinSimulacion);
}
