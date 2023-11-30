package pucp.edu.pe.sap_backend.Genetico;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Random;

import pucp.edu.pe.sap_backend.Ruta.BFS;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@ToString
@EqualsAndHashCode
public class Population {


    private int populationSize;
    private int numOrders;
    private Path[] population;
    private double crossoverRate;
    private Pedido[] child1;
    private Pedido[] child2;
    private double mutationRate;
    private Path[] nextGen;
    private int done;
    private Vehiculo car;
    private BFS blocks;



    public Population(int populationSize, int numOrders, Path path, double crossoverRage, double mutationRate,BFS blocks, int almacenX,int almacenY) {
        this.populationSize = populationSize;
        this.numOrders = numOrders;
        this.crossoverRate = crossoverRage;
        population = new Path[populationSize];
        this.mutationRate = mutationRate;
        this.nextGen = new Path[populationSize];
        done = 0;
        this.blocks = blocks;
        CreatePopulation(path,almacenX,almacenY);

    }

    public void CreatePopulation(Path p,int almacenX,int almacenY) {
        int i = 0;

        while (i < populationSize) {
            Pedido[] tmpCity = new Pedido[numOrders];
            for (int j = 0; j < tmpCity.length; j++) {
                tmpCity[j] = p.getPath()[j];
            }
            Collections.shuffle(Arrays.asList(tmpCity).subList(1,numOrders));
            Path tmpPath = new Path(numOrders,blocks,almacenX,almacenY);
            tmpPath.setPath(tmpCity,almacenX,almacenY);
            population[i] = tmpPath;
            i++;
        }
    }

    public int SelectParent() {
        int total = 0;
        //Selecting parents
        int totalCost = calculateTotalFitness();

        int fit = RandomNum(0, totalCost);
        int value = 0;
        for (int i = 0; i < population.length; i++) {
            value += population[i].getFitness();
            if (fit <= value) {
                return i;
            }//if(fit<=value){
        }
        return -1;

    }

    public boolean Mate(int almacenX,int almacenY) {
        //Generate a random number to check if the parents cross
        int check = RandomNum(0, 100);
        int parent1 = SelectParent();
        int parent2 = SelectParent();
        while (parent1 == parent2) {
            parent2 = SelectParent();
        }

        //check if there is going to be a crossover
        if (check <= (crossoverRate * 100)) {
            //Original
            //int crossoverPoint = RandomNum(0, population[parent1].getPath().length - 1);
            //Modified
            int crossoverPoint = 1;
            if(numOrders > 2) crossoverPoint = RandomNum(1, population[parent1].getPath().length - 1);
            child1 = new Pedido[numOrders];
            child2 = new Pedido[numOrders];

            //crossing over
            for (int i = 0; i < crossoverPoint; i++) {
                child1[i] = population[parent2].getPath()[i];
                child2[i] = population[parent1].getPath()[i];
            }
            for (int i = crossoverPoint; i < numOrders; i++) {
                child1[i] = population[parent1].getPath()[i];
                child2[i] = population[parent2].getPath()[i];
            }


            //Rearrange childs considering city repetition
            int cityChild1;
            int cityChild2;
            ArrayList<Integer> list1 = new ArrayList<Integer>();
            ArrayList<Integer> list2 = new ArrayList<Integer>();

            for (int i = 0; i < crossoverPoint; i++) {
                cityChild1 = child1[i].getIdPedido();
                cityChild2 = child2[i].getIdPedido();

                //Get the positions of repeated values
                for (int j = crossoverPoint; j < numOrders; j++) {
                    if (cityChild1 == child1[j].getIdPedido()) {
                        list1.add(j);
                    }
                    if (cityChild2 == child2[j].getIdPedido()) {
                        list2.add(j);
                    }
                }
            }

            //Find the missing values
            for (int i = 0; i < numOrders; i++) {
                boolean found = false;
                //Fixing Child1
                for (int j = 0; j < numOrders; j++) {
                    if (population[parent2].getPath()[i] == child1[j]) {
                        found = true;
                        break;
                    }
                }
                if (found == false) {
                    try{
                        child1[list1.remove(list1.size() - 1)] = population[parent2].getPath()[i];
                    }catch(Exception e){
                        System.out.println(e);
                    }
                }
                found = false;
                //Fixing Child2
                for (int j = 0; j < numOrders; j++) {
                    if (population[parent1].getPath()[i] == child2[j]) {
                        found = true;
                        break;
                    }
                }
                if (found == false) {
                    try{
                        child2[list2.remove(list2.size() - 1)] = population[parent1].getPath()[i];
                    }catch(Exception e){
                    }
                }
            }

            if (AddToGenerationCheckFull(child1, child2,almacenX,almacenY) == false) {
                return false;
            } else {
                return true;
            }


        } else {

            if (AddToGenerationCheckFull(population[parent1].getPath(), population[parent1].getPath(),almacenX,almacenY) == false) {
                return false;
            } else {
                return true;
            }
        }
    }

