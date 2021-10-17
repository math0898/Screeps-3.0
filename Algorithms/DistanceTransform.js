import { Algorithm } from "./Algorithm";

/**
 * The distance transform class handles the computations related to the distance
 * transform algorithm on a given room. The input space is just an 2d array 
 * where 0 indicates a wall and 1 indicates an open space.
 * 
 * @author Sugaku
 */
class DistanceTransform extends Algorithm { //TODO finish implementation and rewrite.

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
        this.room = room;
        this.flag = flag;
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
     * Manages execution of the Distance Transform. This method is safe and if
     * it is called after execution has completed it will do nothing. 
     */
    manager () {
        if (this.isFinished()) return;
        var completed;
        if (this.flag == 0) completed = this.distanceTransformIterative();

        if (completed) this.markComplete();
    }

    /**
     * This is the iterative step of the Distance Transform it uses the neighbors
     * of each point to determine if the distance a point could be is higher than
     * currently reported. Each call it can make up to n^2 * 9 reads and n^2 writes.
     * 
     * @return True if no swaps were made and the algorithm is finished. False
     *         otherwise.
     */
    distanceTransformIterative () {
        var temp = require('lodash').cloneDeep(this.room);
        var change = false;

        for (var y = 0; y < temp.length; y++) for (var x = 0; x < temp[y].length; x++) {
            var current = this.room[y][x];
            if (current == 0) continue;
            var t = false;
            for (var dx = -1; dx <= 1; dx++) {
                for (var dy = -1; dy <= 1; dy++) {
                    if (this.room[y + dy][x + dx] < current) { // If the array goes out of bounds this will be false.
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

        return change;
    }
}
// Export the class
module.exports.DistanceTransform = DistanceTransform;