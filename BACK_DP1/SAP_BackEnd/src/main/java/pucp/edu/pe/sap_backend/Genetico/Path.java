package pucp.edu.pe.sap_backend.Genetico;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.Random;

import pucp.edu.pe.sap_backend.Ruta.BFS;
import pucp.edu.pe.sap_backend.Ruta.Cell;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@ToString
@EqualsAndHashCode
public class Path implements Comparable {
    private Pedido [] path;
    private int numOrders;
    private double cost;
    private int fitness;
    private BFS blocks;
    private LinkedList<Cell> route;

    public Path(int numOrders, BFS blocks,int almacenX, int almacenY) {
        this.numOrders = numOrders;
        this.blocks = blocks;
        CreatePath();
        cost =0;
        this.route = new LinkedList<>();
        calculateCost(almacenX,almacenY);
        fitness =0;
    }

    public Path(int numOrders, Vehiculo car, Pedido node, LocalDateTime currentTime, BFS blocks,int almacenX, int almacenY) {
        this.numOrders = numOrders;
        CreatePath(car, node);
        //OrderDate is currentTime for the car
        this.path[0].setPedidoDate(currentTime);
        this.blocks = blocks;
        cost =0;
        this.route = new LinkedList<>();
        calculateCost(almacenX,almacenY);
        fitness =0;
    }

    public void calculateCost(int almacenX, int almacenY){
        cost=0;
        //first node is car cost
        int actualStock = path[0].getAmount();
        int nodeOrders;
        int minutes = 0;
        //For car, getOrderDate has currentTime
        LocalDateTime currentTime = path[0].getPedidoDate();
        LocalDateTime estimatedTime;
        LinkedList<Cell> auxPath;
        //For car, maxHours contains type
        int speed=path[0].getMaxHours()*30;
        int i=0;
        Cell auxCell = null;
        while(i<numOrders-1){
            //cost+=path[i].distance(path[i+1].getX(),path[i+1].getY());
            //Old way for distance
            //minutes += path[i].distance(path[i+1].getX(),path[i+1].getY())/speed*60;
            //New way of calculate
            int[] start = {path[i].getX(),path[i].getY()};
            int[] end = {path[i+1].getX(),path[i+1].getY()};

            auxPath =   blocks.shortestPath(start, end, currentTime,path[0].getMaxHours(),auxCell);

            if(speed == 0 || auxPath == null){
                cost += 10000;
                i++;
                break;
            }
            Cell auxgetLast = auxPath.getLast();
            minutes = (auxgetLast.dist * 60) / speed;
            //int timeLeft = path[i+1].getHhmm()/100*60 + path[i+1].getHhmm()%100+path[i+1].getMaxHours()*60-currentTime;
            estimatedTime = currentTime.plusMinutes(minutes);
            nodeOrders = path[i+1].getAmount();
//           if(carCapacity < nodeOrders && carCapacity <= 0){
            if(estimatedTime.isAfter(path[i+1].getLimitDate())){
                cost += 10000;
                i++;
                break;
            }
            cost+=auxgetLast.dist;
            //Anhadido
            auxPath.removeFirst();
            //Modificado
            if(path[i+1].getAssigned()!=1){
                if(actualStock <= 0){
                    cost += 10000;
                    this.route.clear();
                    break;
                }
                actualStock = actualStock - nodeOrders;
            }

            if(auxgetLast.blocked){
                auxgetLast.prev.prev=null;
                auxCell=auxgetLast.prev;
            }else{ auxCell=null;}
            currentTime = estimatedTime;
            //Anhadido
            this.route.addAll(auxPath);
            i++;
        }
        int auxstart[]={path[i].getX(),path[i].getY()};
        int auxEnd[]={almacenX,almacenY};
        auxPath = blocks.shortestPath(auxstart, auxEnd, currentTime,path[0].getMaxHours(),auxCell);
        if(auxPath == null){
            cost+=10000;
            //Anhadido
            this.route.clear();
        }else{
            cost+=auxPath.getLast().dist;
            //Anhadido
            auxPath.removeFirst();
            this.route.addAll(auxPath);
        }
        //cost+=path[path.length-1].distance(path[0].getX(), path[0].getY());
    }

    public int getFitness() {
        return fitness;
    }

    public void setFitness(int fitness) {
        this.fitness = fitness;
    }
    public double getCost() {
        return cost;
    }

    public void setCost(double distance) {
        this.cost = distance;
    }
    /* Overload compareTo method */
    @Override
    public int compareTo(Object obj){
        Path tmp = (Path) obj;
        if(this.cost < tmp.cost){
            return 1;
        }
        else if(this.cost > tmp.cost){
            return -1;
        }
        else{
            return 0;
        }
    }
    public void CreatePath(){
        path= new Pedido[numOrders];
        for (int i = 0; i < path.length; i++) {
            path[i]=new Pedido(i,i,RandomNum(0, 70),RandomNum(0, 50),0,2000,101,0,0,"aaaaa");
        }
    }

    public void CreatePath(Vehiculo base, Pedido[] nodes){
        path= new Pedido[numOrders];
        path[0] = new Pedido(base.getId(),base.getId(),base.getX(),base.getY(),base.getStock(),0,0,0,0,"aaaaa");
        for (int i = 1; i < path.length; i++) {
            path[i]=new Pedido(nodes[i-1]);
        }
    }

    public void CreatePath(Vehiculo base, Pedido node){
        int i;
        path= new Pedido[numOrders];
        //First city is car node
        path[0] = new Pedido(base.getId(),base.getId(),base.getX(),base.getY(),base.getStock(),node.getYYYY(),node.getMMDD(),node.getHhmm(),base.getType(),node.getNombrePedido());
        for (i = 1; i < base.getOrder().size()+ 1; i++) {
            path[i]=new Pedido(base.getOrder().get(i-1));
        }
        path[i]= new Pedido(node);
    }

    public int RandomNum(int min, int max){
        return min+ (new Random()).nextInt(max-min);
    }

    public Pedido[] getPath() {
        return path;
    }

    public void setPath(Pedido[] path,int almacenX,int almacenY) {
        this.path = path;
        calculateCost(almacenX,almacenY);
    }

    public int getNumOrders() {
        return numOrders;
    }

    public void setNumOrders(int numOrders) {
        this.numOrders = numOrders;
    }

    public LinkedList<Cell> getRoute() {
        return route;
    }

    public void setRoute(LinkedList<Cell> route) {
        this.route = route;
    }

}