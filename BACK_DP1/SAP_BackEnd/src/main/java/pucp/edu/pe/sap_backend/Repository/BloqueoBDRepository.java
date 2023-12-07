package pucp.edu.pe.sap_backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pucp.edu.pe.sap_backend.ClasesBD.BloqueosBD;

import java.time.LocalDateTime;
import java.util.List;

public interface BloqueoBDRepository extends JpaRepository<BloqueosBD,Integer> {
    List<BloqueosBD> findAllByInicioBloqueoIsBetween(LocalDateTime fechaInicioSimulacion, LocalDateTime fechaFinSimulacion);


    @Query(value = "SELECT * FROM bloqueo b WHERE " +
            "(b.tiempo_inicio_bloqueo BETWEEN :fechaInicio AND :fechaFin) OR " +
            "(b.tiempo_fin_bloqueo BETWEEN :fechaInicio AND :fechaFin) OR " +
            "(b.tiempo_inicio_bloqueo < :fechaInicio AND ADDTIME(b.tiempo_fin_bloqueo, '00:18:00') > :fechaInicio) OR " +
            "(ADDTIME(b.tiempo_inicio_bloqueo, '00:18:00') < :fechaFin AND b.tiempo_fin_bloqueo > :fechaFin)",
            nativeQuery = true)
    List<BloqueosBD> findAllByIntervalo(@Param("fechaInicio") LocalDateTime fechaInicio, @Param("fechaFin") LocalDateTime fechaFin);
}