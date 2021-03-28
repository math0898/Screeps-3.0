/**
 * Spawns a defender creep at the given spawn and at the level given.
 * O(c) --> Runs in constant time.
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be produced
 */
function spawnDefender(capacity:number, spawn:StructureSpawn) {
  //The poor mans defender
  if(capacity < 380){
    //Temporaily stores how much energy we've spent on our creep
    var spent = 130; //Starts at 130 since everything has 1 move (50) and 1 attack (80) parts
    //No matter how much energy we have the carrier starts with 2 parts
    var body:BodyPartConstant[] = [MOVE,ATTACK];
    //Add more parts so as not to exceed our energy budget
    while(spent + 130 <= capacity) {body.push(MOVE); body.push(ATTACK); spent += 130;}
  //Budget defender
  } else if (capacity < 430) var body:BodyPartConstant[] = [MOVE,ATTACK,HEAL];
  //Deluxe defender
  else {
    //Temporaily stores how much energy we've spent on our creep
    var spent = 430; //Starts at 430 since everything has 2 move (100), 1 attack (80), and 1 heal (250)
    //No matter how much energy we have the defender starts with 4 parts
    var body:BodyPartConstant[] = [MOVE,MOVE,ATTACK,HEAL];
    //Add more parts so as not to exceed our energy budget
    while(spent + 130 <= capacity) {body.push(MOVE); body.push(ATTACK); spent += 130;}
  }
  //Temp name storing
  var name = '[' + spawn.room.name + '] Defender ' + Game.time;
  //Spawn the defender
  spawn.spawnCreep(body, name, {memory: {room: spawn.room.name, role: 'Defender'}});
}
/**
 * Spawns a claimer creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
// function spawnClaimer(capacity, spawn){
//   //Claimers are easy... basic body
//   var body = [MOVE,CLAIM]; //Cost - 650
//   //Temp name storage
//   var name = '[' + spawn.room.name + '] Claimer ' + Game.time;
//   //Spawn the creep, Increment the claimer count in the room if successful
//   if(spawn.spawnCreep(body,name, {memory: {role: 'claimer', distance: Game.flags['Claim'].room.name}}) == OK) spawn.room.memory.count.claimer++;
// }
/**
 * Spawns a distance harvester creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 * @param targetRoom The room which the distance harvester will be mining in
 */
// function spawnDistanceHarvester(capacity:number, spawn:StructureSpawn, targetRoom:string){
//   //The amount of energy towards our total we've spent
//   var spent = 200; //Starts at 200 since we have 2 move (50) parts and 2 carry (50) parts
//   //The starting body for our distance harvester
//   var body:BodyPartConstant[] = [MOVE,MOVE,CARRY,CARRY];
//   //Add another carry part if we have the space
//   if(capacity > 550) { body.push(CARRY); spent += 50;}
//   //Add work parts until we're out of energy but not to exceed 750 cost
//   while(spent + 100 <= capacity && spent < 750) { body.push(WORK); spent += 100;}
//   //Temp name storing
//   var name = '[' + spawn.room.name + '] Distance Harvester ' + Game.time;
//   //Spawn the creep, Increment the distance harvester count in the room if successful
//   if(spawn.spawnCreep(body, name, {memory: {role: 'distanceHarvester', room: spawn.room.name, distance: targetRoom}}) == OK) spawn.room.meory.count.distanceHarvester++;
// }
/**
 * Spawns a harvester creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
function spawnHarvester(capacity:number, spawn:StructureSpawn){
  //It's important to note that the harvester creep is also used for recovery
  // and as such can't cost more than 300 energy
  //Temp body storing
  var body = [MOVE,MOVE,CARRY,CARRY,WORK]; //Cost - 300
  //Temp name storing
  var name = '[' + spawn.room.name + '] Worker ' + Game.time;
  //Spawn the creep, Increment the harvester count in the room if successful
  if(spawn.spawnCreep(body, name, {memory: {room: spawn.room.name}}) == OK) spawn.room.memory.counts.Worker++;
}
/**
 * Spawns a harvester creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
function spawnBigBoiHarvester(capacity:number, spawn:StructureSpawn){
  if (capacity > 300 + 20 * 50) capacity = 300 + 20*50 //Cap the worker size
  //The amount of energy towards our total we've spent
  var spent = 200; //Starts at 200 since we have 2 move (50) parts and 2 carry (50) parts
  //The starting body for our worker
  var body:BodyPartConstant[] = [MOVE,MOVE,CARRY,CARRY];
  //Add another carry part if we have the space
  while(spent + 50 < capacity/2) { body.push(CARRY); spent += 50;}
  //Add another carry part if we have the space
  while(spent + 50 < capacity*3/5) { body.push(MOVE); spent += 50;}
  //Add work parts until we're out of energy but not to exceed 750 cost
  while(spent + 100 <= capacity ) { body.push(WORK); spent += 100;}
  //Temp name storing
  var name = '[' + spawn.room.name + '] Worker ' + Game.time;
  //Spawn the creep, Increment the harvester count in the room if successful
  if(spawn.spawnCreep(body, name, {memory: {room: spawn.room.name}}) == OK) spawn.room.memory.counts.Worker++;
}
/**
 * Spawns a scout creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
function spawnScout(capacity:number, spawn:StructureSpawn){
  //It's important to note that the scout creep's only purpose is to move and
  // as such its body leaves much to desire
  //Temp body storing
  var body = [MOVE]; //Cost - 50
  //Temp name storing
  var name = '[' + spawn.room.name + '] Scout ' + Game.time;
  //Spawn the creep
  if(spawn.spawnCreep(body, name, {memory: {role: 'Scout', target: Game.flags["Scout"].pos.roomName, room: spawn.room.name}}) == OK) spawn.room.memory.counts.Scout++;
}
/**
 * Spawns a worker creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
function spawnWorker(capacity:number, spawn:StructureSpawn){
  //The amount of energy towards our total we've spent
  var spent = 200; //Starts at 200 since we have 2 move (50) parts and 2 carry (50) parts
  //The starting body for our worker
  var body:BodyPartConstant[] = [MOVE,MOVE,CARRY,CARRY];
  //Add another carry part if we have the space
  while(spent + 50 < capacity/2) { body.push(CARRY); spent += 50;}
  //Add another carry part if we have the space
  while(spent + 50 < capacity*3/5) { body.push(MOVE); spent += 50;}
  //Add work parts until we're out of energy but not to exceed 750 cost
  while(spent + 100 <= capacity ) { body.push(WORK); spent += 100;}
  //Temp name storing
  var name = '[' + spawn.room.name + '] Worker ' + Game.time;
  //Spawn the creep, Increment the upgrader count in the room if successful
  if(spawn.spawnCreep(body, name, {memory: {room: spawn.room.name}}) == OK) spawn.room.memory.counts.Worker++;
}
//Public facing functions
 /**
  * Finds spawns in the room given and runs the logic for what needs to be spawned.
  * Then functions higher up in the file are called to handle the spawning of specifc
  * creeps.
  * Worst case: O(s + t) --> s is the number of spawns
  * Expected case: O(s + t) --> s is the number of spwans, t is the number of buildings
  * Best case: O(s + t) --> s is the number of spawns
  * @param currentRoom The room in which spawning occurs
  */
