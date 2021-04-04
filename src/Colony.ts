//Import tasks
import { task, template } from "task";
//Import rooms
import { struc_Room } from "Room";
//Import the spawn manager
import { SpawnManager } from "SpawnManager";
import { spawn } from "logic.spawn";
import { Queue } from "Queue";
import { VisualsManager } from "VisualsManager";
import { RoomPlanner } from "RoomPlanner";
import { Goals } from "CreepTypes/CreepRole";
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
  roomPlanner:RoomPlanner;

  //Constructors
  constructor(r:Room){
    this.home = r;
    this.era = -1;
    this.homePrototype = new struc_Room(r.name);
    if(r.controller != undefined) if(r.controller.level <= 2) this.era = 0;
    this.spawnManager = new SpawnManager(Game.rooms[this.homePrototype.getRoomRefrence()]);
    this.home.memory.counts = p;
    this.roomPlanner = new RoomPlanner(this.home);
  }

  //Methods
  run(){
    this.home = Game.rooms[this.home.name];
    var h = this.home.find(FIND_HOSTILE_CREEPS);
    if (h != undefined && h.length > 0) {
      var t = this.home.find(FIND_MY_STRUCTURES, {filter: (f) => f.structureType == STRUCTURE_TOWER});
      for (var i = 0; i < t.length; i++){
        // This is legal because of the filter we used.
        // @ts-ignore
        var tower:StructureTower = t[i];
        tower.attack(h[0]);
      }
    }
    var c:ConstructionSite[] | null = this.home.find(FIND_CONSTRUCTION_SITES);
    if(this.roomPlanner.getConstruction() != undefined && c.length == 0) this.roomPlanner.getConstruction()!.pop()!.place();
    //Request a census every 100 ticks
    if(Game.time % 100 == 0) Queue.request(new Run_Census(this));
    if (this.roomPlanner.getDistanceTransform() == undefined) Queue.request(new Calculate_DistanceTransform(this));
    // if (this.roomPlanner.getMinCut() == undefined) {
    //   var pos:RoomPosition[] = [];
    //   var t = this.home.find(FIND_MY_STRUCTURES);
    //   for (var i = 0; i < t.length; i ++) pos.push(t[i].pos);
    //   pos.push(this.home.controller!.pos);
    //   Queue.request(new Calculate_MinCut(this, pos));
    // }
    if (Game.flags["Flood"] != undefined) if (Game.flags["Flood"].room!.name == this.home.name) Queue.request(new Calculate_FloodFill(this, Game.flags["Flood"].pos));
    this.checkGoals();
    //Run the spawn manger.
    spawn(this.home);
    if (Game.flags["Visuals"] != undefined) new VisualsManager().run(this.home.name, this.roomPlanner.getDistanceTransform(), this.roomPlanner.getFloodFill());
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
    this.home.memory.counts["Scout"] = 0;
    this.home.memory.counts["Extractor"] = 0;

    for(let c in Game.creeps){
      var creep:Creep = Game.creeps[c];
      if (creep.memory.room != this.home.name) continue;
      if (creep.memory.role == undefined) this.home.memory.counts["Worker"]++;
      else this.home.memory.counts[creep.memory.role]++;
    }
  }
  /**
   * checkGoals checks the goals of the colony and updates it with new roles
   * which are currently needed.
   */
   checkGoals(){
     var goal:Goals[] = [];
     //Search for a set of objects
     var threashold:number = 3;
     for (var i = 1; i <= this.home.controller!.level; i++) threashold = threashold * 10;
     var w:Structure[] | null = this.home.find(FIND_STRUCTURES, {filter: (c) => (c.structureType == STRUCTURE_RAMPART || c.structureType == STRUCTURE_WALL) && c.hits < threashold});
     var r:Structure[] | null = this.home.find(FIND_STRUCTURES, {filter: (c) => c.hits < c.hitsMax && ( c.structureType != STRUCTURE_WALL && c.structureType != STRUCTURE_RAMPART)});
     var c:ConstructionSite[] | null = this.home.find(FIND_CONSTRUCTION_SITES);
     // var d:Resource[] | null = this.home.find(FIND_DROPPED_RESOURCES, {filter: {resourceType: RESOURCE_ENERGY}});
     var s:Structure[] | null = this.home.find(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0}); //O(7 + 3n)
     //Check the goals that need to be taken
     if (w != null && w.length > 0 && Game.time % 500 == 0) goal.push(Goals.REINFORCE);
     if (r != null && r.length > 0 && Game.time % 500 == 0) goal.push(Goals.FIX);
     if (c != null && c.length > 0 && Game.time % 250 == 0) goal.push(Goals.BUILD);
     if (s != null && s.length > 0 && Game.time % 25 == 0) goal.push(Goals.FILL);
     //Assign the goals to the creeps ^-^
     for (var i = 0; i < goal.length; i++) for (let c in Game.creeps) if (Game.creeps[c].room.name == this.home.name && Game.creeps[c].memory.role == undefined && (Game.creeps[c].memory.goal == undefined || Game.creeps[c].memory.goal == Goals.UPGRADE)) Game.creeps[c].memory.goal = goal.pop();
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

export class Run_Census extends template implements task {
  //Variables
  name:string = "Run Census";
  colony:Colony;

  //Construtor
  constructor(c:Colony){
    super();
    this.colony = c;
  }

  //Methods
  run(){
    this.colony.census();
  }
}

export class Setup_Goals extends template implements task {
  //Variables
  name:string = "Setup Goals";
  colony:Colony;

  //Constructor
  constructor(c:Colony){
    super();
    this.colony = c;
  }

  //Methods
  run(){
    this.colony.checkGoals();
  }
}

export class Calculate_DistanceTransform extends template implements task {
  //Variables
  name:string = "Calculate Distance-transform";
  colony:Colony;

  //Constructor
  constructor(c:Colony){
    super();
    this.colony = c;
  }

  //Methods
  run(){
    if (this.colony.roomPlanner.computeDistanceTransform() != 0) Queue.request(new Calculate_DistanceTransform(this.colony));
  }
}

export class Calculate_FloodFill extends template implements task {
  //Variables
  name:string = "Calculate Flood Fill";
  colony:Colony;
  start:RoomPosition;

  //Constructor
  constructor(c:Colony, p:RoomPosition){
    super();
    this.colony = c;
    this.start = p;
  }

  //Methods
  run(){
    if (this.colony.roomPlanner.computeFloodfill() != 0) Queue.request(new Calculate_FloodFill(this.colony, this.start));
  }
}
// export class Calculate_MinCut extends template implements task {
//   //Variables
//   name:string = "Calculate Min Cut";
//   colony:Colony;
//   protect:RoomPosition[] | undefined;
//
//   //Constructor
//   constructor(c:Colony, p:RoomPosition[] | undefined) {
//     super();
//     this.colony = c;
//     this.protect = p;
//   }
//
//   //Methods
//   run() {
//     if (this.colony.roomPlanner.minCutManager(this.protect) != 0) Queue.request(new Calculate_MinCut(this.colony, undefined));
//   }
// }
