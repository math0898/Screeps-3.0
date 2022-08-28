/**
 * SmartCreep is a wrapper class for the Creep prototype with some helpful methods.
 * 
 * @author Sugaku
 */
export class SmartCreep {

    /**
     * Creates a new SmartCreep with the given Creep reference.
     * 
     * @param {string} c The name of the Creep object of this SmartCreep. 
     */
    constructor (c) {
        this.creepName = c;
    }

    /**
     * Announces the role of this creep to creep.say().
     */
     announceRole () {
        this.getCreep().say("⚙" + this.getCreep().memory.role);
    }
    
    /**
     * Grabs the current version of the attached creep from the list of game objects.
     * 
     * @return {Creep} The creep object associated with this SmartCreep.
     */
    getCreep () {
        return Game.creeps[creepName];
    }

    /**
     * Returns the body that should be attached to this creep given the estimated move distance and available energy.
     * 
     * @param {Number} dis      The expected number of tiles this creep may need to walk.
     * @param {Number} capacity The amount of energy that can be spent on this creep.
     * @return {Number[]} The best body for this task with the given information.
     */
    getBody (dis, capacity) {
        return [ MOVE ];
    }
}
