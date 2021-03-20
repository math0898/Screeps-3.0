//Import tasks
import { task, template } from "task";
//Import rooms
import { struc_Room } from "Room";
//Import the spawn manager
import { SpawnManager } from "SpawnManager";
import { spawn } from "logic.spawn";
interface IDictionary { [index: string]: number; }
var p = {} as IDictionary;
/**
 * A colony is a small collection of rooms. Each colony has a number of creeps
 * it needs to spawn to be functional.
 */
export class Colony{
  era:number;
  home:Room;
  neighbors?:Room[];
  neighborsPrototype?:struc_Room[];
  homePrototype:struc_Room;
  spawnManager:SpawnManager;

  //Constructors
  constructor(r:Room){
    this.home = r;
    this.era = -1;
    this.homePrototype = new struc_Room(r.name);
    if(r.controller != undefined) if(r.controller.level <= 2) this.era = 0;
    this.spawnManager = new SpawnManager(Game.rooms[this.homePrototype.getRoomRefrence()]);
    this.home.memory.counts = p;
  }

  //Methods
  run(){
    if (Game.time % 100 == 0) this.census();
    //Run the spawn manger.
    spawn(this.home);
  }

  /**
   * This method runs a quick census of all the creeps and updates the memory in
   * this.home to their numbers.
   */
  census(){
    this.home.memory.counts["Miner"] = 0;
    this.home.memory.counts["Carrier"] = 0;
    this.home.memory.counts["Jumpstart"] = 0;
    this.home.memory.counts["Worker"] = 0;
    this.home.memory.counts["RepairBot"] = 0;

    for(let c in Game.creeps){
      var creep:Creep = Game.creeps[c];
      if (creep.memory.room != this.home.name) continue;
      this.home.memory.counts[creep.memory.role]++;
    }
  }
}

export class Run_Colony extends template implements task {
  //Variables
  name:string = "Run Colony";
  colony:Colony;

  //Constructor
  constructor(c:Colony){
    super();
    this.colony = c;
  }

  //Methods
  run(){
    this.colony.run();
  }
}
