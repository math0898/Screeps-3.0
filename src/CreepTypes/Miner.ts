//Import the creepRole interface
import { Creep_Role, Creep_Prototype } from "CreepTypes/CreepRole";
/**
 * This is the class for the Miner creep. The primary job of the Miner creep is
 * to mine sources until they are empty. This usually takes 5 work parts,
 * sometimes more depending on how long it takes the miner to move.
 */
export class Miner extends Creep_Prototype implements Creep_Role {
  //Variables
  name:string = "Miner";

  //Constructor
  constructor(){super();}

  //Real Methods
  run(creep:Creep){
    Miner.run(creep);
  }
  static run(creep:Creep){
    //Got harvest
    super.creepHarvest(creep); //O(n)
  }
}
