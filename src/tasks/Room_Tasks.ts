/**
 * This file contains declartions of tasks that are related to the Room class.
 * @Author Sugaku, math0898
 */
//Import the task interface
import { task, template } from "tasks/task";
//Import the relevant class
import { struc_Room } from "Room";
/**
 * The init_Rooms task which initializes all the rooms current visible in
 * Game.rooms. It is a fairly costly task and so shouldn't be run much.
 * Runtime: O(r * f) --> find is used at most once per room in Game.rooms
 */
export class init_Rooms extends template implements task {
  //Varaibles
  //The name of the task
  name:string = "Initalize Rooms";
  //The rooms array which we're initalizing
  rooms?:struc_Room[];

  //Constructors
 /**
  * Takes the room array where the intialized rooms should be placed. WARN! This
  * will overwrite any data currently here!
  * @param rooms The room array to store the data in.
  */
  constructor(rooms?:struc_Room[]){
    //Call super
    super();
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
      this.rooms.push(new struc_Room(r.name));
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
  //The name of the task
  name:string = "Update Rooms";
  //The rooms array which we're updating
  rooms:struc_Room[];

  //Constructors
 /**
  * Makes an update_Rooms task.
  * @param rooms The room array to be updated.
  */
  constructor(rooms:struc_Room[]){
    //Call super
    super();
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
  //The name of the task
  name:string = "Print Rooms"
  //The rooms array which we're printing
  rooms:struc_Room[];

  //constructors
 /**
  * Makes a print_Rooms task which prints the rooms in the given array.
  * @param rooms The room array to be printed.
  */
  constructor(rooms:struc_Room[]){
    //Call super
    super();
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
    if (this.rooms == undefined) {
      console.log("Could not print rooms");
      return;
    }
    //Iterate down the array and call each rooms print
    for (var i = 0; i < this.rooms.length; i++) this.rooms[i].print(); //O(r * c)
  }
}
