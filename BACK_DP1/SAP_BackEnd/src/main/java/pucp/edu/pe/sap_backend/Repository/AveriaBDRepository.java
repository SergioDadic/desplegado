package pucp.edu.pe.sap_backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pucp.edu.pe.sap_backend.ClasesBD.AveriaBD;

import java.util.List;

public interface AveriaBDRepository extends JpaRepository<AveriaBD,Integer> {

    AveriaBD findTopByOrderByIdDesc();
}
