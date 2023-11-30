package pucp.edu.pe.sap_backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.relational.core.sql.In;
import pucp.edu.pe.sap_backend.ClasesBD.VehiculoBD;

public interface VehiculoBDRepository extends JpaRepository<VehiculoBD, Integer> {
}
