//Import the creepRole interface
import { Creep_Role, Creep_Prototype } from "CreepTypes/CreepRole";
//Are we debugging?
const debug:boolean = true;
/**
 * This is the class for the Carrier creep. The primary role of the carrier
 * creep is to move resources around the base and into storage or other devices
 * that could use them.
 */
export class Miner extends Creep_Prototype implements Creep_Role {
  constructor() { super("Miner"); }

  //Real Methods
  run(creep:Creep){
    Miner.run(creep);
  }
  static run(creep:Creep) {
    if (creep.memory.sources == undefined) var s:Source[] | undefined = creep.room.find(FIND_SOURCES_ACTIVE);
    if (s != undefined) {
      var t: Source = s[0];
      for (var i = 1; i < s.length; i++) if (s[i].energy > t.energy) t= s[i];
    }
    Creep_Prototype.creepHarvest(creep);
  }
}