export function spawn(currentRoom:Room){
    //Check the capacity we can spawn at
    var capacity = 300 + (currentRoom.find(FIND_MY_STRUCTURES,
      {filter: (s) => s.structureType == STRUCTURE_EXTENSION}).length * 50); //O(t)
    //Iterate through spwans in the game
    for(var s in Game.spawns){ //TODO implement spawns into room.memory so this is O(c), current O(s)
      //Why is this harder than it needs to be?
      var spawn:StructureSpawn = Game.spawns[s];
      var hostiles = (spawn.pos.findClosestByRange(FIND_HOSTILE_CREEPS) != undefined);
      //Is the spawn in the room we want?
      if (currentRoom.name == spawn.room.name){
        if(currentRoom.memory.counts.Miner == undefined) {
          currentRoom.memory.counts.Miner = 0;
          currentRoom.memory.counts.Carrier = 0;
          currentRoom.memory.counts.Jumpstart = 0;
          currentRoom.memory.counts.Worker =0;
        }
        //If there are hostiles spawn a defender
        if(hostiles) spawnDefender(capacity, spawn);
        //Check if a harvester creep needs to be spawned, this includes recovery if all creeps die
        else if(currentRoom.memory.counts.Worker < 1) spawnHarvester(capacity, spawn);
        //Check if a carrier creep needs to be spawned, 2 per miner
        // else if(currentRoom.memory.counts.Carrier < currentRoom.memory.counts.Miner * 2) spawnCarrier(capacity, spawn);
        //Check if a miner creep needs to be spawned, 1 per source
        else if(currentRoom.memory.counts.Worker < 10) spawnBigBoiHarvester(capacity, spawn);
        //Check if workers should be spawned, 4 base, // TODO: check if more can be spawned
        else if(currentRoom.memory.counts.Worker < 4) spawnWorker(capacity, spawn);
        //Check if a repair bot should be spawned
        // else if(currentRoom.memory.counts.RepairBot < 1) spawnRepairBot(capacity, spawn);
        //Check if a scout should be spawned
        else if(currentRoom.memory.counts.Scout < 1 && Game.flags["Scout"] != null) spawnScout(capacity, spawn);
        //Check if a claimer should be spawned
        // else if(currentRoom.memory.countClaimer < 1 && Game.flags['Claim'] != undefined) spawnClaimer(capacity, spawn);
        // TODO: reimplement distance harvesters
        // else if(spawn.store.getCapacity(RESOURCE_ENERGY) == 300 && currentRoom.memory.counts.Worker < 8) spawnWorker(capacity,spawn);
     }
   }
  }
