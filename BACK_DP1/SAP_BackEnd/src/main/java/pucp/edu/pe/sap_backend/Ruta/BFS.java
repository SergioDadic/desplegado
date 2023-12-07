package pucp.edu.pe.sap_backend.Ruta;

import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.LinkedList;
@ToString
@EqualsAndHashCode
public class BFS {

    private BlockMap map;

    public BFS(BlockMap map) {
        this.map = map;
    }

    //BFS, Time O(n^2), Space O(n^2)
    public LinkedList<Cell> shortestPath(int[] start, int[] end,LocalDateTime currentTime, int tipo, Cell last) {
        int sx = start[0], sy = start[1];
        int dx = end[0], dy = end[1];

        //initialize the cells
        int m = map.getMap().length;
        int n = map.getMap()[0].length;
        int recorrido_tiempo = Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1]) + 30;
        //int recorrido_tiempo = Integer.MAX_VALUE;
        Cell[][] cells = new Cell[m][n];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                //Accept up to 10 minutes after shortest distance between points
                cells[i][j] = new Cell(i, j, recorrido_tiempo, null,currentTime);
            }
        }
        //breadth first search
        Cell p;
        LinkedList<Cell> queue = new LinkedList<>();
        try{
            Cell src = cells[sx][sy];
            src.dist = 0;
            queue.add(src);
            if(last!=null){
                src= cells[last.x][last.y];
                p=queue.poll();
                src.dist = 1;
                src.prev=p;
                queue.add(src);
            }
        }catch (Exception e){
            System.out.print(e);
            return null;
        }

        Cell dest = null;

        int coord_x = 0;
        int coord_y = 0;
        while ((p = queue.poll()) != null) {
            //find destination
            coord_x = p.x;
            coord_y = p.y;
            if (coord_x == dx && coord_y == dy) {
                dest = p;
                break;
            }
            // moving up
            visit(cells, queue, coord_x - 1, coord_y, p,currentTime,tipo,map,dx,dy);
            // moving down
            visit(cells, queue, coord_x + 1, coord_y, p,currentTime,tipo,map,dx,dy);
            // moving left
            visit(cells, queue, coord_x, coord_y - 1, p,currentTime,tipo,map,dx,dy);
            //moving right
            visit(cells, queue, coord_x, coord_y + 1, p,currentTime,tipo,map,dx,dy);
        }

        //compose the path if path exists
        if (dest == null) {
            return null;
        } else {
            LinkedList<Cell> path = new LinkedList<>();
            p = dest;
            do {
                path.addFirst(p);
            } while ((p = p.prev) != null);
            return path;
        }
    }

    //function to update cell visiting status, Time O(1), Space O(1)
    private void visit(Cell[][] cells, LinkedList<Cell> queue, int x, int y, Cell parent, LocalDateTime currentTime,int tipo, BlockMap map, int dx, int dy) {
        //out of boundary
        if (x < 0 || x >= cells.length || y < 0 || y >= cells[0].length || cells[x][y] == null) {
            return;
        }
        boolean blocked=false;
        //update distance, and previous node
        if(tipo==0)return;
        int dist = parent.dist + 1;
        long adicional = 5/6;
        //int newMinutes =  dist*6/5; //TIEMPO = DISTANCIA*VELOCIDAD
        int minutes = tipo == 1? dist*2:dist;
        int tiempoBaseXMovimiento = 72; //72 SEGUNDOS
        int newSegundos = tiempoBaseXMovimiento*dist;
        //SE MODIFICO ACA
        Cell p = cells[x][y];
        boolean free = compareTime(this.map.getMap()[x][y],currentTime.plusSeconds(newSegundos),x,y);
        if(x==dx && y==dy){
            blocked = compareTime(this.map.getMap()[parent.x][parent.y],currentTime.plusSeconds(newSegundos + 72),parent.x,parent.y);
        }
        if (dist < p.dist && (free || blocked)) {
            p.dist = dist;
            p.prev = parent;
            //If is false, it means it's blocked
            if(!free){
                p.blocked=true;
            }
            queue.add(p);
        }
    }
    public boolean compareTime(Blocknode blocknode, LocalDateTime estimateTime,int x, int y) {
        if(blocknode == null)return true;
        for(int i = 0; i < blocknode.getStartTime().size(); i++){
            if(!(estimateTime.isBefore(blocknode.getStartTime().get(i)) || estimateTime.isAfter(blocknode.getEndTime().get(i)))) return false;
        }
        return true;
    }

    public BlockMap getMap() {
        return map;
    }

    public void setMap(BlockMap map) {
        this.map = map;
    }
}
