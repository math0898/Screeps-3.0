import { SmartCreep } from "../SmartCreep";

/**
 * EconomicCreeps are related to the general economy of the creep civilization.
 * 
 * @author Sugaku
 */
export class EconomicCreep extends SmartCreep {

    /**
     * Announces the role of this creep to creep.say().
     */
    announceRole () {
        this.creep.say("Hello World!");
    }
}
