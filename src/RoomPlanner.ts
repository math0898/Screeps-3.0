/**
 * The room planner has a number of nice algorithms and methods defined to help
 * in the planning of rooms as a whole.
 */
export class RoomPlanner {
  private roomMatrix?:number[][];
  private distanceTransform?:number[][] = undefined;
  private floodFill?:number[][];
  private room:Room;
  /**
   * Holds the result and steps of the minCut algorithm.
   */
  private minCut?:number[][] = undefined;
  /**
   * Positions that the mincut algorithm takes into consideration to protect.
   * This array cannot be empty.
   */
  private minCutProtect?:RoomPosition[] = undefined;
  /**
   * Variables holding the sup and inf of x and y positions of the items needing
   * protection.
   */
  private supX?:number;
  private infX?:number;
  private supY?:number;
  private infY?:number;

  constructor(r:Room){
    this.room = r;
  }

  getDistanceTransform(){
    return this.distanceTransform;
  }

  getFloodFill(){
    return this.floodFill;
  }

  getMinCut(){
    return this.minCut;
  }

  private calculateRoomMatrix(){
    var terrain:RoomTerrain = this.room.getTerrain();
    this.roomMatrix = [];
    for (var y = 0; y < 50; y++){
      var row:number[] = [];
      for (var x = 0; x < 50; x++) {
        if(terrain.get(x,y) == 1) row.push(0);
        else row.push(1);
      }
      this.roomMatrix.push(row);
    }
  }
  private setupDistanceTransform(){
    this.distanceTransform = _.cloneDeep(this.roomMatrix);
    if(this.distanceTransform != undefined) for (var y = 0; y < 50; y++) for (var x = 0; x < 50; x++) {
      if (x > 47 || x < 2 || y > 47 || y < 2) this.distanceTransform[y][x] = 0;
      else if (this.distanceTransform[y][x] == 1) this.distanceTransform[y][x] = -1;
    }
  }

  distanceTransformManager(){
    if (this.roomMatrix == undefined) { this.calculateRoomMatrix(); return 3; }
    else if (this.distanceTransform == undefined) { this.setupDistanceTransform(); return 2; }
    else if (this.distanceTransformAlgorithm()) return 1;
    else return 0;
  }
  /**
   * Calculates the distance for the first (-1) value it finds in the
   * distanceTransform array. This implementation has far fewer checks than the
   * iterative solution I've used in the past which would preform 8 * 625. This
   * one preforms (<=) 2 * 625 checks. Once for finding the cell and secondly to
   * calculate its distance.
   */
  private distanceTransformAlgorithm(){
    //Check if distanceTransform is defined... it should be .-.
    if (this.distanceTransform == undefined) throw "Distance Transform storage matrix is not defined";
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

  floodFillReset(){ this.floodFill = undefined; }
  floodFillManager(p:RoomPosition){
    if (this.roomMatrix == undefined) { this.calculateRoomMatrix(); return 5; }
    else if (this.floodFill == undefined) { this.floodFill = _.cloneDeep(this.roomMatrix); return 3; }
    else if (this.floodFill[p.y][p.x] != -1) { this.floodFill[p.y][p.x] = -1; return 2; }
    else if (this.floodFillAlgorithm()) return 1;
    else return 0;
  }
  floodFillAlgorithm(){
    var temp:number[][] | undefined = _.cloneDeep(this.floodFill);
    if (temp == undefined || this.floodFill == undefined) throw null;
    var change:boolean = false;
    for (var y = 1; y < 49; y++) for (var x = 1; x < 49; x++) if (this.floodFill[y][x] == -1) {
      if(this.floodFill[y    ][x - 1] == 1) change = this.floodFillHelper(y    , x - 1, temp) || change;
      if(this.floodFill[y + 1][x - 1] == 1) change = this.floodFillHelper(y + 1, x - 1, temp) || change;
      if(this.floodFill[y - 1][x - 1] == 1) change = this.floodFillHelper(y - 1, x - 1, temp) || change;
      if(this.floodFill[y - 1][x    ] == 1) change = this.floodFillHelper(y - 1, x    , temp) || change;
      if(this.floodFill[y + 1][x    ] == 1) change = this.floodFillHelper(y + 1, x    , temp) || change;
      if(this.floodFill[y    ][x + 1] == 1) change = this.floodFillHelper(y    , x + 1, temp) || change;
      if(this.floodFill[y + 1][x + 1] == 1) change = this.floodFillHelper(y + 1, x + 1, temp) || change;
      if(this.floodFill[y - 1][x + 1] == 1) change = this.floodFillHelper(y - 1, x + 1, temp) || change;
    }
    this.floodFill = temp;
    return change;
  }
  floodFillHelper(y:number, x:number, temp:number[][]){
    var l = this.room.lookAt(x,y);
    var t = false;
    for (let i in l) if(l[i].type == LOOK_STRUCTURES) { t = true; break; }
    if (!t){
      temp[y][x] = -1;
      return true;
    }
    return false;
  }
  /**
   * Minimum cut manager. Handles the execution of the mincut algortithm on a
   * room.
   * @param p The positions to be protected. Undefined for subsequent calls.
   */
   minCutManager(p:RoomPosition[] | undefined = undefined){
     if (p != undefined && this.minCutProtect == undefined) { this.minCutProtect = _.cloneDeep(p); return 4;}
     else if (this.roomMatrix == undefined) { this.calculateRoomMatrix(); return 3; }
     else if (this.supX == undefined || this.infX == undefined || this.supY == undefined || this.infY == undefined || this.minCut == undefined) { this.minCutSetup(); return 2;}
     else if (this.minCutAlgorithm()) return 1;
     else return 0;
   }
   minCutSetup(){
     this.minCut = _.cloneDeep(this.roomMatrix);
     if (this.minCutProtect == undefined) throw "Min Cut Protect Not Found";
     //Transfer x and y positons of items to protect into an array
     var y:number[] = [];
     var x:number[] = [];
     //Iterate
     for (var i:number = 0; i < this.minCutProtect.length; i++) {
       this.minCut![this.minCutProtect[i].y][this.minCutProtect[i].x] = 2;
       //Push x value
       x.push(this.minCutProtect[i].x);
       //Push y value
       y.push(this.minCutProtect[i].y);
     }
     //Store the max x,y and min x,y
     this.supX = _.max(x);
     this.infX = _.min(x);
     this.supY = _.max(x);
     this.infY = _.min(x);
   }
   minCutAlgorithm(){
     var xGuess:number[] = [];
     for (var i = 0; i < this.infX!; i++) {
       xGuess.push(0);
       for (var j = 0; j < 49; j++) {
         if (this.minCut![j][i] == 1) xGuess[i]++;
         else if (this.minCut![j][i] == 3) break;
       }
     }
     var solution = xGuess.indexOf(_.min(xGuess));
     for (var j = 0; j < 49; j++) if (this.minCut![j][i] == 1) this.minCut![j][i] = 3;
     return false;
   }
}
