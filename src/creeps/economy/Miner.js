import { EconomicCreep } from "./EconomicCreep";

export class Miner extends EconomicCreep {

    /**
     * Creates a new Miner with the given Creep reference.
     * 
     * @param {Creep} c The creep object of this Miner. 
     */
    constructor (c) {
        super();
        this.creep = Game.creeps[c];
    }

    /**
     * Generates the body for a Miner creep with the given
     * distance to a source and maximum capacity.
     * 
     * @param {Number} dis      The number of tiles to get to the source.
     * @param {Number} capacity The amount of energy that can be spent on this creep.
     */
    getBody (dis, capacity) {
        let body = new Number[3]; // TODO: Actually implement. Should perform some simulations.
        return body;
    }
}