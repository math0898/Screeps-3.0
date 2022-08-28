import { SmartCreep } from "../SmartCreep";

/**
 * EconomicCreeps are related to the general economy of the creep civilization. They aren't given special privileges such
 * as O(n) calls.
 * 
 * @author Sugaku
 */
export class EconomicCreep extends SmartCreep {

    /**
     * Called to have this creep add itself to the creep counts of their home room.
     */
    countSelf () {
        let mem = this.getCreep().room.memory;
        if (mem.census == undefined) mem.census = [];
        if (mem.census[this.getCreep().memory.role] == undefined) mem.census[this.getCreep().memory.role] = 0;
        mem.census[this.getCreep().memory.role]++;
    }
}
