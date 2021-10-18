//Import the creepRole interface
import { Creep_Role, Creep_Prototype } from "CreepTypes/CreepRole";
/**
 * This is the class for the JumpStart creep. The primary job of the JumpStart
 * creep is to push the RCL from 1 to 2 or to fill extensions in case the colony
 * dies It is mostly static as it simply needs to act on harvester creeps
 *instead of storing them in cache as an object.
 */
export class Scout extends Creep_Prototype implements Creep_Role {
  constructor() { super("Scout"); }

  //Real Methods
  run(creep:Creep){
    Scout.run(creep);
  }
  static run(creep:Creep){
    //Scouts need to say things
    creep.say('🛰', true);
    //Scouts are simple... move to the scout target
    if(creep.memory.target != undefined) Creep_Prototype.creepOptimizedMove(creep, new RoomPosition(25, 25, creep.memory.target));
    //Else the mission is complete
    else creep.suicide();
  }
}
