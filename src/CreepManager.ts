//Import the queue so we can request tasks, priority so we can set priority
import { Queue } from "Queue";
//Import the roles
import { Creep_Role, Creep_Prototype } from "CreepTypes/CreepRole";
import { Scout } from "CreepTypes/Scout";
import { Defender } from "CreepTypes/Defender";
//Array indexed by a string which corrosponds to creep role object
interface IDictionary { [index: string]: Creep_Role; }
var params = {} as IDictionary;
params["Scout"] = new Scout();
params["Defender"] = new Defender();
/**
 * This is the creep manager class. It is mostly static and handles the
 * management of creeps including their AI and memory.
 */
export class CreepManager{
  //Variables

  //Constructors
  constructor(){
    //Set the last time we cleaned memory to the anchient times
    Memory.lastCreepClean = 0;
  }

  //Accessor methods

  //Real methods
  /**
   * Runs the creep manager class. Static as it has nothing it needs to modify
   * on the object.
   * Runtime: O(c) ---> Runs in constant time.
   */
  static run(){
    //Start at 6,000 ticks and increment down. Request a clean based on how long ago it was
    for(var i = 4; i > 0; i--) if(Game.time - Memory.lastCreepClean >= 1500 * i || Memory.lastCreepClean == undefined) { Queue.request(new cleanMemory_CreepManager(), i * 25); console.log("Requested memory clean"); break; }
  }
  static runCreepsAI(){
    //Iterate through creeps
    for(let c in Game.creeps){
      //Short hand
      var creep:Creep = Game.creeps[c];
      //Check if the creep is spawning
      if (creep.spawning) break;
      //If the creep has a defined role run that role's AI
      if(creep.memory.role != undefined) params[creep.memory.role].run(creep);
      //Run the creep generalized AI
      else Creep_Prototype.run(creep);
      //Check the creep's life
      Creep_Prototype.checkLife(creep);
    }
  }
  /**
   * Clears the memory of dead creeps.
   * Runtime: O(n) ---> n is the number of creeps.
   */
  static cleanMemory(){
    //Iterate through creeps and check if they're alive, if they're not clean the memory
    for (var c in Memory.creeps) if(!Game.creeps[c]) delete Memory.creeps[c]; //O(n)
    //Set the last clean date to right now
    Memory.lastCreepClean = Game.time;
  }
}
//Import the tasks interface
import { task, template } from "task";
/**
 * The run CreepManager task runs the logic for the CreepManager which requests
 * other tasks that need to be completed in the future.
 */
export class run_CreepManager extends template implements task {
  //Variables
  name:string = "Run The Creep Manager";

  //Real Methods
  run(){
    //Simple enough I'd say
    CreepManager.run();
  }
}
/**
 * The creepAI CreepManager task runs the ai for all the creeps.
 */
export class creepAI_CreepManager extends template implements task {
  //Variables
  name:string = "Run Creep AI";

  //Real Methods
  run(){
    //Simple enough I'd say
    CreepManager.runCreepsAI();
  }
}
/**
 * The clean memory task clears the memory of any old creeps so they don't clog
 * it up too much in the future.
 */
export class cleanMemory_CreepManager extends template implements task {
  //Variables
  name:string = "Clean Creep Memory";

  //Real Methods
  run(){
    //Simple enough I'd say
    CreepManager.cleanMemory();
  }
}
