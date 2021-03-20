//Import the creepRole interface
import { Creep_Role, Creep_Prototype } from "CreepTypes/CreepRole";
/**
 * This is the class for the Carrier creep. The primary role of the carrier
 * creep is to move resources around the base and into storage or other devices
 * that could use them.
 */
export class RepairBot extends Creep_Prototype implements Creep_Role {
  //Variables
  name:string = "RepairBot";

  //Real Methods
  run(creep:Creep){
    RepairBot.run(creep);
  }
  static run(creep:Creep){
    //Check if we're full on energy
    if (creep.carry.energy == creep.carryCapacity) creep.memory.working = true;
    //If we're out of energy obtain more
    else if (creep.carry.energy == 0 || creep.memory.working == undefined) creep.memory.working = false;
    //Lets Spend some energy
    if(creep.memory.working) {
      //We should fill up buildings
      super.creepRepair(creep);
    }
    //Lets get some energy
    else {
      //Got harvest
      super.creepPickup(creep); //O(n)
    }
  }
}
