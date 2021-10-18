/**
 * This file contains the definitions for the Room class which defines a room,
 * whether hostile or not and assigns it certain properties.
 * @Author Sugaku, math0898
 */
/**
 * This enum holds definitions for the states that a room can be in.
 */
enum state {
  ALLIED = "allied", //todo : implement in findRoomState()
  CONTROLLED = "controlled",
  HOSTILE = "hostile",
  EXPAND = "expand", //Potential expansion possible
  MINE = "mine", //Potential mining location
  UNKOWN = "unkown"
}
/**
 * The room class. Handles information about rooms.
 */
export class RoomPrototype {
  //Variables
  roomRefrence: string; //Holds the refrence to the room, example "W32N6"
  roomState: state; //Holds the current state of the room, example "ALLIED"
  roomLevel?: number; //Holds the controller level of the current room
  roomOwner?: string; //Holds the owner of the room
  roomSpawns: StructureSpawn[];
  creepCount: number;

  //Constructors
 /**
  * Constructs a room when given a hash for Game.rooms.
  * Runtime: O(f) ---> find command used.
  */
  constructor(name: string){
    //Refrence which points to the room in the future
    this.roomRefrence = name;
    //The current state of the room.
    this.roomState = this.findRoomState(); //O(f) ---> find command used.
    //Short hand the room name so we don't need to type that out all the time.
    const r = Game.rooms[name];
    //Check if the controlled is defined, if so set the level to it.
    if (r.controller != undefined) this.roomLevel = r.controller.level;
    //Otherwise set level to -1, there is no controller.
    else this.roomLevel = -1;
    //The owner of the room... is possible to be undefined in which case :shrug:
    this.roomOwner = r.controller?.owner?.username;
    //Set the spawn arrays
    this.roomSpawns = Game.rooms[this.roomRefrence].find(FIND_MY_SPAWNS);
    //Reset the total creep count for the room
    this.creepCount = 0;
    //Count the number of creeps which have this room as a refrence
    for(let c in Game.creeps){
      //Check if their memory has a refrence to the room and increment if it does
      if (Game.creeps[c].memory.room == this.roomRefrence && Game.creeps[c] != undefined) this.creepCount++;
    }
  }

  //Acessor methods
  /**
   * Returns the refrence to the room.
   * Runtime: O(c) ---> Runs in constant time.
   */
  getRoomRefrence(){ return this.roomRefrence; }
  /**
   * Returns the current state of the room.
   * Runtime: O(c) ---> Runs in constant time.
   */
   getRoomState(){ return this.roomState; }
  /**
   * Returns the current level of the room.
   * Runtime: O(c) ---> Runs in constant time.
   */
   getRoomLevel(){ return this.roomLevel; }
  /**
   * Prints the stats about the room in a nice human readable format.
   * Runtime: O(c) ---> Runs in constant time.
   */
   print(){
     //Print a nice header
     console.log("---- Room[" + this.roomRefrence + "] ----");
     //Print the current state of the room
     console.log("Room State: " + this.roomState);
     //Print the level of the room
     console.log("Room Level: " + this.roomLevel);
     //Print the owner of the room
     console.log("Room Owner: " + this.roomOwner);
     //Print the main spawn
     console.log("Main Room Spawn: " + this.roomSpawns[0].name);
   }

