/**
 * Import the room prototype so we can look at some information.
 */
import { RoomPrototype } from "Room";
/**
 * One spawn manager per colony and it handles the spawning of the colony's
 * creeps.
 */
export class SpawnManager {
  /**
   * The stack which contains all the CreepSpawn objects.
   */
  private stack:CreepSpawn[] = [];
  /**
   * We need the room prototype to get to the room and access information there.
   */
  private roomPrototype:RoomPrototype;
  /**
   * Constructs a spawnManager object which has a refrence to the home room
   * containing the spawns it will need in the future.
   */
  constructor(r:RoomPrototype){
    this.roomPrototype = r;
  }
}
/**
 * Specifications for the creep being spawned including its role, body, and name.
 */
class CreepSpawn {
  /**
   * The role of the prospective creep. If undefined worker class is assumed.
   */
  role?:string;
  /**
   * The body of the prospective creep.
   */
  body?:BodyPartConstant[];
  /**
   * The name of the prospective creep. Dependent on role.
   */
  name?:string;
}
