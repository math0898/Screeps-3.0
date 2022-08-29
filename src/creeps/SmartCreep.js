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

    }
    
    /**
     * Grabs the current version of the attached creep from the list of game objects.
     * 
     * @return {Creep} The creep object associated with this SmartCreep.
     */
    getCreep () {
        return Game.creeps[this.creepName];
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

    /**
     * An optimized version of the creep.moveTo() command.
     * 
     * Self plagiarized from https://github.com/math0898/Screeps-2.0/blob/main/src/CreepTypes/CreepRole.ts#L31
     * 
     * @param {RoomPosition} pos The target position to move to.
     */
    smartMove (pos) {
        let creep = this.getCreep();
        if (creep.fatigue > 0) return -11; //Creep is fatigued

        const step = creep.memory.pathStep;
        const path = creep.memory.path;
      
        if (creep.memory.pathTarget == creep.pos || path == undefined || step == path.length) {
          creep.memory.path = creep.pos.findPathTo(pos, {ignoreCreeps: false});
          creep.memory.pathTarget = pos.pos;
          creep.memory.pathStep = 0;
          return 1; //Path found
        }
      
        if(path != undefined && step != undefined) {
          if (path[step] != undefined) {
            creep.move(path[step].direction);
            creep.memory.pathStep = step + 1;
            return 0; //Function completed as intended
          }
        }
        return -666; //Uh....
    }

    /**
     * Runs the logic for this creep.
     * 
     * @return {Number} 0 - The logic ran successfully.
     */
    runLogic () {
        return 0;
    }

    /**
     * Called to have this creep add itself to the creep counts of their home room.
     */
    countSelf () {

    }
}
