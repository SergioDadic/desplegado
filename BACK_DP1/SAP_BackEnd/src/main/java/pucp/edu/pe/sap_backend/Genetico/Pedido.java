package pucp.edu.pe.sap_backend.Genetico;

import jakarta.persistence.*;
import pucp.edu.pe.sap_backend.ClasesBD.PedidoBD;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class Pedido implements Comparable{
    private int x;
    private int y;
    private int idPedido;


    private String nombrePedido;
    private int id;

    private int amount;

    private double cantidadAEntregar; //en m^3
    private int MMDD;

    private int hhmm;
    private int maxHours;
    private int YYYY;
    private int assigned; //Si es 0 no está asignado dato a recordad
    private String estado;

    private LocalDateTime pedidoDate;

    private LocalDateTime limiteDate;

    private LocalDateTime deliverDate;

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public double getCantidadAEntregar(){
        return cantidadAEntregar;
    }

    public void setCantidadAEntregar(double cantidadAEntregar){
        this.cantidadAEntregar = cantidadAEntregar;
    }

    public Pedido() {
    }
    public Pedido(int idPedido, int id, int x, int y, int cantidad, int YYYY, int MMDD, int hhmm, int maxHours, String nombrePedido){
        this.x=x;
        this.y=y;
        this.nombrePedido = nombrePedido;
        this.idPedido=idPedido;
        this.id=id;
        this.amount = cantidad;
        this.cantidadAEntregar=cantidad;
        this.assigned=0;
        this.YYYY = YYYY;
        this.MMDD= MMDD;
        this.hhmm=hhmm;
        this.maxHours = maxHours;
        String aux= createDate(YYYY,MMDD/100,MMDD%100,hhmm/100,hhmm%100);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        this.pedidoDate = LocalDateTime.parse(aux, formatter);
        this.limiteDate = this.pedidoDate.plusHours(maxHours);
        this.setEstado("Pendiente");


    }
    //PARA EL GENETICOCONTROLLER
    public Pedido(PedidoBD pedidoBD){
        this.x = (int) pedidoBD.getPos_x();
        this.y = (int) pedidoBD.getPos_y();
        this.id = pedidoBD.getId();
        this.idPedido = pedidoBD.getId();
        this.nombrePedido = pedidoBD.getIdPedido();;
        this.amount = pedidoBD.getCantidadPedido();
        this.assigned=0;
        this.YYYY = pedidoBD.getFechaRecibida().getYear();
        this.MMDD = pedidoBD.getFechaRecibida().getMonthValue()*100 + pedidoBD.getFechaRecibida().getDayOfMonth();
        this.hhmm = pedidoBD.getFechaRecibida().getHour()*100 + pedidoBD.getFechaRecibida().getMinute();
        this.maxHours = (int) Duration.between(pedidoBD.getFechaRecibida(),pedidoBD.getHoraEstimadaDeEntregaMaxima()).toHours();
        this.cantidadAEntregar = pedidoBD.getCantidadPedido();
        this.pedidoDate = pedidoBD.getFechaRecibida();
        this.limiteDate = pedidoBD.getHoraEstimadaDeEntregaMaxima();
        this.setEstado("Pendiente");
    }

//    public Pedido(Pedido pedido){
//        this.x= (int) pedido.getX();
//        this.y= (int) pedido.getY();
//        this.idPedido=pedido.getIdPedido();
//        this.id=pedido.getId();
//        this.amount=pedido.getAmount();
//        this.cantidadAEntregar = pedido.getCantidadAEntregar();
//        this.assigned=0;
//        this.pedidoDate = pedido.getPedidoDate();
//        this.limiteDate = pedido.getLimitDate();
//        this.setEstado(pedido.getEstado());
//        this.deliverDate= pedido.getDeliverDate();
//
//    }

    public Pedido(Pedido pedido){
        this.x=pedido.getX();
        this.y=pedido.getY();
        this.idPedido=pedido.getIdPedido();
        this.id=pedido.getId();
        this.nombrePedido = pedido.nombrePedido;
        this.amount=pedido.getAmount();
        this.cantidadAEntregar = pedido.getCantidadAEntregar();
        this.assigned=0;
        this.YYYY=pedido.getYYYY();
        this.MMDD=pedido.getMMDD();
        this.hhmm=pedido.getHhmm();
        this.maxHours = pedido.getMaxHours();
        String aux= createDate(this.YYYY,this.MMDD/100,this.MMDD%100,this.hhmm/100,this.hhmm%100);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        this.pedidoDate = LocalDateTime.parse(aux, formatter);
        this.limiteDate = this.pedidoDate.plusHours(this.maxHours);
        this.deliverDate = pedido.getDeliverDate();
        this.setEstado(pedido.getEstado());
    }

    public String createDate(int YYYY, int MM, int DD, int hour, int minutes){
        String auxYear = String.format("%02d", YYYY);
        String auxMonth = String.format("%02d", MM);
        String auxDay = String.format("%02d", DD);
        String auxHour = String.format("%02d", hour);
        String auxMinute = String.format("%02d", minutes);
        String date = auxYear+"-"+auxMonth+"-"+auxDay+" "+auxHour+":"+auxMinute;
        return date;
    }
    public int getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(int idPedido) {
        this.idPedido = idPedido;
    }

    public int getMaxHours() {
        return maxHours;
    }
    public void setMaxHours(int maxHours) {
        this.maxHours = maxHours;
    }

    public LocalDateTime getPedidoDate() {
        return pedidoDate;
    }

    public void setPedidoDate(LocalDateTime pedidoDate) {
        this.pedidoDate = pedidoDate;
    }

    public LocalDateTime getDeliverDate() {
        return deliverDate;
    }

    public void setDeliverDate(LocalDateTime deliverDate) {
        this.deliverDate = deliverDate;
    }

    public LocalDateTime getLimitDate() {
        return limiteDate;
    }

    public void setLimitDate(LocalDateTime limitDate) {
        this.limiteDate = limitDate;
    }

    public int getYYYY() {
        return YYYY;
    }

    public void setYYYY(int YYYY) {
        this.YYYY = YYYY;
    }

    public int getMMDD() {
        return MMDD;
    }

    public void setMMDD(int MMDD) {
        this.MMDD = MMDD;
    }

    public int getHhmm() {
        return hhmm;
    }

    public void setHhmm(int hhmm) {
        this.hhmm = hhmm;
    }

    public int getAssigned() {
        return assigned;
    }

    public void setAssigned(int assigned) {
        this.assigned = assigned;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }
    public double distance(double xOther,double yOther){
        return Math.sqrt(((this.x-xOther)*(this.x-xOther)))+ Math.sqrt(((this.y-yOther)*(this.y-yOther)));
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    @Override
    public int compareTo(Object pedido) {
        LocalDateTime aux = ((Pedido)pedido).getLimitDate();
        return this.limiteDate.compareTo(aux);
    }

    public static Pedido fromString(String data,int anho,int mes){
        Pedido pedido = new Pedido();

        Pattern pattern = Pattern.compile("(\\d+)d(\\d+)h(\\d+)m:(\\d+),(\\d+),c-(\\d+),(\\d+)m3,(\\d+)h");
        Matcher matcher = pattern.matcher(data);


        if (matcher.find()) {
            int days = Integer.parseInt(matcher.group(1));
            int hours = Integer.parseInt(matcher.group(2));
            int minutes = Integer.parseInt(matcher.group(3));

            pedido.MMDD = mes*100 + days;
            pedido.hhmm = hours*100+minutes;
            pedido.YYYY = anho;
            pedido.x = Integer.parseInt(matcher.group(4));
            pedido.y = Integer.parseInt(matcher.group(5));
            pedido.id = Integer.parseInt(matcher.group(6));
            pedido.cantidadAEntregar = Double.parseDouble(matcher.group(7));
            pedido.maxHours = Integer.parseInt(matcher.group(8));
            pedido.pedidoDate = LocalDateTime.of(anho, mes, days, hours, minutes);
            pedido.limiteDate = pedido.pedidoDate.plus(pedido.maxHours, ChronoUnit.HOURS);
            //System.out.println(pedido.pedidoDate +"   " + pedido.limiteDate);
            return pedido;
        }
        return null;
    }

    public String getNombrePedido() {
        return nombrePedido;
    }

    public void setNombrePedido(String nombrePedido) {
        this.nombrePedido = nombrePedido;
    }
}