package pucp.edu.pe.sap_backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import pucp.edu.pe.sap_backend.ClasesBD.PedidoBD;
import pucp.edu.pe.sap_backend.Genetico.Almacen;
import pucp.edu.pe.sap_backend.Genetico.Genetico;
import pucp.edu.pe.sap_backend.Genetico.Pedido;
import pucp.edu.pe.sap_backend.Genetico.Vehiculo;
import pucp.edu.pe.sap_backend.LecturaDatos.LecturaDatos;
import pucp.edu.pe.sap_backend.Repository.PedidoBDRepository;
import pucp.edu.pe.sap_backend.Ruta.BFS;
import pucp.edu.pe.sap_backend.Ruta.BlockMap;
import pucp.edu.pe.sap_backend.Ruta.Blocknode;
import pucp.edu.pe.sap_backend.Service.PedidoBDService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

@SpringBootApplication
public class SapBackEndApplication {

    public static void main(String[] args) {
        SpringApplication.run(SapBackEndApplication.class, args);
    }
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*") // Replace with the allowed origins
                        .allowedMethods("GET", "POST", "PUT", "DELETE");
            }
        };
    }





}






