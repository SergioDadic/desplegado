package pucp.edu.pe.sap_backend.Genetico;

import lombok.Setter;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sap_backend.ClasesBD.AveriaBD;
import pucp.edu.pe.sap_backend.Ruta.BFS;
import pucp.edu.pe.sap_backend.Ruta.Cell;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@ToString
@EqualsAndHashCode
public class Genetico{

    //PEDIDOS
    private LinkedList<Pedido> orders;
    private LinkedList<Pedido> totalOrders;
    //BLOQUEOS
    private BFS blocks;
    //VEHICULOS
    private ArrayList<Vehiculo> cars;
    private LinkedList<AveriaBD> totalAveriasBD;
    private LinkedList<AveriaBD> averiasBD;
    private LinkedList<AveriaBD> averiaBDIngresadas;
    //TIEMPO
    private LocalDateTime currentTime;
    private LocalDateTime stopTime;

    private int duracion;
    //Almacenes con posiciones
    private int autos;
    //Tipo de ejecucion: 1, dia a dia. 6, simulacion semanal, 12, simulacion colapso
    private int limit;

    //private PedidoRepository pedidoService;
    private int turnoAnt;
    private ArrayList<Almacen>almacenes;




    public Genetico(LocalDateTime currentTime ,ArrayList<Vehiculo> listaAutos, ArrayList<Almacen> listaAlmacenes) {
        //Por ahora nada mas
        this.cars = new ArrayList<>();

        for(Vehiculo vehiculo:listaAutos){
            this.cars.add(vehiculo);
        }

        this.currentTime  = currentTime;



        this.autos = autos;
        this.totalOrders = new LinkedList<>();
        this.orders = new LinkedList<>();
        this.limit = 1;
        this.turnoAnt = -1;
        this.almacenes = listaAlmacenes;
        this.duracion= 0;

    }

//    public Genetico(LocalDateTime currentTime, Integer autos, Integer motos, int limit, Integer almacenX, Integer almacenY) {
//        this.cars = new ArrayList<>();
//
//
//        for(int i = 1; i<autos+1;i++){
//            this.cars.add(new Vehiculo(i, 25, 1, almacenX, almacenY));
//        }
//        this.autos = autos;
//        this.limit = limit;
//        this.currentTime  = currentTime;
//        this.totalOrders = new LinkedList<>();
//        this.orders = new LinkedList<>();
//        this.turnoAnt = -1;
//        this.almacenX = almacenX;
//        this.almacenY = almacenY;
//        this.duracion =0;
//    }

    public LinkedList<Pedido> getOrders() {
        return orders;
    }

    public void setOrders(LinkedList<Pedido> orders) {
        this.orders = orders;
    }

    public LinkedList<Pedido> getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(LinkedList<Pedido> totalOrders) {
        this.totalOrders = totalOrders;
    }

    public BFS getBlocks() {
        return blocks;
    }

    public void setBlocks(BFS blocks) {
        this.blocks = blocks;
    }

    public ArrayList<Vehiculo> getCars() {
        return cars;
    }

    public void setCars(ArrayList<Vehiculo> cars) {
        this.cars = cars;
    }

    public LocalDateTime getCurrentTime() {
        return currentTime;
    }

