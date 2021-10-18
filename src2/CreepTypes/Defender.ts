//Import the creepRole interface
import { Creep_Role, Creep_Prototype } from "CreepTypes/CreepRole";
//Are we debugging?
const debug:boolean = true;
/**
 * This is the class for the Carrier creep. The primary role of the carrier
 * creep is to move resources around the base and into storage or other devices
 * that could use them.
 */
export class Defender extends Creep_Prototype implements Creep_Role {
  constructor() { super("Defender"); }

  //Real Methods
  run(creep:Creep){
    Defender.run(creep);
  }
  static run(creep:Creep){
    //Find hostile creeps
    var h = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    //Check if there are some
    if(h != undefined){
      //Attack!!
      super.creepMelee(creep, h);
    } else {
      //No enemies
      if(debug) creep.say('🛏︎', true);
    }
  }
}
