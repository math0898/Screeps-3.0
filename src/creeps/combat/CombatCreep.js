import { SmartCreep } from "../SmartCreep";

/**
 * CombatCreeps are related to the general fighting aspects of the game.
 * 
 * @author Sugaku
 */
export class CombatCreep extends SmartCreep {

    /**
     * Creates a new CombatCreep with the given Creep reference.
     * 
     * @param {string} c The name of the Creep object of this SmartCreep. 
     */
    constructor (c) {
        super(c);
        if (c == "") return;
        let creep = this.getCreep();
        creep.memory.homeRoom = creep.room.name;
    }

    /**
     * Announces the role of this creep to creep.say().
     */
    announceRole () {
        let creep = this.getCreep();
        creep.say("⚔ " + creep.memory.role);
    }

    /**
     * Called to have this creep add itself to the creep counts of their home room.
     */
    countSelf () {
        let creep = this.getCreep();
        let role = creep.memory.role;
        let mem = Game.rooms[creep.memory.homeRoom].memory;
        if (mem.census[role] == undefined) mem.census[role] = 0;
        mem.census[role] += 1;
    }
}
