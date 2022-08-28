import { SmartCreep } from "../SmartCreep";

/**
 * EconomicCreeps are related to the general economy of the creep civilization. They aren't given special privileges such
 * as O(n) calls.
 * 
 * @author Sugaku
 */
export class EconomicCreep extends SmartCreep {

    /**
     * Announces the role of this creep to creep.say().
     */
    announceRole () {
        let creep = this.getCreep();
        creep.say("⚙ " + creep.memory.role);
    }

    /**
     * Called to have this creep add itself to the creep counts of their home room.
     */
    countSelf () { // TODO: Simply doesn't work.
        let role = this.getCreep().memory.role;
        // console.log(role);
        let mem = this.getCreep().room.memory;
        if (mem.census[role] == undefined) mem.census[role] = 0;
        mem.census[role] += 1;
        // console.log(mem.census);
    }
}
