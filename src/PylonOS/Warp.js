/**
 * A warp is a process that can be run. It contains some data about itself such
 * as when it was registered and at what priority so that it can be ordered by
 * the oracle. Additionally it has the room that registered it and its name so
 * that the warp table can be written for it.
 * 
 * @author Sugaku
 */
export class Warp {
    
    /**
     * The name of the process. This name should be unique and not include any
     * dependent data such as the tick started. 
     */
    #name;

    /**
     * This is the initial weight given to the process. This is used to help 
     * the Oracle determine the urgency that this needs to be run at.
     */
    #weight;

    /**
     * This is the tick that the process was registered. This helps the oracle
     * prioritize tasks that have been scheduled earlier.
     */
    #scheduled;

    /**
     * This is the default constructor for a Warp. It requires the initial 
     * weight, when it was scheduled, and the name it is going by.
     * 
     * @param {string} name The name for the warp to use.
     * @param {number} weight The initial weighting of this process.
     * @param {number} scheduled The tick that this process was scheduled.
     */
    constructor (name, weight, scheduled) {
        this.#name = name;
        this.#weight = weight;
        this.#scheduled = scheduled;
    }

    /**
     * This is the method signature used to run any given warp. It should 
     * return true if and only if the process has finished execution and needs
     * no further calls. False if the process needs called again.
     * 
     * @return True if and only if the process has finished execution.
     */
    run () {
        return true;
    }

    /**
     * Accessor method for the name of the warp process.
     * 
     * @return The name of this warp process.
     */
    getName () {
        return this.#name;
    }

    /**
     * Accessor method for the initial weight given to this warp process.
     * 
     * @return The initial weight of the warp process.
     */
    getWeight () {
        return this.#weight;
    }

    /**
     * Accessor method for the tick that this process was registered.
     * 
     * @return The tick this process was registered.
     */
    getScheduled () {
        return this.#scheduled;
    }
}