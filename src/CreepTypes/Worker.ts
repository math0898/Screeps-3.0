//Import the creepRole interface
import { Creep_Role, Creep_Prototype } from "CreepTypes/CreepRole";
//Are we debugging?
const debug:boolean = true;
/**
 * This is the class for the Worker creep. Workers switch between building and
 * upgrading depending on whether there are construction sites or note.
 * Generally speaking workers will spend most of their time building.
 */
export class Worker extends Creep_Prototype implements Creep_Role {
  //Variables
  name:string = "Worker";

  //Constructor
  constructor(){super();}

  //Real Methods
  run(creep:Creep){
    Worker.run(creep);
  }
  static run(creep:Creep){
    //Check if we're full on energy
    if (creep.carry.energy == creep.carryCapacity) creep.memory.working = true;
    //If we're out of energy obtain more
    else if (creep.carry.energy == 0 || creep.memory.working == undefined) creep.memory.working = false;
    //Lets Spend some energy
    if(creep.memory.working) {
      var t = creep.room.find(FIND_CONSTRUCTION_SITES);
      //Build
      if(t != undefined && t.length > 0) creep.memory.build = true;
      else creep.memory.build = false;
      //We're building
      if (creep.memory.build) super.creepBuild(creep);
      //We're upgrading
      else super.creepUpgrade(creep);
    }
    //Lets get some energy
    else {
      //Are there miners?
      if(creep.room.memory.counts["Miner"] > 0){
        //Got harvest
        super.creepPickup(creep); //O(n)
        //We're mining ourselves
      } else {
        //Got harvest
        super.creepHarvest(creep); //O(n)
      }
    }
  }
}
