package pucp.edu.pe.sap_backend.Genetico;

import org.springframework.util.RouteMatcher;
import pucp.edu.pe.sap_backend.ClasesBD.AveriaBD;
import pucp.edu.pe.sap_backend.Ruta.BFS;
import pucp.edu.pe.sap_backend.Ruta.Cell;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.*;


//@AllArgsConstructor
//@NoArgsConstructor
@Getter
@Setter
public class Vehiculo {
    private int id;

    private int numberOrders;

    private int stock;

    private int physicStock;

    private int capacity;

    private int type;

    private int lastMovement;

    private int x;

    private int y;

    private String placa;

    private String conductor;

    private String velocidad;

    private String kilometraje;

    private String estado;

    private int primeraRuta;
    //CantEstatico es la cantidad de movimientos para que se averie el vehiculo

    private int cantAveria;
    //movEstatico es la cantidad de movimientos que se mantiene en un mismo punto

    private int movEstatico;

    private int movReaundar;
    //Turnos que permanece averiado
    private int turnoAveriado;

    private int xInicial;

    private int yInicial;

    //PARA VERIFICAR DESPUES EN QUE LUGAR ME ENCUENTRO
    private int sector;

    private double tara;
    private double cargaGLP;
    private double pesoCargaGLP;
    private double pesoCombinado;
    private String tipo;

    // @Transient ES PARA QUE NO SE GUARDE EN LA BD - FALTA CONVERSAR ESTO
    private LinkedList<Pedido> order;

    private LinkedList<Pedido> totalOrders;

    private LinkedList<Cell> route;

    private LinkedList<Cell> firstRoute;

    private LinkedList<Cell> movement;

    private LinkedList<Pedido> deliveredOrder;
    private int lastIndexRoute ;

    private AveriaBD averiaAsignada;

    private int estaAveriado = 1;

    public Vehiculo(int id, int type, int x, int y,double tara, double cargaGLP,double pesoCargaGLP,double pesoCombinado, String tipo) {
        this.id = id;
        this.capacity = (int) cargaGLP;
        this.stock = capacity;
        this.physicStock = capacity;
        this.type = 1;
        this.x = x;
        this.y = y;
        this.xInicial = x;
        this.yInicial = y;
        this.numberOrders = 0;
        this.lastMovement = 0;
        this.order = new LinkedList<>();
        this.totalOrders = new LinkedList<>();
        this.route = new LinkedList<>();
        this.movement = new LinkedList<>();
        this.deliveredOrder = new LinkedList<>();
        this.firstRoute = new LinkedList<>();
        this.primeraRuta = 0;
        this.movEstatico = -1;
        this.turnoAveriado = 0;
        this.estado = "Disponible";
        this.tara = tara;
        this.cargaGLP = cargaGLP;
        this.pesoCargaGLP = pesoCargaGLP;
        this.pesoCombinado = pesoCombinado;
        this.tipo = tipo;
        this.lastIndexRoute = 0;
    }

    public Vehiculo(LinkedList<Pedido> order, int numberOrders, int id) {
        this.order = order;
        this.numberOrders = numberOrders;
        this.id = id;
        this.totalOrders = new LinkedList<>();
        this.deliveredOrder = new LinkedList<>();
        this.route = new LinkedList<>();
        this.movement = new LinkedList<>();
        this.firstRoute = new LinkedList<>();
    }

    public Vehiculo() {

    }

    public LinkedList<Pedido> getOrder() {
        return order;
    }

    public void setOrder(LinkedList<Pedido> order) {
        this.order = order;
    }
    public LinkedList<Pedido> getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(LinkedList<Pedido> totalOrders) {
        this.totalOrders = totalOrders;
    }

    public LinkedList<Cell> getRoute() {
        return route;
    }

