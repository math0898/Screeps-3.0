/**
 * Import the algorithm abstract class because well... this is an algorithm is
 * it not?
 */
import { Algorithm } from "Algorithms/Algorithm";
/**
 * The flood fill class handles the calculation of the flood fill algorithm. The
 * flood fill algorithm simulates a flood starting from a point marked by the flag
 * "Flood" and expands outwards only being stopped by natural walls, man made
 * walls and ramparts.
 */
export class FloodFill extends Algorithm {
  /**
   * Room points to the room game object we're going to be basing our algorithm
   * off of. We'll update it when setting up our map so we can get the latest on
   * player build walls/ramparts.
   */
  private room:Room;
  /**
   * The matrix we're using to run the algorithm and report our findings.
   */
  private floodFill?:number[][] = undefined;
  /**
   * Construct a FloodFill object. For the most part is needs only to know the
   * room its running calculations on.
   * @param r - The room flood fill is being run on.
   */
  constructor(r:Room){
    //Make an appeal to a higher power with our name
    super("Flood Fill");
    //Set our local room
    this.room = r;
  }
  /**
   * Return the matrix of the algorithm. Note that this may be incomplete and
   * isComplete() should be used before using it for any planning.
   */
  getResult(){ return this.floodFill; }
  /**
   * The manager manages the flood fill algorithm and guides it through all of its
   * major steps. When making calls to this class only manager or the above
   * accessor methods should be touched or called. Doing anything else may
   * interfere with the algorithm.
   * @return - 2 Flood Fill matrix init'd.
   * @return - 1 We need an another call to make more calculations... progress
   * is being made.
   * @return - 0 The algorithm is done running and is complete. No more calls
   * needed.
   */
  manager(){
    //If our matrix isn't, set it up and return the appropriate value
    if (this.floodFill == undefined) { this.setupFloodFillAlgorithm(); return 2; }
    //Run the algorithm and if a change is made return 1
    else if (this.floodFillAlgorithm()) return 1;
    //If the algorithm was run and no changes were made we're complete
    else return 0;
  }
  /**
   * setupFloodFillAlgorithm sets up this.floodFill in a way that allows it to be
   * used by the subsequent method floodFillAlgorithm. We need non walls to be
   * one and walls to be 0.
   */
  private setupFloodFillAlgorithm(){
    //Update the stale room game object
    this.room = Game.rooms[this.room.name];
    //Make a temp variable to store the terrain of the room
    var terrain:RoomTerrain = this.room.getTerrain();
    //Init the matrix so it can store values
    this.floodFill = [];
    //Iterate through the y values
    for (var y = 0; y < 50; y++) {
      //Make a row to temporarily store values
      var row:number[] = [];
      //Iterate down the row
      for (var x = 0; x < 50; x++) {
        //If the terrain is a wall add a 0 to the row array
        if(terrain.get(x,y) == 1) row.push(0);
        //If the terrain is walkable add a 01 to the row array
        else row.push(1);
      }
      //Add the row to the matrix
      this.floodFill.push(row);
    }
    //Add the first infected tile to the matrix
    this.floodFill[Game.flags["Flood"].pos.y][Game.flags["Flood"].pos.x] = -1;
  }
  /**
   * Infects tiles next to the infected tile if they should be infected. It
   * checks all neighbors of any -1 cells it finds which is always less than 625
   * so the estimate checks bounded above by 625 + 8 * 625 (The surface area of
   * the current infection).
   * @exception "Flood Fill storage matrix is not defined."
   * @return true - Changes were made, follow up calls are required.
   * @return false - Changes were not made and follow up calls are not required.
   */
  private floodFillAlgorithm(){
    //Check if floodfill is defined... it should be .-.
    if (this.floodFill == undefined) throw "Flood Fill storage matrix is not defined.";
    //Make a temproary clone of the matrix
    var temp:number[][] = _.cloneDeep(this.floodFill);
    //Make a temp variable to store whether we've made a change or not
    var change:boolean = false;
    //Iterate through the matrix and find an infected cell
    for (var y = 1; y < 49; y++) for (var x = 1; x < 49; x++) if (this.floodFill[y][x] == -1) {
      //Check if the value of a cell is 1, if it is call some additional logic to determine whether it should
      // be changed. We also set change = change || helper() so we can garuntee any changes made will result in
      // change ending in a true value.
      if(this.floodFill[y    ][x - 1] == 1) change = this.floodFillHelper(y    , x - 1, temp) || change;
      if(this.floodFill[y + 1][x - 1] == 1) change = this.floodFillHelper(y + 1, x - 1, temp) || change;
      if(this.floodFill[y - 1][x - 1] == 1) change = this.floodFillHelper(y - 1, x - 1, temp) || change;
      if(this.floodFill[y - 1][x    ] == 1) change = this.floodFillHelper(y - 1, x    , temp) || change;
      if(this.floodFill[y + 1][x    ] == 1) change = this.floodFillHelper(y + 1, x    , temp) || change;
      if(this.floodFill[y    ][x + 1] == 1) change = this.floodFillHelper(y    , x + 1, temp) || change;
      if(this.floodFill[y + 1][x + 1] == 1) change = this.floodFillHelper(y + 1, x + 1, temp) || change;
      if(this.floodFill[y - 1][x + 1] == 1) change = this.floodFillHelper(y - 1, x + 1, temp) || change;
    }
    //Update the flood fill matrix
    this.floodFill = temp;
    //Return whether we made a change or not
    return change;
  }
  /**
   * Determines whether the given position should be infected and makes the
   * change should it be required.
   * @param y - The y position of the cell.
   * @param x - The x position of the cell.
   * @param temp - The matrix we're updating if it needs to be changed.
   * @return true - The change was made.
   * @return false - The change was not made.
   */
  private floodFillHelper(y:number, x:number, temp:number[][]) {
    //Look at the cell in the room
    var l = this.room.lookAt(x,y);
    //Make a temp boolean to determine if we're making the change
    var t = false;
    //Search through the items in l and set t to true if one of them satisfies the conditions
    for (let i in l) if(l[i].type == LOOK_STRUCTURES) { t = true; break; }
    //If t has been satisfied make the change
    if (!t) temp[y][x] = -1;
    //Return whether t has been satisifed
    return t;
  }
}
