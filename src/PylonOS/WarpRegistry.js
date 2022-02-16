import { Warp } from "./Warp"; 

/**
 * The warp registry is an array list of processes that have been registered. Every tick the warp registry is read by the 
 * oracle and sorted before given to the kernel for execution. At which point the kernel rewrites the registry.
 * 
 * @author Sugaku
 */
export class WarpRegistry { // TODO: finish implementation.
    
    /**
     * This is the actual registry that holds all of the warps. It is sorted by
     * priority given to each task by the scheduler on the last tick. This is so
     * that when rebuilding each schedule only a few swaps are needed.
     */
    #registry = [];

    /**
     * Nothing special needs to happens on construction. This just allocates the 
     * registry array.
     */
    constructor () {
        this.#registry = new Array();
    }

    /**
     * Accessor method for all the warps in the registry.
     * 
     * @return {Array} The list of warps saved in this registry.
     */
    getWarps () {
        return this.#registry;
    }

    /**
     * Adds the given warp to this warp registry.
     * 
     * @param {Warp} warp The warp to add to this warp registry.
     */
    addWarp (warp) {
        this.#registry.push(warp);
    }

    /**
     * Clears the registry.
     */
    clear () {
        this.#registry = [];
    }
}