    public void setRoute(LinkedList<Cell> route) {
        if(route == null) {
            this.route.clear();
            return;
        }
        this.route = route;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LinkedList<Pedido> getDeliveredOrder() {return deliveredOrder;}

    public void setDeliveredOrder(LinkedList<Pedido> deliveredOrder) {this.deliveredOrder = deliveredOrder;}

    public LinkedList<Cell> getFirstRoute() {return firstRoute;}

    public void setFirstRoute(LinkedList<Cell> firstRoute) {this.firstRoute = firstRoute;}

    public LinkedList<Cell> getMovement() {
        return movement;
    }

    public void setMovement(LinkedList<Cell> movement) {
        this.movement = movement;
    }

    public int getPrimeraRuta() {return primeraRuta;}

    public void setPrimeraRuta(int primeraRuta) {this.primeraRuta = primeraRuta;}

    public int getCantAveria() {return cantAveria;}

    public void setCantAveria(int cantAveria) {this.cantAveria = cantAveria;}

    public void newOrder (Pedido[] route, int amountNew,int idNewOrder){
        this.order.clear();
        //this.order = new Order[numberOrders];
        for(int i = 1; i < route.length; i++){
            this.order.add(new Pedido(route[i].getIdPedido(),route[i].getId(),route[i].getX(),route[i].getY(),route[i].getAmount(),
                    route[i].getYYYY(),route[i].getMMDD(),route[i].getHhmm(),route[i].getMaxHours(),route[i].getNombrePedido() ));
            if(this.order.get(i-1).getIdPedido()== idNewOrder ) this.order.get(i-1).setAmount(amountNew);
            idNewOrder = -1;
            this.order.get(i-1).setAssigned(1);
        }
    }


    public double distance(double xOther,double yOther){
        return Math.sqrt(((this.x-xOther)*(this.x-xOther)))+ Math.sqrt(((this.y-yOther)*(this.y-yOther)));
    }

    public void generateRoute(LocalDateTime currentTime, BFS blocks, int almX, int almY) {
        int[] auxstart={this.x,this.y};
        //Almacen
        int almacenX = almX;
        int almacenY = almY;
        int[] auxEnd={almacenX,almacenY};
        int minutes = 0;
        this.route.clear();
        LinkedList<Cell> auxPath;
//        int speed=this.type*50;
        int speed = 50;
        Cell auxCell = null;

//

        Iterator<Pedido> orderIteraor = this.order.iterator();
        while(orderIteraor.hasNext()){
            Pedido order = orderIteraor.next();
            auxEnd[0]=order.getX();auxEnd[1]=order.getY();
            if(auxstart[0]==auxEnd[0] && auxstart[1]==auxEnd[1]) continue; //VERIFICO QUE NO SE VAYA AL MISMO PUNTO

            auxPath = blocks.shortestPath(auxstart, auxEnd, currentTime,this.type,auxCell);

            if(auxPath==null){
                orderIteraor.remove();
                continue;
            }
            minutes = auxPath.getLast().dist*60/speed;
            currentTime = currentTime.plusMinutes(minutes);
            auxPath.remove();
            this.route.addAll(auxPath);
            auxstart[0]=order.getX();
            auxstart[1]=order.getY();
            if(!auxPath.isEmpty() && auxPath.getLast().blocked){
                auxPath.getLast().prev.prev=null;
                auxCell=auxPath.getLast().prev;
            }else{ auxCell=null;}

        }
        auxEnd[0]=almacenX;auxEnd[1]=almacenY;
        auxPath = blocks.shortestPath(auxstart, auxEnd, currentTime,this.type,null);
        if(auxPath== null){
            System.out.println("aaa");
        }
        auxPath.remove();
        this.route.addAll(auxPath);

//        for(Pedido order: this.order){
//            auxEnd[0]=order.getX();auxEnd[1]=order.getY();
//            if(auxstart[0]==auxEnd[0] && auxstart[1]==auxEnd[1]) continue; //VERIFICO QUE NO SE VAYA AL MISMO PUNTO
//
//            auxPath = blocks.shortestPath(auxstart, auxEnd, currentTime,this.type,auxCell);
//
//            if(auxPath==null){
//                //auxPath = blocks.shortestPath(auxstart, auxEnd, currentTime,this.type,auxCell);
//                //(AQUI)
//                System.out.println("aaa");
//            }
//            minutes = auxPath.getLast().dist*60/speed;
//            currentTime = currentTime.plusMinutes(minutes);
//            auxPath.remove();
//            this.route.addAll(auxPath);
//            auxstart[0]=order.getX();
//            auxstart[1]=order.getY();
//            if(!auxPath.isEmpty() && auxPath.getLast().blocked){
//                auxPath.getLast().prev.prev=null;
//                auxCell=auxPath.getLast().prev;
//            }else{ auxCell=null;}
//        }
//        auxEnd[0]=almacenX;auxEnd[1]=almacenY;
//        auxPath = blocks.shortestPath(auxstart, auxEnd, currentTime,this.type,null);
//        auxPath.remove();
//        this.route.addAll(auxPath);
    }
    public void addOrder(Pedido order) {
        //this.totalOrders.add(order);

        ///NUEVO
        order.setAssigned(1);
        this.order.add(order);
        //
        this.lastMovement = order.getHhmm();
    }

    public void addRoute(LinkedList<Cell> route) {
        this.route.clear();
        for (Cell c:route){
            c.prev=null;
        }
        this.route = route;
    }

    public double remainingCapacity(){
        return physicStock - order.stream().mapToDouble(order -> order.getAmount()).sum();
    }

    public void imprimirUltimaRuta(){
        for (Cell cell : movement) {
            //System.out.print("(X=" + cell.getX() + " , Y=" + cell.getY()+ " ) ;");
            System.out.print("(" +cell.getX() + ", " + cell.getY()+ ") ; ");
        }
        System.out.println();

    }

    public String generarPlaca(){
        Random numRandom = new Random();
        String cadenaA = "";
        String cadenaN = "";

        for(int i = 0; i < 3 ;i++) {
                int k = numRandom.nextInt(90 - 65 + 1) + 65;
                cadenaA = cadenaA + Character.toString((char) k);

        }
        numRandom = new Random();
        Integer n = numRandom.nextInt(249)+700;
        cadenaN = cadenaN + n.toString();


        return cadenaA+cadenaN;
    }
    public void AsignarDistanciasCorrectasAlRecorrido(){
        int historico=1;
        if(!this.route.isEmpty()){
            LinkedList<Cell> AAAA = new LinkedList<>();
            for (Cell cel:this.route){
                Cell cell = new Cell(cel.getX(), cel.getY(),historico,null,cel.tiempoActual);
                AAAA.add(cell);
                historico++;
            }

            this.route=AAAA;

        }



    }

    public int SumaDePedidosRequerido(){
        int suma=0;
        for (Pedido pedido : this.order){
            suma+=pedido.getAmount();
        }
        return suma;
    }


//    public int sumaDeLiquidoAEntregar(){
//        for ()
//
//        return ;
//    }

}
