import { Algorithm } from "./Algorithm";
const _ = require('lodash');

/**
 * The distance transform class handles the computations related to the distance
 * transform algorithm on a given room. The input space is just an 2d array 
 * where 0 indicates a wall and 1 indicates an open space.
 * 
 * @author Sugaku
 */
export class DistanceTransform extends Algorithm {

    /**
     * This variable holds the representation of the room. This will then be updated
     * to hold the data of the previous transform algorithm iteration.
     */
    room;

    /** 
     * This flag is represented as a number, either 0 or 1 which determines the 
     * approach used for processing the algorithm. 
     * 
     * 0 - An iterative approach using higher peak cpu but lower average.
     * 1 - A raw computing approach which has lower peaks but takes longer.
     */
    flag;

    /**
     * Creates a new distance transform object using the given room information.
     * This method also takes a flag representing how the algorithm should be 
     * executed.
     * 
     * It should be noted that the room should be square. Although things may or not 
     * break in the case room is not. 
     * 
     * @param {number[][]} room The map this algorithm will be running on. 0 represents
     *                          a wall and 1 represents a space to calculate the distance
     *                          from the walls for.
     * @param {number} flag This flag determines the approach this algorithm will use 
     *                      during execution. 0 for the iterative approach, 1 for the 
     *                      single compute approach.
     */
    constructor (room, flag) {
        let currentDate = new Date();
        super("Distance Transform " + flag + " - " + "m: " + currentDate.getMonth() + " d:" + currentDate.getDay() + " h:" + currentDate.getHours());
        this.flag = flag;
        this.room = room;
        if (flag == 1) this.room = DistanceTransform.convertToCompute(room);
        else this.room = _.cloneDeep(room);
    }

    /**
     * Returns the result of the algorithm. This is only updated once the
     * algorithm has finished its execution.
     * 
     * @return The result of the algorithm in whatever form may be.
     */
    getResult () {
        return this.room;
    }

    /**
     * Converts the given matrix of 0 representing walls and 1 representing cells
     * to compute into a matrix of 0 representing walls and -1 representing cells 
     * to compute.
     * 
     * @param {number[][]} toConvert The matrix that needs converting.
     * @returns Matrix that has been converted and is ready for use with the 
     *          computing algorithm.
     */
    static convertToCompute (toConvert) {
        for (var y = 0; y < toConvert.length; y++) for (var x = 0; x < toConvert[y].length; x++) if (toConvert[y][x] == 1) toConvert[y][x] = -1;
        return toConvert;
    }

    /**
     * Manages execution of the Distance Transform. This method is safe and if
     * it is called after execution has completed it will do nothing. 
     */
    manager () {
        if (this.isFinished()) return;
        var completed;
        if (this.flag == 0) completed = !this.distanceTransformIterative();
        else if (this.flag == 1) completed = !this.distanceTransformCompute();
        if (completed) this.markComplete();
    }

    /**
     * This is the computing method for the distance transform algorithm. It has
     * lower peak CPU usage but often takes longer on big matrixes. 
     * 
     * @return True if swaps were made and the algorithm is not finished. False
     *         if the algorithm is finished.
     */
    distanceTransformCompute () {
        var change = false;
        for (var y = 0; y < this.room.length; y++) for (var x = 0; x < this.room[y].length; x++) {
            if (this.room[y][x] != -1) continue;
            change = true;
            var delta = 1;
            var exit = false;
            while (!exit) {
                for (var dx = -delta; dx <= delta; dx++) {
                    for (var dy = -delta; dy <= delta; dy++) {
                        if (y + dy < 0 || x + dx < 0 || y + dy == this.room.length || x + dx == this.room.length) continue;
                        if (this.room[y + dy][x + dx] == 0) exit = true;
                    }
                }
                delta++;
            }
            this.room[y][x] = delta - 1;
        }
        return change;
    }

    /**
     * This is the iterative step of the Distance Transform it uses the neighbors
     * of each point to determine if the distance a point could be is higher than
     * currently reported. Each call it can make up to n^2 * 9 reads and n^2 writes.
     * 
     * @return True if swaps were made and the algorithm is not finished. False
     *         if the algorithm is finished.
     */
    distanceTransformIterative () {
        var temp = _.cloneDeep(this.room);
        var change = false;
        for (var y = 0; y < temp.length; y++) for (var x = 0; x < temp[y].length; x++) {
            var current = this.room[y][x];
            if (current == 0) continue;
            var t = false;
            for (var dx = -1; dx <= 1; dx++) {
                for (var dy = -1; dy <= 1; dy++) {
                    if (y + dy < 0 || x + dx < 0 || y + dy == this.room.length || x + dx == this.room.length) continue;
                    if (this.room[y + dy][x + dx] < current) {
                        t = true;
                        break;
                    }
                }
                if (t) break;
            }
            if (t) continue;
            temp[y][x]++;
            change = true;
        }
        this.room = temp;
        return change;
    }
}
