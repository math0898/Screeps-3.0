/**
 * The room planner has a number of nice algorithms and methods defined to help
 * in the planning of rooms as a whole.
 */
export class RoomPlanner {
  private roomMatrix?:number[][];
  private distanceTransform?:number[][] = undefined;
  private floodFill?:number[][];
  private room:Room;

  constructor(r:Room){
    this.room = r;
  }

  getDistanceTransform(){
    return this.distanceTransform;
  }

  getFloodFill(){
    return this.floodFill;
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

  distanceTransformManager(){
    if (this.roomMatrix == undefined) { this.calculateRoomMatrix(); return 3; }
    else if (this.distanceTransform == undefined) { this.distanceTransform = _.cloneDeep(this.roomMatrix); return 2; }
    else if (this.distanceTransformStep()) return 1;
    else return 0;
  }
  private distanceTransformStep(){
    var temp:number[][] | undefined = this.distanceTransform;
    if (temp == undefined || this.distanceTransform == undefined) throw null;
    var change:boolean = false;
    for (var y = 0; y < 50; y++) for (var x = 0; x < 50; x++){
      var current:number = this.distanceTransform[x][y];
      if(current == 0) continue;
      if (x >= 48 || x <= 1 || y <= 1 || y >= 48) { this.distanceTransform[x][y] = 0; continue; }
      if(this.distanceTransform[x    ][y - 1] < current) continue;
      if(this.distanceTransform[x + 1][y - 1] < current) continue;
      if(this.distanceTransform[x - 1][y - 1] < current) continue;
      if(this.distanceTransform[x - 1][y    ] < current) continue;
      if(this.distanceTransform[x + 1][y    ] < current) continue;
      if(this.distanceTransform[x    ][y + 1] < current) continue;
      if(this.distanceTransform[x + 1][y + 1] < current) continue;
      if(this.distanceTransform[x - 1][y + 1] < current) continue;
      change = true;
      temp[x][y]++;
    }
    this.distanceTransform = temp;
    return change;
  }

  floodFillReset(){ this.floodFill = undefined; }
  floodFillManager(p:RoomPosition){
    if (this.roomMatrix == undefined) { this.calculateRoomMatrix(); return 5; }
    else if (this.floodFill == undefined) { this.floodFill = _.cloneDeep(this.roomMatrix); return 3; }
    else if (this.floodFill[p.y][p.x] != -1) { this.floodFill[p.y][p.x] = -1; return 2; }
    else if (this.floodFillStep()) return 1;
    else return 0;
  }
  floodFillStep(){
    var temp:number[][] | undefined = this.floodFill;
    if (temp == undefined || this.floodFill == undefined) throw null;
    var change:boolean = false;
    for (var y = 1; y < 49; y++) for (var x = 1; x < 49; x++){
      var current:number = this.floodFill[x][y];
      var infect:boolean = false;
      if(current == 0 || current == -1) continue;
      if(this.floodFill[x    ][y - 1] == -1) infect = true;
      else if(this.floodFill[x + 1][y - 1] == -1) infect = true;
      else if(this.floodFill[x - 1][y - 1] == -1) infect = true;
      else if(this.floodFill[x - 1][y    ] == -1) infect = true;
      else if(this.floodFill[x + 1][y    ] == -1) infect = true;
      else if(this.floodFill[x    ][y + 1] == -1) infect = true;
      else if(this.floodFill[x + 1][y + 1] == -1) infect = true;
      else if(this.floodFill[x - 1][y + 1] == -1) infect = true;
      if(infect){
        var l = this.room.lookAt(y,x);
        var t = false;

        for (let i in l) if(l[i].type == LOOK_STRUCTURES) { t = true; break; }
        if (!t){
          change = true;
          temp[x][y] = -1;
        }
      }
    }
    this.roomMatrix = temp;
    return change;
  }
}
