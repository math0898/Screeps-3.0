import { CombatCreep } from "./CombatCreep";

/**
 * Scouts are very simple creeps with a single move part.
 * 
 * @author Sugaku
 */
export class Scout extends CombatCreep {
    
    /**
     * Creates a new CombatCreep with the given Creep reference.
     * 
     * @param {string} c The name of the Creep object of this SmartCreep. 
     */
    constructor (c) {
        super(c);
        if (c == "") return;
        let creep = this.getCreep();
        if (Game.flags["Scout " + creep.room.name] == undefined) {
            creep.suicide();
            return;
        }
        creep.memory.target = Game.flags["Scout " + creep.room.name].pos.roomName;
    }

    /**
     * Runs the logic for this creep.
     * 
     * @return {Number} 0 - The logic ran successfully.
     */
    runLogic () {
        let creep = this.getCreep();
        creep.say('🛰', true);
        if (creep.memory.target != undefined) this.smartMove(new RoomPosition(25, 25, creep.memory.target));
    }
}
