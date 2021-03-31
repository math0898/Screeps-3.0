import { DistanceTransform } from "Algorithms/DistanceTransform";

export class ConstructionProject {
  pos:RoomPosition;
  type:BuildableStructureConstant;
  constructor(p:RoomPosition, t:BuildableStructureConstant){
    this.pos = p;
    this.type = t;
  }

  place(){
    Game.rooms[this.pos.roomName].createConstructionSite(this.pos, this.type)
  }
}
enum patterns {BUNKER = "bunker"}
/**
 * The room planner has a number of nice algorithms and methods defined to help
 * in the planning of rooms as a whole.
 */
export class RoomPlanner {
  private roomMatrix?:number[][];
  private roomType?:patterns;
  private bunkerCenter?:RoomPosition;
  private floodFill?:number[][];
  private room:Room;
  private construction?:ConstructionProject[] = undefined;
  private planningComplete:boolean = false;
  private distanceTransform:DistanceTransform;
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
    this.distanceTransform = new DistanceTransform(r);
  }

  getDistanceTransform(){ return this.distanceTransform.getResult(); }
  isDistanceTransformComplete() { return this.distanceTransform.isComplete();}
  computeDistanceTransform(){ return this.distanceTransform.distanceTransformManager();}

  getFloodFill(){
    return this.floodFill;
  }

  getMinCut(){
    return this.minCut;
  }

  getConstruction(){
    if (this.room.controller!.level < 2) return undefined;
    else if (!this.isDistanceTransformComplete()) return undefined;
    else if (this.construction == undefined && this.room.controller!.level == 2) this.constructionProjects2();
    return this.construction;
  }

  private constructionProjects2(){
    //Roads
    // var s:Source[] = this.room.find(FIND_SOURCES);
    // var p:PathStep[];
    // for (var i = 0; i < s.length; i++) {
    //   p = this.room.findPath(this.room.controller!.pos, s[i].pos, {ignoreCreeps: true, ignoreRoads: true, swampCost: 2});
    //   for (var j = 1; j < p.length - 1; j++) this.construction.push(new ConstructionProject(new RoomPosition(p[j].x,p[j].y,this.room.name), STRUCTURE_ROAD));
    // }
    //Check if construction is defined... it should be
    if (this.construction == undefined) throw "Construction is not defined.";
    //If we're using the bunker pattern
    if (this.roomType == patterns.BUNKER) {
      //Throw an error if we don't have bunker center defined for some reason.
      if (this.bunkerCenter == undefined) throw "Bunker Center not defined.";
      //Five extensions and their locations
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 3, this.bunkerCenter.y + 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 4, this.bunkerCenter.y + 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 2, this.bunkerCenter.y + 3, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 3, this.bunkerCenter.y + 3, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 2, this.bunkerCenter.y + 4, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
    }
  }
  /**
   * constructionProjects3 adds projects with their appropriate location to the
   * construction array to be built in a room in the future. Buildings are added
   * with the assumption that anything requiring controller level 3 can be
   * built.
   * O(c) --> Runs in constant time.
   * @exception "Needed elements not defined."
   * @exception "Bunker Center not defined."
   */
  private constructionProjects3(){
    //Check if construction is defined... it should be
    if (this.construction == undefined) throw "Construction is not defined.";
    //If we're using the bunker pattern
    if (this.roomType == patterns.BUNKER) {
      //Throw an error if we don't have bunker center defined for some reason.
      if (this.bunkerCenter == undefined) throw "Bunker Center not defined.";
      //One tower and its position
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 1, this.bunkerCenter.y - 1, this.bunkerCenter.roomName), STRUCTURE_TOWER));
      //Five extensions and their positions
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 2, this.bunkerCenter.y - 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 3, this.bunkerCenter.y - 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 4, this.bunkerCenter.y - 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 3, this.bunkerCenter.y - 1, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 3, this.bunkerCenter.y + 1, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
    }
  }
  /**
   * constructionProjects4 adds projects with their appropriate location to the
   * construction array to be built in a room in the future. Buildings are added
   * with the assumption that anything requiring controller level 4 can be
   * built.
   * O(c) --> Runs in constant time.
   * @exception "Needed elements not defined."
   * @exception "Bunker Center not defined."
   */
  private constructionProjects4(){
    //Check if construction is defined... it should be
    if (this.construction == undefined) throw "Construction is not defined.";
    //If we're using the bunker pattern
    if (this.roomType == patterns.BUNKER) {
      //Throw an error if we don't have bunker center defined for some reason.
      if (this.bunkerCenter == undefined) throw "Bunker Center not defined.";
      //One storage and its position
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x, this.bunkerCenter.y + 4, this.bunkerCenter.roomName), STRUCTURE_STORAGE));
      //Ten extensions and their locations
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 2, this.bunkerCenter.y - 3, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 1, this.bunkerCenter.y - 3, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 3, this.bunkerCenter.y - 3, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 2, this.bunkerCenter.y - 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 3, this.bunkerCenter.y - 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 4, this.bunkerCenter.y - 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 3, this.bunkerCenter.y - 1, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 1, this.bunkerCenter.y - 3, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 2, this.bunkerCenter.y - 3, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 3, this.bunkerCenter.y - 3, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
    }
  }
  /**
   * constructionProjects5 adds projects with their appropriate location to the
   * construction array to be built in a room in the future. Buildings are added
   * with the assumption that anything requiring controller level 5 can be
   * built.
   * O(c) --> Runs in constant time.
   * @exception "Needed elements not defined."
   * @exception "Bunker Center not defined."
   */
  private constructionProjects5(){
    //Check if construction is defined... it should be
    if (this.construction == undefined) throw "Construction is not defined.";
    //If we're using the bunker pattern
    if (this.roomType == patterns.BUNKER) {
      //Throw an error if we don't have bunker center defined for some reason.
      if (this.bunkerCenter == undefined) throw "Bunker Center not defined.";
      //One tower and its location
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 1, this.bunkerCenter.y - 1, this.bunkerCenter.roomName), STRUCTURE_TOWER));
      //Ten extensions and their positions
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 5, this.bunkerCenter.y + 1, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 5, this.bunkerCenter.y - 1, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 5, this.bunkerCenter.y + 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 5, this.bunkerCenter.y + 4, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 5, this.bunkerCenter.y + 3, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 4, this.bunkerCenter.y + 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 4, this.bunkerCenter.y + 4, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 3, this.bunkerCenter.y + 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 2, this.bunkerCenter.y - 4, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 2, this.bunkerCenter.y - 4, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
    }
  }
  /**
   * constructionProjects6 adds projects with their appropriate location to the
   * construction array to be built in a room in the future. Buildings are added
   * with the assumption that anything requiring controller level 6 can be
   * built.
   * O(c) --> Runs in constant time.
   * @exception "Needed elements not defined."
   * @exception "Bunker Center not defined."
   */
  private constructionProjects6(){
    //Check if construction is defined... it should be
    if (this.construction == undefined) throw "Construction is not defined.";
    //If we're using the bunker pattern
    if (this.roomType == patterns.BUNKER) {
      //Throw an error if we don't have bunker center defined for some reason.
      if (this.bunkerCenter == undefined) throw "Bunker Center not defined.";
      //The terminal and its location
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 2, this.bunkerCenter.y + 2, this.bunkerCenter.roomName), STRUCTURE_TERMINAL));
      //Three labs and their positions
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 3, this.bunkerCenter.y + 2, this.bunkerCenter.roomName), STRUCTURE_LAB));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 3, this.bunkerCenter.y + 3, this.bunkerCenter.roomName), STRUCTURE_LAB));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 2, this.bunkerCenter.y + 3, this.bunkerCenter.roomName), STRUCTURE_LAB));
      //Ten extensions
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x, this.bunkerCenter.y - 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 1, this.bunkerCenter.y - 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 1, this.bunkerCenter.y - 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x, this.bunkerCenter.y - 4, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 5, this.bunkerCenter.y, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 5, this.bunkerCenter.y + 1, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 5, this.bunkerCenter.y - 1, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 4, this.bunkerCenter.y, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 5, this.bunkerCenter.y, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 4, this.bunkerCenter.y, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
    }
    //Place the extractor
    this.construction.push(new ConstructionProject(this.room.find(FIND_MINERALS)[0].pos, STRUCTURE_EXTRACTOR));
  }
  /**
   * constructionProjects7 adds projects with their appropriate location to the
   * construction array to be built in a room in the future. Buildings are added
   * with the assumption that anything requiring controller level 7 can be
   * built.
   * O(c) --> Runs in constant time.
   * @exception "Needed elements not defined."
   * @exception "Bunker Center not defined."
   */
  private constructionProjects7() {
    //Check if construction is defined... it should be
    if (this.construction == undefined) throw "Construction is not defined.";
    //If we're using the bunker pattern
    if (this.roomType == patterns.BUNKER) {
      //Throw an error if we don't have bunker center defined for some reason.
      if (this.bunkerCenter == undefined) throw "Bunker Center not defined.";
      //Three labs and their positions
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 4, this.bunkerCenter.y + 4, this.bunkerCenter.roomName), STRUCTURE_LAB));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 4, this.bunkerCenter.y + 2, this.bunkerCenter.roomName), STRUCTURE_LAB));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 2, this.bunkerCenter.y + 4, this.bunkerCenter.roomName), STRUCTURE_LAB));
      //Two links and their positions // TODO: add the other two next to sources
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 3, this.bunkerCenter.y + 1, this.bunkerCenter.roomName), STRUCTURE_LINK));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 2, this.bunkerCenter.y + 2, this.bunkerCenter.roomName), STRUCTURE_LINK));
      //One tower and its position
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x, this.bunkerCenter.y - 1, this.bunkerCenter.roomName), STRUCTURE_TOWER));
      //Ten extensions and their positions
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 3, this.bunkerCenter.y - 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 2, this.bunkerCenter.y - 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 4, this.bunkerCenter.y - 4, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 3, this.bunkerCenter.y - 4, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 5, this.bunkerCenter.y - 3, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 3, this.bunkerCenter.y - 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 2, this.bunkerCenter.y - 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 4, this.bunkerCenter.y - 4, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 3, this.bunkerCenter.y - 4, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 5, this.bunkerCenter.y - 3, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      //The second spawn and its position
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 2, this.bunkerCenter.y, this.bunkerCenter.roomName), STRUCTURE_SPAWN));
    }
  }
  /**
   * constructionProjects8 adds projects with their appropriate location to the
   * construction array to be built in a room in the future. Buildings are added
   * with the assumption that anything requiring controller level 8 can be
   * built.
   * O(c) --> Runs in constant time.
   * @exception "Needed elements not defined."
   * @exception "Bunker Center not defined."
   */
  private constructionProjects8() {
    //Check if construction is defined... it should be
    if (this.construction == undefined) throw "Construction is not defined.";
    //If we're using the bunker pattern
    if (this.roomType == patterns.BUNKER) {
      //Throw an error if we don't have bunker center defined for some reason.
      if (this.bunkerCenter == undefined) throw "Bunker Center not defined.";
      //Nuker position in the bunker
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x, this.bunkerCenter.y + 5, this.bunkerCenter.roomName), STRUCTURE_NUKER));
      //Power spawn position in the bunker
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x, this.bunkerCenter.y + 2, this.bunkerCenter.roomName), STRUCTURE_POWER_SPAWN));
      //Observer position in the bunker
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 5, this.bunkerCenter.y + 5, this.bunkerCenter.roomName), STRUCTURE_OBSERVER));
      //Four labs and their positions
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 3, this.bunkerCenter.y + 5, this.bunkerCenter.roomName), STRUCTURE_LAB));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 4, this.bunkerCenter.y + 5, this.bunkerCenter.roomName), STRUCTURE_LAB));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 5, this.bunkerCenter.y + 4, this.bunkerCenter.roomName), STRUCTURE_LAB));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 5, this.bunkerCenter.y + 3, this.bunkerCenter.roomName), STRUCTURE_LAB));
      //Three towers and their positions
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 1, this.bunkerCenter.y, this.bunkerCenter.roomName), STRUCTURE_TOWER));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 1, this.bunkerCenter.y, this.bunkerCenter.roomName), STRUCTURE_TOWER));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x, this.bunkerCenter.y + 1, this.bunkerCenter.roomName), STRUCTURE_TOWER));
      //Ten extensions and their positions
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 5, this.bunkerCenter.y - 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 5, this.bunkerCenter.y - 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 2, this.bunkerCenter.y - 6, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 2, this.bunkerCenter.y - 6, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 6, this.bunkerCenter.y - 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 6, this.bunkerCenter.y - 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 6, this.bunkerCenter.y + 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 6, this.bunkerCenter.y + 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 2, this.bunkerCenter.y + 6, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 2, this.bunkerCenter.y + 6, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
      //The third spawn's position
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 2, this.bunkerCenter.y, this.bunkerCenter.roomName), STRUCTURE_SPAWN));
    }
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
     //Transfer x and y positions of items to protect into an array
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
