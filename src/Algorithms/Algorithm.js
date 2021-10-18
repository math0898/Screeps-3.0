
/**
 * The algorithm class is used to define how algorithms behave so that they 
 * can be called by the operating system more easily.
 * 
 * @author Sugaku
 */
export default class Algorithm {

    /**
     * The name of the algorithm. This is used for displaying it in console.
     */
    #name;

    /**
     * A boolean value which determines flags whether or not the algorithm has 
     * finished executing.
     */
    #finished = false;

    /**
     * The basic constructor for the algorithm class. All that is needed is a
     * name.
     * 
     * @param {string} name The name of this algorithm.
     */
    constructor (name) {
        this.#name = name;
    }

    /**
     * Queries whether the algorithm has finished executing or not.
     * 
     * @return True if and only if the algorithm has finished execution.
     */
    isFinished () {
        return this.#finished;
    }

    /**
     * Accessor method for the name of the algorithm.
     * 
     * @return The name of the algorithm.
     */
    getName () {
        return this.#name;
    }

    /**
     * Reports the algorithm as complete. This should only be called by the 
     * algorithm manager once execution is complete.
     */
    markComplete () {
        this.#finished = true;
    }

    /**
     * Manages and runs the algorithm. This function may implement the 
     * algorithm or call numerous helper methods.
     */
    manager () {}

    /**
     * Returns the result of the algorithm. This is only updated once the
     * algorithm has finished its execution.
     * 
     * @return The result of the algorithm in whatever form may be.
     */
    getResult () {}
}