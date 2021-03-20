//Import the creepRole interface
import { Creep_Role, Creep_Prototype } from "CreepTypes/CreepRole";
//Are we debugging?
const debug:boolean = true;
/**
 * This is the class for the JumpStart creep. The primary job of the JumpStart
 * creep is to push the RCL from 1 to 2 or to fill extensions in case the colony
 * dies It is mostly static as it simply needs to act on harvester creeps
 *instead of storing them in cache as an object.
 */
export class JumpStart extends Creep_Prototype implements Creep_Role {
  //Variables
  name:string = "Jumpstart";

  //Constructor
  constructor(){super();}

  //Real Methods
  run(creep:Creep){
    JumpStart.run(creep);
  }
  static run(creep:Creep){
    //Check if we're full on energy
    if (creep.carry.energy == creep.carryCapacity) creep.memory.working = true;
    //If we're out of energy obtain more
    else if (creep.carry.energy == 0 || creep.memory.working == undefined) creep.memory.working = false;
    //Lets Spend some energy
    if(creep.memory.working) {
      //We're working
      if(debug) creep.say('⚙', true);
      //If we're level one, upgrade the controller
      if(creep.room.controller!.level == 1) super.creepUpgrade(creep); //O(c)
      //We should otherwise fill up buildings
      else super.creepFill(creep);
    }
    //Lets get some energy
    else {
      //We're mining
      if(debug) creep.say('⛏', true);
      //Got harvest
      super.creepHarvest(creep); //O(n)
    }
  }
}
