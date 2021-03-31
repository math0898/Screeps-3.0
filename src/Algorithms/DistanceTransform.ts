/**
 * Import the algorithm abstract class because well... this is an algorithm is
 * it not?
 */
import { Algorithm } from "Algorithms/Algorithm";
/**
 * The distance transform class handles the computations related to the distance
 * transform algorithm on a given room.
 */
export class DistanceTransform extends Algorithm {
  /**
   * room points to the room game object we're going to be basing our algorithm
   * off of. It does not matter if it's stale as we only care about terrain.
   */
  private room:Room;
  /**
   * The matrix we're using to run the algorithm and report our findings.
   */
  private distanceTransform?:number[][] = undefined;
  /**
   * Construct a DistanceTransform object. For the most part it needs only to
   * know the room its running calculations on.
   * @param r - The room distance transform is being run on.
   */
  constructor(r:Room){
    //Make an appeal to a higher power with our name
    super("Distance Transform");
    //Set our local room
    this.room = r;
  }
  /**
   * Return the matrix of the algorithm. Note that this may be incomplete and
   * isComplete() should be used before using it for any planning.
   */
  getResult(){ return this.distanceTransform; }
  /**
   * The distanceTransformManager manages the distance transform algorithm and
   * guides it through all of its major steps. When making calls to this class
   * only distanceTransformManager or the above accessor methods should be
   * touched or called. Doing anything else may interfere with the algorithm.
   * @return - 2 Distance Transform matrix init'd.
   * @return - 1 We need an another call to make more calculations... progress
   * is being made.
   * @return - 0 The algorithm is done running and is complete. No more calls
   * needed.
   */
  distanceTransformManager(){
    //If our matrix isn't set it up set it up and return the appropriate value
    if (this.distanceTransform == undefined) { this.setupDistanceTransform(); return 2; }
    //Run the algorithm and return 1 if it needs to be run again
    else if (this.distanceTransformAlgorithm()) return 1;
    //The algorithm made no changes and so its complete
    else {
      //Report that we've completed calculations
      this.reportCompletion();
      //Return the appropriate value
      return 0;
    }
  }
  /**
   * setupDistanceTransform sets up this.distanceTransform in a way that allows
   * it to be used by the subsequent method distanceTransformAlgorithm. We need
   * positions that have not had their distance calculated to be negative one
   * and walls to remain 0.
   */
  private setupDistanceTransform(){
    //Find the terrain of the room we're in.
    var terrain:RoomTerrain = this.room.getTerrain();
    //Init the matrix we're setting up
    this.distanceTransform = [];
    //Iterate through the y values
    for (var y = 0; y < 50; y++) {
      //Make a row to temporarily store values
      var row:number[] = [];
      //Iterate down the row
      for (var x = 0; x < 50; x++) {
        //If the terrain is a wall add a 0 to the row array
        if(terrain.get(x,y) == 1) row.push(0);
        //If the terrain is walkable add a -1 to the row array
        else row.push(-1);
      }
      //Add the row to the matrix
      this.distanceTransform.push(row);
    }
  }
  /**
   * Calculates the distance for the first (-1) value it finds in the
   * distanceTransform array. This implementation has far fewer checks than the
   * iterative solution I've used in the past which would preform 8 * 625. This
   * one preforms (<=) 2 * 625 checks. Once for finding the cell and secondly to
   * calculate its distance.
   * @exception "Distance transform storage matrix is not defined."
   * @return false - Changes were made a follow up calls are required.
   * @return true - Changes were not made and follow up calls are not required.
   */
  private distanceTransformAlgorithm(){
    //Check if distanceTransform is defined... it should be .-.
    if (this.distanceTransform == undefined) throw "Distance Transform storage matrix is not defined.";
    //Variable to determine if we're done or not
    var notDone:boolean = false;
    //Iterate through elements until one is -1
    for (var y = 0; y < 50; y++) for (var x = 0; x < 50; x++) if (this.distanceTransform[y][x] == -1){
      //We've found an item that needs calculated so we can say we're not done
      notDone = true;
      //The starting delta to check for any walls
      var delta:number = 0;
      //A boolean to determine exit
      var exit:boolean = false;
      //A nice infinite loop we'll break from in a bit once exit conditions are met
      while(!exit){
        //Increase delta
        delta++;
        //Set our dx to delta
        var dx = delta;
        //Iterate through y's looking for a wall
        for (var dy = -delta; dy <= delta; dy++) if (this.distanceTransform[y + dy][x + dx] == 0) exit = true;
        //Same for negative dx
        dx = -delta;
        //Iterate through y's looking for a wall
        for (var dy = -delta; dy <= delta; dy++) if (this.distanceTransform[y + dy][x + dx] == 0) exit = true;
        //Set our dy to delta
        var dy:number = delta;
        //Iterate through x's looking for a wall
        for (var dx = -delta; dx <= delta; dx++) if (this.distanceTransform[y + dy][x + dx] == 0) exit = true;
        //Same for negative dy
        dy = -delta;
        //Iterate through x's looking for a wall
        for (var dx = -delta; dx <= delta; dx++) if (this.distanceTransform[y + dy][x + dx] == 0) exit = true;
      }
      //Set our value to how far we got
      this.distanceTransform[y][x] = delta;
      //We don't want to calculate more than one per round since that can get expensive so we return what we got
      return notDone;
    }
    //Return whether we are done or not
    return notDone;
  }
  // TODO: reimplement the iterative distance transform for cases where we need it done NOW and can pay the higher per tick CPU
}
