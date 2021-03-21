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
  goals:string[] = [];
  neighborsPrototype?:struc_Room[];
  homePrototype:struc_Room;
  spawnManager:SpawnManager;
  construction:ConstructionProject[];
  constructionStage:number;

  //Constructors
  constructor(r:Room){
    this.home = r;
    this.era = -1;
    this.homePrototype = new struc_Room(r.name);
    if(r.controller != undefined) if(r.controller.level <= 2) this.era = 0;
    this.spawnManager = new SpawnManager(Game.rooms[this.homePrototype.getRoomRefrence()]);
    this.home.memory.counts = p;
    this.construction = [];
    this.constructionStage = 0;
  }

  //Methods
  run(){
    //Do construction projects
    if(this.constructionStage == 0) {
      for(let s in Game.spawns){
        if(Game.spawns[s].room.name == this.home.name){
          var train = Game.spawns[s];
          var sources = train.room.find(FIND_SOURCES);
          for(var i = 0; i < sources.length; i++) {
            var path = train.pos.findPathTo(sources[i]);
            for(var j = 0; j < path.length -1; j++){
              this.construction.push(new ConstructionProject(new RoomPosition(path[j].x, path[j].y, train.room.name), STRUCTURE_ROAD));
            }
            path = sources[i].pos.findPathTo(sources[i].room.controller!);
            for(var j = path.length -2 ; j >= 0; j--){
              this.construction.push(new ConstructionProject(new RoomPosition(path[j].x, path[j].y, train.room.name), STRUCTURE_ROAD));
            }
          }
          var path = train.pos.findPathTo(train.room.controller!);
          for(var j = 0 ; j < path.length -1; j++){
            this.construction.push(new ConstructionProject(new RoomPosition(path[j].x, path[j].y, train.room.name), STRUCTURE_ROAD));
          }
        }
      }
      this.constructionStage++;
    }

    //Reset the goals
    this.goals = []
    //Search for a set of objects
    var r:Structure[] | null = this.home.find(FIND_STRUCTURES, {filter: (c) => c.hits < c.hitsMax && c.structureType != STRUCTURE_WALL});
    var c:ConstructionSite[] | null = this.home.find(FIND_CONSTRUCTION_SITES);
    var d:Resource[] | null = this.home.find(FIND_DROPPED_RESOURCES, {filter: {resourceType: RESOURCE_ENERGY}});
    var s:Structure[] | null = this.home.find(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0}); //O(7 + 3n)

    this.goals.push("Upgrade","Upgrade","Upgrade","Upgrade","Upgrade","Upgrade","Upgrade","Upgrade","Upgrade","Upgrade","Upgrade","Upgrade","Upgrade","Upgrade","Upgrade","Upgrade");
    if(c != null && c.length > 0) this.goals.push("Build","Build","Build","Build")
    if(r != null && r.length > 0) this.goals.push("Fix","Fix");
    if(s != null && s.length > 0) this.goals.push("Fill","Fill","Fill","Fill","Fill");

    if (Game.time % 100 == 0) this.census();
    //Run the spawn manger.
    spawn(this.home);


    if(this.construction.length > 0 && c.length == 0) this.construction.pop()!.place();
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
      this.home.memory.counts["Worker"]++;
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

class ConstructionProject {
  pos:RoomPosition;
  type:BuildableStructureConstant;
  constructor(p:RoomPosition, t:BuildableStructureConstant){
    this.pos = p;
    this.type = t;
  }

  place(){
    Game.rooms[this.pos.roomName].createConstructionSite(this.pos, this.type)
  }
}
