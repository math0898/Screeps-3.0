import { EconomicCreep } from "./EconomicCreep";

/**
 * Miners walk to a source and mine the source until death.
 * 
 * @author Sugaku
 */
export class Miner extends EconomicCreep {

    /**
     * Generates the body for a Miner creep with the given
     * distance to a source and maximum capacity.
     * 
     * @param {Number} dis      The number of tiles to get to the source.
     * @param {Number} capacity The amount of energy that can be spent on this creep.
     */
    getBody (dis, capacity) {
        if (capacity <= 300 && dis <= 100) return [ WORK, MOVE, WORK, WORK ];  
        return body;
    }
}
