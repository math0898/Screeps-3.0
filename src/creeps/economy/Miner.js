import { EconomicCreep } from "./EconomicCreep";

/**
 * Miners walk to a source and mine the source until death.
 * 
 * @author Sugaku
 */
export class Miner extends EconomicCreep {

    /**
     * Returns the body that should be attached to this creep given the estimated move distance and available energy.
     * 
     * @param {Number} dis      The expected number of tiles this creep may need to walk.
     * @param {Number} capacity The amount of energy that can be spent on this creep.
     * @return {Number[]} The best body for this task with the given information.
     */
    getBody (dis, capacity) {
        if (capacity <= 300 && dis <= 100) return [ WORK, MOVE, WORK, WORK ];  
        return body;
    }
}
