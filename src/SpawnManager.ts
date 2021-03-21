/**
 * This file manages the spawns that need to be completed including the queuing
 * of spawns and handling of when new spawns should happen.
 */
export class SpawnManager {
  //Variables
  room:Room;
  spawns:StructureSpawn[];
  spawnQueue:SpawnQueue;

  //Constructor
  constructor(r:Room){
    //Set the local counterparts
    this.room = r;
    //find the spawns we can use
    this.spawns = this.room.find(FIND_MY_SPAWNS);
    //Make a spawn queue for this manager
    this.spawnQueue = new SpawnQueue(this.spawns);
  }
  /**
   * Runs the SpawnManager which looks for creeps that need to be spawned and
   * adds them to the spawn queue.
   */
  run(){
    this.spawnQueue.print();
    //TODO logic for spawning creeps
    //Run the queue if it isn't empty
    if(!(this.spawnQueue.isEmpty())) this.spawnQueue.run();
  }
}
/**
 * This is a queue which holds creeps that need to be spawned based on their
 * importance.
 */
class SpawnQueue {
  //The spawns the queue has control over
  spawns:StructureSpawn[];
  queue:AbstractSpawnCreep[] = [];

  //Constructor
  constructor(s:StructureSpawn[]){
    this.spawns = s;
  }

  //Accessor methods
  isEmpty(){ return !(this.queue.length > 0); }
  print(){
    for(var i = 0; i < this.queue.length; i++){
      console.log(this.queue[i].role);
    }
  }

  //Methods
  add(c:AbstractSpawnCreep){ this.queue.push(c); }
  run(){
    //Find an unused spawn
    for(var i = 0; i < this.spawns.length; i++){
      //Check if there's anything left, return if there isn't
      if(this.queue[0] == undefined) return;
      //Do this for some nice short hand
      var spawn:StructureSpawn = this.spawns[i];
      //Grab the creep real quick
      var c:AbstractSpawnCreep = this.queue.pop()!;
      console.log((spawn.spawnCreep(c.body, Game.time + "", {dryRun:true})));
      console.log(c.body);
      //Spawn the creep, if we can
      if (spawn.spawnCreep(c.body, Game.time + "", {dryRun:true}) == OK) c.run(spawn);
    }
  }
  contains(r:string){
    for (var i = 0; i < this.queue.length; i++){ if (this.queue[i].role == r) return true; }
    return false;
  }
}
/**
 * This abstract class defines what an item in the queue looks like.
 */
abstract class AbstractSpawnCreep {
  //Variables
  role:string = "";
  capacity:number;
  body:BodyPartConstant[];

  //Constructor
  constructor(c:number){
    this.capacity = c;
    this.body = this.generateBody(c);
  }

  //Methods
  generateBody(_c:number):BodyPartConstant[]{ return [];}
  run(spawn:StructureSpawn, t:string | undefined = undefined) {
    //Try to spawn the creep
    var attempt:number = spawn.spawnCreep(this.body, this.getName(spawn), {memory: {role: this.role, room: spawn.room.name, target: t}});
    //Try to spawn and if it works increment, Increase the count on the home memory counts
    // if( attempt == OK) spawn.room.memory.counts[this.role]++;
    //Spawn the creep and return what it says
    return attempt;
  }
  /**
   * This function defines how creeps are named.
   */
  getName(spawn:StructureSpawn){ return '[' + spawn.room.name + '] '+ this.role + ' ' + Game.time; }
}
/**
 * These are the classes which handle the actual spawning of a creep.
 */
/**
 * Spawns a claimer creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
class SpawnClaimer extends AbstractSpawnCreep {
  //Role Name
  role:string = "Claimer";
  //How the body is generated, claimers are simple
  generateBody(_c:number){ return [MOVE,CLAIM]; }
}
/**
 * Spawns a distance harvester creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 * @param targetRoom The room which the distance harvester will be mining in
 */
class SpawnDistanceHarvester extends AbstractSpawnCreep {
  //Role Name
  role:string = "DistanceHarvester"
  //Target room
  target:string;
  //How to make the call
  constructor(c:number, t:string){
    super(c);
    this.target = t;
  }
  //How the body is generated
  generateBody(c:number){
    //The amount of energy towards our total we've spent
    var spent = 200; //Starts at 200 since we have 2 move (50) parts and 2 carry (50) parts
    //The starting body for our distance harvester
    var body:BodyPartConstant[] = [MOVE,MOVE,CARRY,CARRY];
    //Add another carry part if we have the space
    if(c > 550) { body.push(CARRY); spent += 50;}
    //Add work parts until we're out of energy but not to exceed 750 cost
    while(spent + 100 <= c && spent < 750) { body.push(WORK); spent += 100;}
    //Return the made body
    return body;
  }
  //how the creep is spawned
  run(spawn:StructureSpawn, _t:string | undefined = undefined){ return super.run(spawn, this.target); }
}
/**
 * Spawns a scout creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
class SpawnScout extends AbstractSpawnCreep {
  //Role Name
  role:string = "Scout";
  //Scouting target room
  target:string;
  //How the role is made
  constructor(c:number, t:string){
    super(c);
    this.target = t;
  }
  //How the body is made
  generateBody(_c:number){ return [MOVE]; }
  //Speical call to run
  run(spawn:StructureSpawn, _t:string | undefined = undefined){ return super.run(spawn, this.target); }
}
/**
 * Spawns a worker creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
class SpawnWorker extends AbstractSpawnCreep {
  //Role Name
  role:string = "Worker";
  //How the body is made
  generateBody(c:number){
    //The amount of energy towards our total we've spent
    var spent = 200; //Starts at 200 since we have 2 move (50) parts and 2 carry (50) parts
    //The starting body for our worker
    var body:BodyPartConstant[] = [MOVE,MOVE,CARRY,CARRY];
    //Add another carry part if we have the space
    if(c > 550) { body.push(CARRY); spent += 50;}
    //Add work parts until we're out of energy but not to exceed 750 cost
    while(spent + 100 <= c && spent < 750) { body.push(WORK); spent += 100;}
    //Return the body
    return body;
  }
}
