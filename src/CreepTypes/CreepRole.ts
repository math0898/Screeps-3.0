/**
 * This boolean tells whether creeps should report what they are doing or not.
 */
var debug:boolean = true;
/**
 * Should the debug messages be sent to everyone?
 */
var publicDebug:boolean = true;
/**
 * This is an abstract class which holds of lot of useful utility functions for
 * creep roles in general. This class includes an optimized movement method, and
 * short hands for common tasks such as mining and filling containers. Creep
 * roles should all extend this class and implement the interface bellow in this
 * file.
 */
export abstract class Creep_Prototype {
  /**
   * This is the role string which holdes the name of the role being defined.
   * Since this is the abstract class it is empty, but all other classes which
   * extend this one should add an appropriate role string.
   */
  role:string = "";

  /**
   * getRole retruns the role stored in the role string of the object.
   * Runtime: O(1)
   */
  getRole(){
    //This aint rocket science, return the role
    return this.role; //O(1)
  }
  /**
   * The compareRoomPos() function takes two room positions and compares them.
   * It returns true if and only if they are equal. If either are undefined the
   * function returns false.
   * Runtime: O(2) -> O(6)
   * @param a - The first room to compare
   * @param b - The second room to compare
   */
  private static compareRoomPos(a?:RoomPosition, b?:RoomPosition){
    //Check if both parameters are defined
    if(a != undefined && b != undefined){ //O(1)
      //Check the x positions
      if(a.x != b.x) return false; //O(3)
      //Check the y positions
      if(a.y != b.y) return false; //O(4)
      //Check the room names
      if(a.roomName != b.roomName) return false; //O(5)
      //Then the positions are equal
      return true; //O(6)
    //One of the parameters is undefined, return false.
    } else return false; //O(2)
  }
  /**
   * This is a small utility function which when called on a creep checks how
   * much longer they have to life. If it is equal to some threashold then the
   * count in the room memory for that creep is reduced.
   * Runtime: O(1) -> O(5)
   * @param creep - The creep's life to check
   */
   static checkLife(creep:Creep) {
     //Check how long the creep has to live
     if(1 == creep.ticksToLive) { //O(1)
       //Decrease if it's one
       Game.rooms[creep.memory.room].memory.counts[creep.memory.role]--; //O(5)
     }
   }
  /**
   * creepOptimizedMove optimizes the movement that creeps do. This is primarly
   * done but greatly reducing the number of times a creep recalcualtes its
   * pathing. It works well between rooms, judging from slack it works way
   * better than the default moveTo(pos) for multiple rooms. I don't know why
   * this is... it just happens to be. Should not be used for actions that
   * require very reponsive creep movement such as combat!
   * Runtime: O(2) -> O(7) -> O(19 + c)
   * Note: It is unknown how many calculations RoomPosition.findPathTo() is
   * making so its denoted as 'c'.
   * @param creep - The creep being moved
   * @param target - The target position you want the creep to reach.
   */
  static creepOptimizedMove(creep:Creep, target:RoomPosition){
    //If the creep is fatigued exit
    if (creep.fatigue > 0) return; //O(2)
    //Check if there's a path for this position or if we've reached the end of one
    if (!(this.compareRoomPos(creep.memory.pathTarget, target)) || creep.memory.pathStep == creep.memory.path?.length) { //O(10)
      //Generate a path and save it to memory
      creep.memory.path = creep.pos.findPathTo(target, {ignoreCreeps: false}); //O(11 + c), c is based on how many calculations are being done by findPathTo()
      //Update the target of the path saved in memory
      creep.memory.pathTarget = target; //O(12 + c)
      //Start our step counter from 0
      creep.memory.pathStep = 0; //O(13 + c)
    }
    //Read memory
    var step:number | undefined = creep.memory.pathStep; //O(2) -> O(14 + c)
    var path:PathStep[] | undefined = creep.memory.path; //O(3) -> O(15 + c)
    //Quickly make some basic checks that we can actually move
    if(path != undefined && step != undefined) { //O(5) -> O(17 + c)
      //Move the creep and increase the step
      creep.move(path[step].direction); //O(6) -> O(18 + c)
      creep.memory.pathStep!++; //O(7) -> O(19 + c)
    }
  }
  /**
   * The method creepFill makes the given creep fill nearby strucutres. The
   * strucuture it fills is determined by findClosestByPath.
   * Runtime: O(5) -> O(9) -> O(15 + 3n)
   * Note: n comes from the use of the RoomPosition.find method.
   * @param creep The creep actions are taken on
   */
  static creepFill(creep:Creep){
    //Send a message saying we're filling if we are
    if (debug) creep.say('⚙ ⛴', publicDebug); //O(2)
    //Check to see if we have a target defined
    if (creep.memory.emptyStructure == undefined){ //O(3)
      //Find the nearest strucutre without full energy
      var s = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0}); //O(7 + 3n)
      //Set memory if s is not null
      if (s != null) creep.memory.emptyStructure = s.id; //O(9 + 3n)
    }
    //Make sure we have a target structure before going on
    if (creep.memory.emptyStructure != undefined){ //O(4) -> O(10 + 3n)
      //Read memory
      var x:StructureExtension | StructureSpawn | null = Game.getObjectById(creep.memory.emptyStructure); //O(5) -> O(11 + 3n)
      //Check if the structure exists
      if (x != null && x!.store.getFreeCapacity(RESOURCE_ENERGY) != 0) {  //O(7) -> O(13 + 3n)
        //Check if we're near the structure and move to it if we aren't
        if (!(creep.pos.isNearTo(x))) this.creepOptimizedMove(creep, x.pos); //O(8) -> O(14 + 3n), O(15) -> O(21 + 3n)
        //Transfer the resource
        else creep.transfer(x, RESOURCE_ENERGY); //O(9) -> O(15 + 3n)
      //If the structure is null reset the memory
    } else creep.memory.emptyStructure = undefined; //O(5) -> O(11 + 3n)
    }
  }
  //TODO Runtime analysis
  /**
   * Makes the creep look for and pickup nearby resources. Defaults to energy
   * however one can be specified in the function call.
   * Runtime: O(n) ---> n is the number of dropped resources
   */
  static creepPickup(creep:Creep, filter:string = RESOURCE_ENERGY){
    //Say we're picking stuff up
    if(debug) creep.say('♻', publicDebug);
    //Check if dropped is undefined
    if (creep.memory.droppedResource == undefined) {
      //Find nearby dropped resources of type filter
      var d:Resource | null = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: {resourceType: filter}}); //O(n)
      //Set dropped resoucres if d is not null
      if (d != null) creep.memory.droppedResource = d.id;
    }
    //Make sure dropped is defined before moving on
    if (creep.memory.droppedResource != undefined) {
      //Read memory
      var d:Resource | null = Game.getObjectById(creep.memory.droppedResource);
      //Check if the resource exists
      if (d != null) {
        //Check if we're near the resource and move to it if we aren't
        if (!(creep.pos.isNearTo(d))) this.creepOptimizedMove(creep, d.pos);
        //Pickup the resource
        else creep.pickup(d);
      } else {
        //We didn't get anything back from the Game.getObjectById so reset the id
        creep.memory.droppedResource = undefined;
      }
    }
  }
  /**
   * Makes the creep mine the nearest source.
   * Runtime: O(n) ---> n is the number of sources.
   */
  static creepHarvest(creep:Creep){
    //Say we're harvesting
    if(debug) creep.say('⛏', publicDebug);
    //check if sources is undefined
    if (creep.memory.sources == undefined) {
      //Find the active sources
      var t = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE); //O(n)
      //Set sources if t is not null
      if (t != null) creep.memory.sources = t.id;
    }
    //Make sure source is defined before moving on
    if (creep.memory.sources != undefined) {
      //Read memory
      var s:Source | null = Game.getObjectById(creep.memory.sources);
      //Check if there exists a source
      if(s != null && s.energy != 0) {
        //Check if we're near the source and move to it if we aren't
        if (!(creep.pos.isNearTo(s))) this.creepOptimizedMove(creep, s.pos);
        //Harvest the source
        else creep.harvest(s);
      } else {
        creep.memory.sources = undefined;
      }
    }
  }
  /**
   * Makes the creep upgrade the controller of the current room.
   * Runtime: O(c) ---> runs in constant time.
   */
  static creepUpgrade(creep:Creep){
    //Say we're upgrading
    if(debug) creep.say('⚙ 🕹', publicDebug)
    //Read the room controller
    var r:StructureController  | undefined = creep.room.controller;
    //Make sure r is defined
    if(r != undefined){
      //Check if we're in range of the controller, and move towards if we're not
      if (!(creep.pos.inRangeTo(r, 3))) this.creepOptimizedMove(creep, r.pos);
      //Upgrade the controller
      else creep.upgradeController(r);
    }
  }
  /**
   * Makes the creep build the nearest construction site.
   * Runtime: O(c) ---> runs in constant time.
   */
  static creepBuild(creep:Creep) {
    //Say we're building
    if(debug) creep.say('⚙ ⚒', publicDebug)
    //check if building is undefined
    if (creep.memory.building == undefined) {
      //Find the nearest site
      var b:ConstructionSite | null = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES); //O(n)
      console.log(b);
      //Set building if b is not null
      if (b != null) creep.memory.building = b.id;
    }
    //Make sure building is defined before moving on
    if (creep.memory.building != undefined) {
      //Read memory
      var b:ConstructionSite | null = Game.getObjectById(creep.memory.building);
      //Check if there exists a building
      if(b != null) {
        //Check if we're near the source and move to it if we aren't
        if (!(creep.pos.inRangeTo(b, 3))) this.creepOptimizedMove(creep, b.pos);
        //Harvest the source
        else creep.build(b);
      } else {
        //We need to find a new construction site
        creep.memory.building = undefined;
      }
    }
  }
  /**
   * This method makes the creep attack the passed through enemy.
   * Runtime: O(c) ---> Runs in constant time.
   */
  static creepMelee(creep:Creep, victim:Creep){
    //Say we're building
    if(debug) creep.say('⚔', publicDebug)
    //Move to the creep we're attacking, visualize the path and refresh often
    if(!(creep.pos.isNearTo(victim.pos))) creep.moveTo(victim.pos, {reusePath: 0, visualizePathStyle: {}});
    //Attack them! grr!
    else creep.attack(victim);
  }
  /**
   * This method makes the creep repair buildings who are low on health.
   * Runtime: O(c) ---> Runs in constant time.
   */
  static creepRepair(creep:Creep){
    //Say we're building
    if(debug) creep.say('⚙ ⛓', publicDebug)
    //check if building is undefined
    if (creep.memory.repair == undefined) {
      //Find the nearest site
      var b:Structure | null = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (c) => c.hits < c.hitsMax && c.structureType != STRUCTURE_WALL}); //O(n)
      console.log(b);
      //Set building if b is not null
      if (b != null) creep.memory.repair = b.id;
    }
    //Make sure building is defined before moving on
    if (creep.memory.repair != undefined) {
      //Read memory
      var b:Structure | null = Game.getObjectById(creep.memory.repair);
      //Check if there exists a building
      if(b != null) {
        //Check if we're near the source and move to it if we aren't
        if (!(creep.pos.inRangeTo(b, 3))) this.creepOptimizedMove(creep, b.pos);
        //Harvest the source
        else creep.repair(b);
      } else {
        //We need to find a new construction site
        creep.memory.repair = undefined;
      }
    }
  }
}

/**
 * This interface extends the CreepRole class requiring a few things from the
 * roles ensuring functionality.
 */
export interface Creep_Role extends Creep_Prototype {
  //Real methods
  run(creep:Creep):void
}
