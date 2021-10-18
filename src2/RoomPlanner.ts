import { DistanceTransform } from "Algorithms/DistanceTransform";
import { FloodFill } from "Algorithms/FloodFill";

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
  private roomType?:patterns;
  private bunkerCenter?:RoomPosition;
  private room:Room;
  private construction?:ConstructionProject[] = undefined;
  private planningComplete:boolean = false;
  private distanceTransform:DistanceTransform;
  private floodFill:FloodFill;
  // private minCut:MinCut;

  constructor(r:Room){
    this.room = r;
    this.distanceTransform = new DistanceTransform(r);
    this.floodFill = new FloodFill(r);
  }

  getDistanceTransform(){ return this.distanceTransform.getResult(); }
  isDistanceTransformComplete() { return this.distanceTransform.isComplete();}
  computeDistanceTransform(){ return this.distanceTransform.manager();}

  getFloodFill(){ return this.floodFill.getResult(); }
  isFloodFillComplete() { return this.floodFill.isComplete(); }
  computeFloodfill() { return this.floodFill.manager();}

  // getMinCut(){ return this.minCut.getResult(); }
  // isMinCutComplete() { return this.minCut.isComplete(); }
  // computeMinCut() { return this.mincut.manager(); }

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
    if (this.construction == undefined) throw "Construction is not defined.";
    if (this.roomType == patterns.BUNKER) {
      if (this.bunkerCenter == undefined) throw "Bunker Center not defined.";

      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x, this.bunkerCenter.y + 5, this.bunkerCenter.roomName), STRUCTURE_NUKER));

      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x, this.bunkerCenter.y + 2, this.bunkerCenter.roomName), STRUCTURE_POWER_SPAWN));

      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 5, this.bunkerCenter.y + 5, this.bunkerCenter.roomName), STRUCTURE_OBSERVER));

      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 3, this.bunkerCenter.y + 5, this.bunkerCenter.roomName), STRUCTURE_LAB));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 4, this.bunkerCenter.y + 5, this.bunkerCenter.roomName), STRUCTURE_LAB));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 5, this.bunkerCenter.y + 4, this.bunkerCenter.roomName), STRUCTURE_LAB));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 5, this.bunkerCenter.y + 3, this.bunkerCenter.roomName), STRUCTURE_LAB));

      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 1, this.bunkerCenter.y, this.bunkerCenter.roomName), STRUCTURE_TOWER));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 1, this.bunkerCenter.y, this.bunkerCenter.roomName), STRUCTURE_TOWER));
      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x, this.bunkerCenter.y + 1, this.bunkerCenter.roomName), STRUCTURE_TOWER));

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

      this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 2, this.bunkerCenter.y, this.bunkerCenter.roomName), STRUCTURE_SPAWN));
    }
  }
}
