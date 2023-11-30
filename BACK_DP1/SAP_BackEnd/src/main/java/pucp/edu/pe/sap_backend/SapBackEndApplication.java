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

//        LocalDateTime dateTime = LocalDateTime.of(2024, 4, 1, 0, 1);
////        LinkedList<Pedido> listaPedidos = LecturaDatos.lecturaDecliente(LocalDateTime.now(),1);
//        LinkedList<Pedido> listaPedidos = LecturaDatos.lecturaDecliente(dateTime,7);
//
//        Collections.sort(listaPedidos);
//
//        for (Pedido ped: listaPedidos){
//            System.out.println(ped.getPedidoDate()+"   " + ped.getLimitDate());
//        }
//
//
//        ArrayList<Vehiculo> listaVehiculos = new ArrayList<>();
//        //CREACIÓN DE VEHICULOS
//        //TIPO A
//        for (int i=0;i<2;i++){
//            Vehiculo vehiculo = new Vehiculo(i,50,12,8,2.5,25.0,12.5,15.0,"TA");
//            listaVehiculos.add(vehiculo);
//        }
//        //TIPO B
//        for (int i=0;i<4;i++){
//            Vehiculo vehiculo = new Vehiculo(i,50,12,8,2.0,15.0,7.5,9.5,"TB");
//            listaVehiculos.add(vehiculo);
//        }
//        //TIPO C
//        for (int i=0;i<4;i++){
//            Vehiculo vehiculo = new Vehiculo(i,50,12,8,1.5,10.0,5.0,6.5,"TC");
//            listaVehiculos.add(vehiculo);
//        }
//        //TIPO D
//        for (int i=0;i<10;i++){
//            Vehiculo vehiculo = new Vehiculo(i,50,12,8,1.0,5.0,2.5,3.5,"TD");
//            listaVehiculos.add(vehiculo);
//        }
//
//        //ESTANDAR BASICO
//        Genetico genetico = new Genetico(LocalDateTime.now(),listaVehiculos, new ArrayList<Almacen>());
//
////        genetico.setCars(listaVehiculos);
////        genetico.setOrders(listaPedidos);
//
////      SIN BLOQUEOS
////        BFS blocks = new BFS(new BlockMap(100,100));
////
////        genetico.setBlocks(blocks);
//
//        //CON BLOQUEOS
//        BlockMap map = new BlockMap(100,100);
//
//        //bloquear  un camino
//        map.getMap()[3][0] = new Blocknode();
//        //map.getMap()[3][0].setBloqueado(false);
//        map.getMap()[4][0] = new Blocknode();
//        //map.getMap()[4][0].setBloqueado(false);
//        map.getMap()[5][0] = new Blocknode();
//        //map.getMap()[5][0].setBloqueado(false);
//
//        genetico.setBlocks(new BFS(map));
////
////        genetico.setCars(listaVehiculos);
////        genetico.setOrders(listaPedidos);
////        genetico.executeAlgorithm();
//
////        genetico.executeAlgorithm();

        SpringApplication.run(SapBackEndApplication.class, args);
    }
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedOrigins("*").allowedMethods("GET", "POST","PUT", "DELETE");
            }
        };
    }





}






