import { EconomicCreep } from "./EconomicCreep";

/**
 * 
 */
export class Upgrader extends EconomicCreep {

    /**
     * Returns the body that should be attached to this creep given the estimated move distance and available energy.
     * 
     * @param {Number} dis      The expected number of tiles this creep may need to walk.
     * @param {Number} capacity The amount of energy that can be spent on this creep.
     * @return {Number[]} The best body for this task with the given information.
     */
     getBody (dis, capacity) {
        if (capacity <= 300 && dis <= 100) return [ WORK, MOVE, CARRY, CARRY, MOVE ];  
        return body;
    }

    /**
     * Runs the logic for this creep.
     * 
     * @return {Number} 0 - The logic ran successfully.
     */
    runLogic () {
        let creep = this.getCreep();
        let room = creep.room;
        if (creep.memory.working) {
            let controller = room.controller;
            if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) this.smartMove(controller);
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) creep.memory.working = false;
        } else {
            let source = Game.getObjectById(room.memory.sources[0]);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) this.smartMove(source);
            if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) creep.memory.working = true;
        }
        this.announceRole();
        return 0;
    }
}