  //Real methods
  /**
   * Returns the state of the room after finding it.
   * Runtime: O(f) ---> find command used.
   * @param r The room which's type is being checked. Defaults to this object.
   */
  findRoomState(r: RoomPrototype = this){
    //Make this const so we can call methods fewer times.
    const room = Game.rooms[r.getRoomRefrence()];
    //If the controller is not undefined...
    if(room.controller != undefined){
      //Check if we own the controller, and return we control the room if we do.
      if (room.controller.my) return state.CONTROLLED;
      //If the room has a defined owner, and its not mine, its probably hostile.
      else if (room.controller.owner != undefined) return state.HOSTILE; //todo: More logic here for allies.
      //The room is unclaimed.
      else {
        //Scan for sources
        var s: any[] = room.find(FIND_SOURCES); //O(f) --> find command used.
        //If there's one source it could make a mine.
        if (s.length == 1) return state.MINE;
        //If there's two sources it could make a good expansion.
        else if (s.length == 2) return state.EXPAND;
      }
    }
    //The state of the room is unknown.
    return state.UNKOWN;
   }
   /**
    * Updates the room information.
    * Runtime: O(f) ---> find command used.
    */
  updateRoom(){
    //Find the current room state and update it.
    this.roomState = this.findRoomState(); //O(f) ---> find command used.
    //Check if a controller is defined
    if(Game.rooms[this.roomRefrence].controller != undefined){
      //Update the room level to the controller level
      this.roomLevel = Game.rooms[this.roomRefrence].controller?.level;
      //If there's a controller there can be spawns
      //Reset the current spawns
      this.roomSpawns = [];
      //Find my spawns and set room spawns
      this.roomSpawns = Game.rooms[this.roomRefrence].find(FIND_MY_SPAWNS);
    }
    //Reset the total creep count for the room
    this.creepCount = 0;
    //Count the number of creeps which have this room as a refrence
    for(let c in Game.creeps){
      //Check if their memory has a refrence to the room and increment if it does
      if (Game.creeps[c].memory.room == this.roomRefrence) this.creepCount++;
    }
  }
}
/**
 * This file contains declartions of tasks that are related to the Room class.
 * @Author Sugaku, math0898
 */
//Import the task interface
import { task, template } from "task";;
/**
 * The init_Rooms task which initializes all the rooms current visible in
 * Game.rooms. It is a fairly costly task and so shouldn't be run much.
 * Runtime: O(r * f) --> find is used at most once per room in Game.rooms
 */
export class init_Rooms extends template { //todo: rework the way rooms[] works
  //Varaibles
  //The rooms array which we're initalizing
  rooms?:RoomPrototype[];
  //Constructors
 /**
  * Takes the room array where the intialized rooms should be placed. WARN! This
  * will overwrite any data currently here!
  * @param rooms The room array to store the data in.
  */
  constructor(rooms?:RoomPrototype[]){
    //Call super
    super("Initalize Rooms");
    //Set localized counter part
    this.rooms = rooms;
  }

  //Real methods
  run(){
    //Reset rooms to a blank array
    this.rooms = [];
    //Setup a short hand for rooms
    for (let name in Game.rooms){
      //Assign it because well this is kind of annoying
      var r: Room = Game.rooms[name];
      //Now push the rooms into the array one by one
      this.rooms.push(new RoomPrototype(r.name));
    }
    return this.rooms;
  }
}
/**
 * The update_Rooms task updates all the rooms currently initalized in the given
 * array at construction.
 * Runtime: O(r * f) --> find is used at most once per room in Game.rooms
 */
export class update_Rooms extends template implements task {
  //Variables
  //The rooms array which we're updating
  rooms:RoomPrototype[];

  //Constructors
 /**
  * Makes an update_Rooms task.
  * @param rooms The room array to be updated.
  */
  constructor(rooms:RoomPrototype[]){
    //Call super
    super("Update Rooms");
    //Set localized counter part
    this.rooms = rooms;
  }

  //Real methods
 /**
  * Updates all the rooms in the current array. It does not add new rooms.
  * Runtime: O(r * f) ---> Uses the find command for each room.
  */
  run(){
    //Check if rooms is undefined
    if (this.rooms == undefined) {
      console.log("Could not update rooms");
      return;
    }
    //Iterate down the array and call update room.
    for (var i = 0; i < this.rooms.length; i++) this.rooms[i].updateRoom(); //O(r * f)
  }
}
/**
 * The print_Rooms task prints all the givens in the array given at construction.
 * Runtime: O(r) ---> a constant number of tasks is run for each room.
 */
export class print_Rooms extends template implements task {
  //Variables
  //The rooms array which we're printing
  rooms:RoomPrototype[];

  //constructors
 /**
  * Makes a print_Rooms task which prints the rooms in the given array.
  * @param rooms The room array to be printed.
  */
  constructor(rooms:RoomPrototype[]){
    //Call super
    super("Print Rooms");
    //Set localized counter part
    this.rooms = rooms;
  }

  //Real methods
 /**
  * Prints all the rooms in the given array to the console.
  * Runtime: O(r) ---> r is the number of rooms
  */
  run(){
    //Check if rooms is undefined
    if (this.rooms == undefined) return -1;
    //Iterate down the array and call each rooms print
    for (var i = 0; i < this.rooms.length; i++) this.rooms[i].print(); //O(r * c)
    return 0;
  }
}
