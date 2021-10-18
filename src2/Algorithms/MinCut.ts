export class MinCut {
  // /**
  //  * Minimum cut manager. Handles the execution of the mincut algortithm on a
  //  * room.
  //  * @param p The positions to be protected. Undefined for subsequent calls.
  //  */
  //  minCutManager(p:RoomPosition[] | undefined = undefined){
  //    if (p != undefined && this.minCutProtect == undefined) { this.minCutProtect = _.cloneDeep(p); return 4;}
  //    else if (this.roomMatrix == undefined) { this.calculateRoomMatrix(); return 3; }
  //    else if (this.supX == undefined || this.infX == undefined || this.supY == undefined || this.infY == undefined || this.minCut == undefined) { this.minCutSetup(); return 2;}
  //    else if (this.minCutAlgorithm()) return 1;
  //    else return 0;
  //  }
  //  minCutSetup(){
  //    this.minCut = _.cloneDeep(this.roomMatrix);
  //    if (this.minCutProtect == undefined) throw "Min Cut Protect Not Found";
  //    //Transfer x and y positions of items to protect into an array
  //    var y:number[] = [];
  //    var x:number[] = [];
  //    //Iterate
  //    for (var i:number = 0; i < this.minCutProtect.length; i++) {
  //      this.minCut![this.minCutProtect[i].y][this.minCutProtect[i].x] = 2;
  //      //Push x value
  //      x.push(this.minCutProtect[i].x);
  //      //Push y value
  //      y.push(this.minCutProtect[i].y);
  //    }
  //    //Store the max x,y and min x,y
  //    this.supX = _.max(x);
  //    this.infX = _.min(x);
  //    this.supY = _.max(x);
  //    this.infY = _.min(x);
  //  }
  //  minCutAlgorithm(){
  //    var xGuess:number[] = [];
  //    for (var i = 0; i < this.infX!; i++) {
  //      xGuess.push(0);
  //      for (var j = 0; j < 49; j++) {
  //        if (this.minCut![j][i] == 1) xGuess[i]++;
  //        else if (this.minCut![j][i] == 3) break;
  //      }
  //    }
  //    var solution = xGuess.indexOf(_.min(xGuess));
  //    for (var j = 0; j < 49; j++) if (this.minCut![j][i] == 1) this.minCut![j][i] = 3;
  //    return false;
  //  }
}