    public void setCurrentTime(LocalDateTime currentTime) {
        this.currentTime = currentTime;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public LocalDateTime getStopTime() {
        return stopTime;
    }

    public void setStopTime(LocalDateTime stopTime) {
        this.stopTime = stopTime;
    }

    public int getDuracion() {return duracion;}

    public void setDuracion(int duracion) {this.duracion = duracion;}

    public LinkedList<AveriaBD> getTotalAveriasBD() {
        return totalAveriasBD;
    }

    public void setTotalAveriasBD(LinkedList<AveriaBD> totalAveriasBD) {
        this.totalAveriasBD = totalAveriasBD;
    }

    public LinkedList<AveriaBD> getAveriasBD() {
        return averiasBD;
    }

    public void setAveriasBD(LinkedList<AveriaBD> averiasBD) {
        this.averiasBD = averiasBD;
    }

    public LinkedList<AveriaBD> getAveriaBDIngresadas() {
        return averiaBDIngresadas;
    }

    public void setAveriaBDIngresadas(LinkedList<AveriaBD> averiaBDIngresadas) {
        this.averiaBDIngresadas = averiaBDIngresadas;
    }

    public int getAutos() {
        return autos;
    }

    public void setAutos(int autos) {
        this.autos = autos;
    }

    public int getTurnoAnt() {
        return turnoAnt;
    }

    public void setTurnoAnt(int turnoAnt) {
        this.turnoAnt = turnoAnt;
    }

    public ArrayList<Almacen> getAlmacenes() {
        return almacenes;
    }

    public void setAlmacenes(ArrayList<Almacen> almacenes) {
        this.almacenes = almacenes;
    }

    public void executeAlgorithm(int minutos) {
        LocalDateTime startTime= this.currentTime;
        int horaStart = startTime.getHour();
        int auxTurno;
        if (horaStart >= 16 && horaStart < 24) auxTurno = 3;
        else if (horaStart >= 0 && horaStart < 8) auxTurno = 1;
        else auxTurno = 2;


        for(Vehiculo car:this.cars){
            car.setXInicial(car.getX());
            car.setYInicial(car.getY());
            car.getMovement().clear();
            car.getTotalOrders().addAll(car.getDeliveredOrder());
            if(this.limit == 1) {
                for (Pedido ped : car.getDeliveredOrder()) {
                    ped.setEstado("Entregado");
                }
                //pedidoService.saveAll(car.getDeliveredOrder());
            }
            car.getDeliveredOrder().clear();
            if(this.turnoAnt != auxTurno){
                car.setTurnoAveriado(car.getTurnoAveriado()-1);
                if(car.getTurnoAveriado()==0) car.setEstado("Disponible");
                if("Reparado".equals(car.getEstado())) car.setEstado("Disponible");
                car.setPrimeraRuta(car.getRoute().size());
            }
            if("Disponible".equals(car.getEstado()))car.setMovEstatico(-1);
        }
        if(this.turnoAnt != auxTurno && this.limit !=1) {
            for(Iterator<AveriaBD> iter = this.averiasBD.iterator(); iter.hasNext();) {
                AveriaBD data = iter.next();
                if (data.getAveriaCalculada() == 0) {
                    iter.remove();
                }
            }
            for (AveriaBD averia : this.totalAveriasBD) {
                if (auxTurno == averia.getTurno_averia()) {
                    this.averiasBD.add(averia);
                }
            }
        }
        if(this.limit != 1){
            if (!this.currentTime.isBefore(this.stopTime)){
                return;
            }
            averiarVehiculosIngresados();
        }

        this.turnoAnt = auxTurno;
        for(int i=0;i<limit; i++,currentTime = currentTime.plusMinutes(minutos)){
            while(!totalOrders.isEmpty()){
                //Each control will be every ten minutes
                if(currentTime.isAfter(totalOrders.get(0).getPedidoDate())){
                    orders.add(totalOrders.get(0));
                    totalOrders.remove(0);
                }else{
                    break;
                }
            }


            //Sort orders by limitTime
            Collections.sort(orders);


            //Control if some order cannot be delivered
            for(Pedido order: orders){
                if(order.getLimitDate().isBefore(currentTime)){
                    System.out.println("El pedido numero "+order.getIdPedido()+" no puede ser entregado a tiempo: Tiempo maximo: "+ order.getLimitDate()+" Tiempo actual: "+ this.currentTime);
                    this.limit = -1;
                    return;
                }
            }
            //PLAN DE REPLANIFICACION
            //1 saco pedidos de vehiculos qe tengo
            //2 verifico si mi lista de pedidos que estan en waiting hay uno con 4h para entregar con prioridad
            //3 en la funcion de replanificar se saca pedidos de los autos
            // de los pedidos de los vehiculos en los entregados les pongo lo siguiente

            List<Pedido> auxPedidos = new ArrayList<>();
            List<Pedido> auxPedidosEspera = new ArrayList<>();



            //auxPedidos= obtenerListaPedidosDeVehiculosDeGenetico();
            auxPedidosEspera= this.getOrders();
            //Algoritmo seleccionado
            if(!orders.isEmpty()){

                if(PuedeEntrarPedido(cars)){ // para que replanifique cuando no encuentre espacio y no en todo momento
                    //REPLANIFICA CON LOS PEDIDOS QUE
                    if(replanificar(currentTime)){
                        //BUSCAR PEDIDOS ENTREGADOS de la lista de pedidos de vehiculos
                        for (Pedido ped: auxPedidos){
                            if(ped.getEstado()=="Entregado"){
                                ped.setAmount(ped.getAmount()-ped.getAssigned());
                                ped.setAssigned(0);
                            }
                        }
                        this.getOrders().clear();
                        //this.getOrders().addAll(auxPedidos);
                        this.getOrders().addAll(auxPedidosEspera);
                        //BUSCAR PEDIDOS EN VEHICULOS EN PROCESO osea los otros que no están pendientes
                        Collections.sort(orders);

                    }
                }



                genetic_algorithm(orders, this.cars, currentTime,blocks);
            }
            //Time actualization
            updatePosition(this.cars,currentTime,blocks);
        }
        if(this.limit != 1)calcularAverias(this.cars.size(),auxTurno);
    }

    private void averiarVehiculosIngresados() {
        int tiempo_horas;
        for (AveriaBD aux : this.averiaBDIngresadas) {
            Vehiculo auxVehiculo = this.cars.get(aux.getId_vehiculo() - 1);
            if("Averiado".equals(auxVehiculo.getEstado()) || "Reparado".equals(auxVehiculo.getEstado())) continue;
            auxVehiculo.setX(aux.getCoord_x());
            auxVehiculo.setY(aux.getCoord_y());
            auxVehiculo.setEstado("Averiado");
            int auxTipo = auxVehiculo.getType();
            if (aux.getTipo_averia() == 1) {
                auxVehiculo.setTurnoAveriado(0);
            } else if (aux.getTipo_averia() == 2) {
                auxVehiculo.setTurnoAveriado(2);
            } else {
                auxVehiculo.setTurnoAveriado(6);
            }
            if (this.turnoAnt != aux.getTurno_averia())
                auxVehiculo.setTurnoAveriado(auxVehiculo.getTurnoAveriado() - 1);

            LocalDateTime auxTime = aux.getFecha().withSecond(0);
            if(auxTipo == 1 && auxTime.getMinute()%2 == 1){
                auxTime = auxTime.minusMinutes(1);
            }
            long auxMovimientos = auxTime.until(this.currentTime, ChronoUnit.MINUTES);
            if(auxTipo == 1) auxMovimientos = auxMovimientos/2;
            System.out.println(auxTime + "     "+this.currentTime);
            System.out.println(auxMovimientos);
            tiempo_horas = (aux.getHoras_inmovilizado())*30;
            auxVehiculo.setMovReaundar((int) (tiempo_horas*auxTipo - auxMovimientos));
            if(this.getLimit() == 1){
                for (Cell c: auxVehiculo.getMovement()){
                    c.dist = -1;
                    c.x = aux.getCoord_x();
                    c.y = aux.getCoord_y();
                }
            }

            System.out.println(auxVehiculo.getMovReaundar());

            for (Pedido p: auxVehiculo.getOrder()){
                p.setAssigned(0);
            }

            this.orders.addAll(auxVehiculo.getOrder());
            auxVehiculo.getOrder().clear();

            while (!auxVehiculo.getTotalOrders().isEmpty()){
                Pedido p = auxVehiculo.getTotalOrders().getLast();
                if(p.getDeliverDate().isAfter(auxTime)){
                    p.setAssigned(0);
                    auxVehiculo.getTotalOrders().removeLast();
                    this.orders.add(p);
                }else break;
            }

            while (!auxVehiculo.getDeliveredOrder().isEmpty()){
                Pedido p = auxVehiculo.getDeliveredOrder().getLast();
                if(p.getDeliverDate().isAfter(auxTime)){
                    p.setAssigned(0);
                    auxVehiculo.getDeliveredOrder().removeLast();
                    this.orders.add(p);
                }else break;
            }
            auxVehiculo.getRoute().clear();

        }
        this.averiaBDIngresadas.clear();
    }

    //nunca usado
    public LinkedList<Pedido> dividirPedidos(LinkedList<Pedido> listaPedidos){
        LinkedList<Pedido> nuevosPedidos = new LinkedList<>();
        for( int i=0;i<listaPedidos.size();i++){
            Pedido pedidoActual = listaPedidos.get(i);
            while(pedidoActual.getAmount()>25){
                Pedido agregar = new Pedido(listaPedidos.get(i));
                agregar.setAmount(25);
                nuevosPedidos.add(agregar);
                pedidoActual.setAmount(pedidoActual.getAmount()-25);
            }
            if(pedidoActual.getAmount()>0.0){
                nuevosPedidos.add(pedidoActual);
            }

        }
        return nuevosPedidos;
    }

    private void calcularAverias(Integer size, Integer auxTurno) {
        int movAveria;
        int tiempo_horas;
        Vehiculo auxVehiculo;
        Random r = new Random();
        Iterator<AveriaBD> itr = this.averiasBD.iterator();
        while(itr.hasNext()){
            AveriaBD averia = itr.next();
            if(this.turnoAnt != averia.getTurno_averia()) continue;
            auxVehiculo = cars.get(averia.getId_vehiculo()-1);
            if(auxVehiculo.getPrimeraRuta() == 0) continue;
            if("Disponible".equals(auxVehiculo.getEstado())){
                int result = r.nextInt(35-5)+5;
                movAveria = result*auxVehiculo.getPrimeraRuta()/100;
                auxVehiculo.setCantAveria(movAveria);
                averia.setAveriaCalculada(1);
                if(this.limit*5*auxVehiculo.getType()-auxVehiculo.getMovEstatico() < auxVehiculo.getCantAveria()){
                    auxVehiculo.setCantAveria(auxVehiculo.getCantAveria() - (this.limit*5*auxVehiculo.getType()-auxVehiculo.getMovEstatico()));
                    auxVehiculo.setEstado("Por averiar");
                }else{
                    averia.setAveriaCalculada(0);
                    if(averia.getTipo_averia()==1){
                        auxVehiculo.setTurnoAveriado(0);
                    } else if (averia.getTipo_averia()==2) {
                        auxVehiculo.setTurnoAveriado(2);
                    }else{
                        auxVehiculo.setTurnoAveriado(6);
                    }

                    itr.remove();
                    auxVehiculo.getRoute().clear();

                    int auxPosicion = auxVehiculo.getMovEstatico()+auxVehiculo.getCantAveria();
                    if(auxVehiculo.getCantAveria() ==0) auxPosicion=1;
                    LinkedList<Cell> auxMov = auxVehiculo.getMovement();
                    Cell referencia = auxMov.get(auxPosicion-1);

                    for (Pedido p: auxVehiculo.getOrder()){
                        p.setAssigned(0);
                    }
                    this.orders.addAll(auxVehiculo.getOrder());
                    auxVehiculo.getOrder().clear();

                    for(int i = 0; i<referencia.dist ; i++){
                        auxVehiculo.getTotalOrders().add(auxVehiculo.getDeliveredOrder().removeFirst());
                    }
                    auxVehiculo.getDeliveredOrder().clear();

                    auxVehiculo.setStock(auxVehiculo.getPhysicStock());

                    referencia.dist=-1;
                    auxVehiculo.setX(referencia.x);
                    auxVehiculo.setY(referencia.y);
                    //long auxMovimientos = auxTime.until(this.currentTime, ChronoUnit.MINUTES);
                    //if(auxTipo == 1) auxMovimientos = auxMovimientos/2;
                    //System.out.println(auxTime + "     "+this.currentTime);
                    //System.out.println(auxMovimientos);
                    //tiempo_horas = (aux.getHoras_inmovilizado())*30;
                    //auxVehiculo.setMovReaundar((int) (tiempo_horas*auxTipo - auxMovimientos));
                    tiempo_horas = averia.getHoras_inmovilizado()*30;
                    auxVehiculo.setMovReaundar(tiempo_horas*auxVehiculo.getType()-this.limit*5*auxVehiculo.getType()+auxPosicion);
                    for(int i=auxPosicion;i<this.limit*5*auxVehiculo.getType();i++){
                        auxMov.set(i,referencia);
                    }
                    auxVehiculo.setEstado("Averiado");
                }
            } else if (auxVehiculo.getEstado() == "Por averiar" && averia.getAveriaCalculada()==1) {
                if(this.limit*5*auxVehiculo.getType()-auxVehiculo.getMovEstatico() < auxVehiculo.getCantAveria()){
                    auxVehiculo.setCantAveria(auxVehiculo.getCantAveria() - (this.limit*5*auxVehiculo.getType()-auxVehiculo.getMovEstatico()));
                    auxVehiculo.setEstado("Por averiar");
                }else{
                    averia.setAveriaCalculada(0);
                    if(averia.getTipo_averia()==1){
                        auxVehiculo.setTurnoAveriado(0);
                    } else if (averia.getTipo_averia()==2) {
                        auxVehiculo.setTurnoAveriado(2);
                    }else{
                        auxVehiculo.setTurnoAveriado(6);
                    }

                    itr.remove();

                    auxVehiculo.getRoute().clear();
                    int auxPosicion = auxVehiculo.getMovEstatico()+auxVehiculo.getCantAveria();
                    LinkedList<Cell> auxMov = auxVehiculo.getMovement();
                    Cell referencia = auxMov.get(auxPosicion-1);
                    for (Pedido p: auxVehiculo.getOrder()){
                        p.setAssigned(0);
                    }
                    this.orders.addAll(auxVehiculo.getOrder());
                    auxVehiculo.getOrder().clear();

                    for(int i = 0; i<referencia.dist ; i++){
                        auxVehiculo.getTotalOrders().add(auxVehiculo.getDeliveredOrder().removeFirst());
                    }
                    auxVehiculo.getDeliveredOrder().clear();

                    auxVehiculo.setStock(auxVehiculo.getPhysicStock());

                    auxVehiculo.setX(referencia.x);
                    auxVehiculo.setY(referencia.y);
                    tiempo_horas = averia.getHoras_inmovilizado()*30;
                    auxVehiculo.setMovReaundar(tiempo_horas*auxVehiculo.getType()-this.limit*5*auxVehiculo.getType()+auxPosicion);
                    //auxVehiculo.setMovReaundar(30*auxVehiculo.getType()+auxPosicion);
                    referencia.dist=-1;
                    for(int i=auxPosicion;i<this.limit*5*auxVehiculo.getType();i++){
                        auxMov.set(i,referencia);
                    }

                    auxVehiculo.setEstado("Averiado");
                }
            } else if (auxVehiculo.getEstado() == "Averiado") itr.remove();
        }
    }

    public boolean PuedeEntrarPedido(List<Vehiculo> list){
        int sum =0;

        for (Vehiculo vehiculo: list){
            sum+= vehiculo.getStock();
        }

        if(sum<=0) return true;
        else return false;
    }
    public void updatePosition(ArrayList<Vehiculo> cars, LocalDateTime currentTime, BFS blocks) {
        int auxX,auxY,i,auxTipo,almacenX,almacenY;
        int auxDist;
        LinkedList<Cell> auxRoute;
        LinkedList<Cell> auxRecorrido;
        LinkedList<Pedido> auxOrder;
        Pedido auxDO;
        for(Vehiculo car: cars){
            auxTipo= car.getType()== 1? 2 : 1;
            auxRoute = car.getRoute();
            auxOrder = car.getOrder();
            Cell masCercano = new Cell();
            Cell punto = new Cell(car.getX(), car.getY());
            List<Cell> puntos = List.of(new Cell(12,8),new Cell(42,42),new Cell(63,3));
            masCercano=masCercano.encontraPuntoMasCercano(punto,puntos);
            almacenX = masCercano.getX();
            almacenY = masCercano.getY();

            while(!auxOrder.isEmpty()){
                auxX=auxOrder.get(0).getX();
                auxY=auxOrder.get(0).getY();
                if(car.getX()==auxX && car.getY()==auxY){
                    auxOrder.get(0).setDeliverDate(currentTime);
                    car.getTotalOrders().add(new Pedido (auxOrder.get(0)));
                    car.setPhysicStock(car.getPhysicStock()-auxOrder.get(0).getAmount());
                    auxOrder.remove(0);
                }else{
                    break;
                }
            }
            i=0;
            while(i<15*car.getType()){
                //Before movement
                if(car.getEstado() == "Averiado"){
                    car.getMovement().add(new Cell(car.getX(),car.getY(),-1,null,currentTime));
                    i++;
                    car.setMovReaundar(car.getMovReaundar()-1);
                    if(car.getMovReaundar() == 0){
                        if(car.getTurnoAveriado()<=0){
                            car.getMovement().getLast().dist=0;
                            //OBTENER DISTANCIA AL ALMACEN MAS CERCANO


                            car.generateRoute(currentTime.plusMinutes(i*2/car.getType()),blocks,almacenX,almacenY);
                            car.setEstado("Reparado");
                        }else{
                            car.setX(almacenX);
                            car.setY(almacenY);
                        }
                    }
                    continue;
                }
                if(auxRoute.isEmpty()) {
                    auxDist = car.getMovement().isEmpty()? 0:car.getMovement().getLast().dist;
                    car.getMovement().add(new Cell(car.getX(),car.getY(),auxDist,null,currentTime));
                    i++;
                    continue;
                }
                //Check averia
                //Car moving
                car.setX(auxRoute.getFirst().x);
                car.setY(auxRoute.getFirst().y);
                if(car.getMovEstatico() == -1) car.setMovEstatico(car.getMovement().size());
                auxRoute.remove();
                i++;
                car.getMovement().add(new Cell(car.getX(),car.getY(),car.getMovement().size()==0? 0: car.getMovement().getLast().dist,null,currentTime));
                while(!auxOrder.isEmpty()){
                    auxX=auxOrder.get(0).getX();
                    auxY=auxOrder.get(0).getY();
                    if(car.getX()==auxX && car.getY()==auxY){
                        auxOrder.get(0).setDeliverDate(currentTime.plusMinutes(i*2/car.getType()));
                        car.setPhysicStock(car.getPhysicStock()-auxOrder.get(0).getAmount());
                        auxDO = auxOrder.remove(0);
                        auxDO.setAssigned(0);
                        car.getDeliveredOrder().add(auxDO);
                        car.getMovement().getLast().dist +=1;
                    }else{
                        break;
                    }
                }
                if(car.getX()==almacenX && car.getY()==almacenY){
                    car.setStock(car.getCapacity());
                    car.setPhysicStock(car.getCapacity());
                }
            }
        }
    }

    private void genetic_algorithm(LinkedList<Pedido> listaDePedidos, ArrayList<Vehiculo> cars,LocalDateTime currentTime, BFS blocks) {

//Modificacion de la poblacion, inicial de 60
        int populationSize = 45;
        double mutationRate = 0.05;
        double crossoverRate = 0.8;
        //Current Number of Generations
        int numberOfGenerations = 0;
        //Stop Condition
        int stopAt = 0;
        //Population
        Population pop;
        //Number of cars
        for (int k = 0; !orders.isEmpty(); k++) {
            //if there is no posible combination for an order
            if (k >= orders.size()) break;

            for (Vehiculo car : cars) {


                List<Double> warehouseDistances = new ArrayList<>();
                for (Almacen warehouse : almacenes) {
                    double distanceToWarehouse = calculateDistance(car.getX(), car.getY(), warehouse.getPos_x(), warehouse.getPos_y());
                    warehouseDistances.add(distanceToWarehouse);
                }
                int closestWarehouseIndex = findClosestWarehouse(warehouseDistances);
                Almacen closestWarehouse = almacenes.get(closestWarehouseIndex);


                if (this.duracion == 7 && car.getOrder().size() == 3) continue;
                if (car.getStock() <= 0) continue;


                int numOrdersAux = car.getOrder().size() + 2;
                Path route = new Path(numOrdersAux, car, orders.get(k), currentTime, blocks, closestWarehouse.getPos_x(), closestWarehouse.getPos_y());
                pop = new Population(populationSize, numOrdersAux, route, crossoverRate, mutationRate, blocks, closestWarehouse.getPos_x(), closestWarehouse.getPos_y());
                //Sorting the population from Fitness / Evaluating
                pop.FitnessOrder();

                //Start looking for possible solution
                while (numberOfGenerations != stopAt) {

                    //Seleccion / Cruce
                    while (pop.Mate(closestWarehouse.getPos_x(), closestWarehouse.getPos_y()) == false) ;
                    //Mutacion
                    for (int i = 0; i < pop.getPopulation().length; i++) {
                        pop.getNextGen()[i].setPath(pop.Mutation(pop.getNextGen()[i].getPath()), closestWarehouse.getPos_x(), closestWarehouse.getPos_y());
                    }
                    pop.setPopulation(pop.getNextGen());
                    pop.setDone(0);
                    pop.FitnessOrder();
                    numberOfGenerations++;
                }

                int aux = pop.getPopulation().length - 1;
                LinkedList<Cell> auxCells;
                double valor = pop.getPopulation()[aux].getCost();
                if (valor < 100000.0) {
                    double valro2 = orders.get(k).getAmount() - car.getStock();
                    if (valro2 > 0) {
                        int auxAmount = (int) orders.get(k).getAmount();
                        orders.get(k).setAmount(car.getStock());
                        car.addOrder(orders.get(k));
                        car.newOrder(pop.getPopulation()[aux].getPath(), car.getStock(), orders.get(k).getIdPedido());
                        orders.get(k).setAmount(auxAmount - car.getStock());
                        car.setStock(0);
                        car.generateRoute(currentTime, blocks, closestWarehouse.getPos_x(), closestWarehouse.getPos_y());
                        if (car.getPrimeraRuta() == 0) car.setPrimeraRuta(car.getRoute().size());
                    } else {
                        car.setStock(car.getStock() - orders.get(k).getAmount());
                        car.addOrder(orders.get(k));
                        car.newOrder(pop.getPopulation()[aux].getPath(), orders.get(k).getAmount(), orders.get(k).getIdPedido());
                        orders.remove(k);
                        car.generateRoute(currentTime, blocks, closestWarehouse.getPos_x(), closestWarehouse.getPos_y());
                        if (car.getPrimeraRuta() == 0) car.setPrimeraRuta(car.getRoute().size());
                        k--;
                        break;
                    }
//                }
                }
            }

//            for (Vehiculo vehiculo : this.cars) {
//                System.out.print("VEHICULO " + vehiculo.getId() + vehiculo.getTipo() + "  ");
//                vehiculo.imprimirUltimaRuta();
//            }


        }
    }

    private int distancia ( int startX, int startY, int endX, int endY ){
        return Math.abs(startX - endX) + Math.abs(startY - endY);
    }

    public boolean replanificar(LocalDateTime tiempo){
        //Tiempo de demora
        long start = System.nanoTime();

        Collections.sort(this.orders);
        int startX,startY;
        if(this.orders.isEmpty()) return false;
        //NO DEBE DE existir pedidos que tengan 4h de tiempo limite estos deben ser entregados primero owo
        if(ChronoUnit.HOURS.between(tiempo,this.orders.getFirst().getLimitDate()) > 4) return false;
        for(Vehiculo auxCars : this.cars){
//            for(Pedido auxPed : auxCars.getOrder()) {
//                auxPed.setAssigned(0);
//            }
//            this.orders.addAll(auxCars.getOrder());
            auxCars.getOrder().clear();
            auxCars.setStock(auxCars.getPhysicStock());
        }
        //Impresion de tiempo de demora
        long elapsedTime = System.nanoTime() - start;
        System.out.println("Tiempo de ejecucion de replanificacion: "+tiempo);
        return true;
    }

    public List<Pedido> obtenerListaPedidosDeVehiculosDeGenetico(){
        List<Pedido> listaAux = new ArrayList<>();
        for (Vehiculo vehiculo: this.cars){
            listaAux.addAll(vehiculo.getOrder());
        }
        return  listaAux;
    }

    private void AsisgnarPedidosAVehiculos (LinkedList < Pedido > Pedidos, ArrayList < Vehiculo > Vehiculos){

        Vehiculos.sort((v1, v2) -> Double.compare(v2.getCapacity(), v1.getCapacity()));

        Pedidos = new LinkedList<>(Pedidos.stream().sorted((o1, o2) -> Double.compare(o2.getAmount(), o1.getAmount())).collect(Collectors.toList()));
        for (Vehiculo vehicle : Vehiculos) {
            Iterator<Pedido> iterator = Pedidos.iterator();
            while (iterator.hasNext()) {
                Pedido order = iterator.next();

                if (vehicle.remainingCapacity() >= order.getAmount()) {
                    order.setEstado("Asignado");
                    vehicle.getOrder().add(order);
                    iterator.remove(); // Remover el pedido de la lista de pedidos.
                    Pedidos.remove(order);
                } else {
                    order.setEstado("No asignado");
                }
            }
        }
    }


    private double calculateDistance ( int x1, int y1, int x2, int y2){
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    private int findClosestWarehouse (List < Double > distances) {
        int closestIndex = -1;
        double closestDistance = Double.MAX_VALUE;

        for (int i = 0; i < distances.size(); i++) {
            double distance = distances.get(i);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = i;
            }
        }

        return closestIndex;
     }

     public void updateState(GeneticAlgorithmState stateGen){
        stateGen.setOrders(this.getOrders());
        stateGen.setTotalOrders(this.totalOrders);
        stateGen.setBlocks(this.getBlocks());
        stateGen.setCars(this.getCars());
        stateGen.setCurrentTime(this.getCurrentTime());
        stateGen.setStopTime(this.getStopTime());
        stateGen.setDuracion(this.getDuracion());
        stateGen.setAlmacenes(this.almacenes);
        stateGen.setAutos(this.autos);
        stateGen.setLimit(this.getLimit());
        stateGen.setTurnoAnt(this.turnoAnt);
        stateGen.addState();;
     }

}