    public int getDone() {
        return done;
    }

    public void setDone(int done) {
        this.done = done;
    }

    public boolean AddToGenerationCheckFull(Pedido[] child1, Pedido[] child2,int almacenX, int almacenY) {
        if (done == populationSize) {
            return true;
        }
        Path newGenChild1 = new Path(numOrders,blocks,almacenX,almacenY);
        Path newGenChild2 = new Path(numOrders,blocks,almacenX,almacenY);
        newGenChild1.setPath(child1,almacenX,almacenY);
        newGenChild2.setPath(child2,almacenX,almacenY);
        if (done < populationSize - 2) {
            this.nextGen[done] = newGenChild1;
            this.nextGen[done + 1] = newGenChild2;
            this.done += 2;
            return false;
        } else if (done == populationSize - 2) {
            this.nextGen[done] = newGenChild1;
            this.nextGen[done + 1] = newGenChild2;
            done += 2;
            return true;
        } else {
            this.nextGen[done] = newGenChild1;
            done += 1;
            return true;
        }

    }

    public Path[] getNextGen() {
        return nextGen;
    }

    public void setNextGen(Path[] nextGen) {
        this.nextGen = nextGen;
    }

    public Pedido[] Mutation(Pedido[] child) {
        int check = RandomNum(0, 100);
        //Checks if its going to mutate
        //Modified
        if (check <= (mutationRate * 100) && numOrders > 3) {

            //finds the 2 cities that "mutate"
//            Original
//            int point1 = RandomNum(0, numOrders - 1);
//            int point2 = RandomNum(0, numOrders - 1);
//            Modified
            int point1 = RandomNum(1, numOrders - 1);
            int point2 = RandomNum(1, numOrders - 1);
            while (point2 == point1) {
                //original
                //point2 = RandomNum(0, numOrders - 1);
                //modified
                point2 = RandomNum(1, numOrders - 1);
            }

            //Cities are switched as result of mutation
            Pedido city1 = child[point1];
            Pedido city2 = child[point2];
            child[point1] = city2;
            child[point2] = city1;

        }
        return child;
    }

    public int RandomNum(int min, int max) {
        return min + (new Random()).nextInt(max - min);
    }

    public void FitnessOrder() {
        Arrays.sort(population);
        // double cost = calculateTotalCost();
        for (int i = 0; i < population.length; i++) {
            int lol = 100000 / ((int)population[i].getCost() + 1);
            population[i].setFitness(lol);
        }

    }

    public int calculateTotalFitness() {
        int cost = 0;
        for (int i = 0; i < population.length; i++) {
            cost += population[i].getFitness();
        }
        return cost;
    }

    public double getCrossoverRate() {
        return crossoverRate;
    }

    public void setCrossoverRate(double crossoverRage) {
        this.crossoverRate = crossoverRage;
    }

    public Path[] getPopulation() {
        return population;
    }

    public void setPopulation(Path[] population) {
        this.population = population;
    }

    public int getPopulationSize() {
        return populationSize;
    }

    public void setPopulationSize(int populationSize) {
        this.populationSize = populationSize;
    }

    public int getNumOrders() {
        return numOrders;
    }

    public void setNumOrders(int numOrders) {
        this.numOrders = numOrders;
    }

    public BFS getBlocks() {
        return blocks;
    }

    public void setBlocks(BFS blocks) {
        this.blocks = blocks;
    }



}