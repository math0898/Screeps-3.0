//Import the creepRole interface
import { Creep_Role, Creep_Prototype } from "CreepTypes/CreepRole";
//Are we debugging?
const debug:boolean = true;
/**
 * This is the class for the Carrier creep. The primary role of the carrier
 * creep is to move resources around the base and into storage or other devices
 * that could use them.
 */
export class Extractor extends Creep_Prototype implements Creep_Role {
  constructor() { super("Extractor"); }

  //Real Methods
  run(creep:Creep){
    Extractor.run(creep);
  }
  static run(creep:Creep){
    if (creep.memory.working == undefined) creep.memory.working = false;
    else if (creep.store.getFreeCapacity() == 0) creep.memory.working = true;
    else if (creep.store.getUsedCapacity() == 0) creep.memory.working = false;

    if (creep.memory.working) {
      if (debug) creep.say("🛢", true);
      var s: ResourceConstant | undefined = undefined;
      for (var i = 0; i < RESOURCES_ALL.length; i++) if (creep.store.getUsedCapacity(RESOURCES_ALL[i]) > 0) {s = RESOURCES_ALL[i]; break;}
      if (creep.room.storage != undefined && s != undefined) if (creep.transfer(creep.room.storage, s) == ERR_NOT_IN_RANGE) this.creepOptimizedMove(creep, creep.room.storage.pos);
    }
    else {
      if (debug) creep.say("🏗", true);
      // if (creep.memory.mineral = undefined) {
      //   var h = creep.pos.findClosestByPath(FIND_MINERALS);
      //   if (h != null) creep.memory.mineral = h.id;
      // }
      // if (creep.memory.mineral != undefined) {
        var m:Mineral | null = creep.pos.findClosestByPath(FIND_MINERALS);
        if (m != null) {
          if (creep.harvest(m) == ERR_NOT_IN_RANGE) creep.moveTo(m.pos);
          else if (creep.harvest(m) == ERR_NOT_FOUND) creep.memory.role = undefined;
          else if (creep.harvest(m) == ERR_NOT_ENOUGH_RESOURCES) creep.memory.working = true;
        }
        // else creep.memory.mineral = undefined;
      // }
    }
  }
}
