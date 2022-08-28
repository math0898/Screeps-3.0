import { EconomicCreep } from "./EconomicCreep";

/**
 * Harvesters are a narrow minded version of workers. They gather resources from sources; then fill spawns and extensions
 * with the energy they harvest.
 * 
 * @author Sugaku
 */
export class Harvester extends EconomicCreep {

    /**
     * Returns the body that should be attached to this creep given the estimated move distance and available energy.
     * 
     * @param {Number} dis      The expected number of tiles this creep may need to walk.
     * @param {Number} capacity The amount of energy that can be spent on this creep.
     * @return {Number[]} The best body for this task with the given information.
     */
    getBody (dis, capacity) {
        if (capacity <= 300 && dis <= 100) return [ WORK, MOVE, CARRY, CARRY, MOVE ];  
        return body;
    }

    /**
     * Runs the logic for this creep.
     * 
     * @return {Number} 0 - The logic ran successfully.
     */
    runLogic () {
        this.announceRole();
        return 0;
    }
}
