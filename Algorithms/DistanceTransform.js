import { Algorithm } from "./Algorithm";

/**
 * The distance transform class handles the computations related to the distance
 * transform algorithm on a given room. The input space is just an 2d array 
 * where 0 indicates a wall and 1 indicates an open space.
 * 
 * @author Sugaku
 */
export class DistanceTransform extends Algorithm { //TODO finish implementation and rewrite.

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
     * 1 - A raw computing approach uses lower peaks but takes longer.
     */
    flag;

    /**
     * Creates a new distance transform object using the given room information.
     * This method also takes a flag representing how the algorithm should be 
     * executed.
     * 
     * @param {number[][]} room The room this algorithm will be operating on.
     * @param {number} flag This flag determines the approach this algorithm will use 
     *                   during execution. 0 for the iterative approach, 1 for the 
     *                   single compute approach.
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
}