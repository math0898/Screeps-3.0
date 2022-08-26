/**
 * SmartCreep is a wrapper class for the Creep prototype with some helpful methods.
 * 
 * @author Sugaku
 */
export class SmartCreep {

    /**
     * Creates a new SmartCreep with the given Creep reference.
     * 
     * @param {Creep} c The creep object of this SmartCreep. 
     */
     constructor (c) {
        this.creep = Game.creeps[c];
    }
}
