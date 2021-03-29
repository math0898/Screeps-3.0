
export class VisualsManager{
  run(roomName:string, trans:number[][] | undefined, flood:number[][] | undefined){
    if (Game.flags["DistanceTransform"] != undefined) this.distanceTransform(trans, roomName);
    if (Game.flags["FloodFill"] != undefined) this.floodFill(flood, roomName);
  }
  private distanceTransform(trans:number[][] | undefined, roomName:string){
    if(trans != undefined) for(var i = 0; i < 50; i++){
      for (var j = 0; j < 50; j++) {
        switch(trans[i][j]){
          case 0: break;
          case 1: new RoomVisual(roomName).circle(j,i, {fill: "#B71C1C", opacity: 80}); break;
          case 2: new RoomVisual(roomName).circle(j,i, {fill: "#880E4F", opacity: 80}); break;
          case 3: new RoomVisual(roomName).circle(j,i, {fill: "#4A148C", opacity: 80}); break;
          case 4: new RoomVisual(roomName).circle(j,i, {fill: "#311B92", opacity: 80}); break;
          case 5: new RoomVisual(roomName).circle(j,i, {fill: "#0D47A1", opacity: 80}); break;
          case 6: new RoomVisual(roomName).circle(j,i, {fill: "#01579B", opacity: 80}); break;
          case 7: new RoomVisual(roomName).circle(j,i, {fill: "#006064", opacity: 80}); break;
          case 8: new RoomVisual(roomName).circle(j,i, {fill: "#004D40", opacity: 80}); break;
          case 9: new RoomVisual(roomName).circle(j,i, {fill: "#1B5E20", opacity: 80}); break;
          case 10: new RoomVisual(roomName).circle(j,i, {fill: "#33691E", opacity: 80}); break;
          case 11: new RoomVisual(roomName).circle(j,i, {fill: "#827717", opacity: 80}); break;
          case 12: new RoomVisual(roomName).circle(j,i, {fill: "#F57F17", opacity: 80}); break;
          case 13: new RoomVisual(roomName).circle(j,i, {fill: "#FF6F00", opacity: 80}); break;
          case 14: new RoomVisual(roomName).circle(j,i, {fill: "#E65100", opacity: 80}); break;
          case 15: new RoomVisual(roomName).circle(j,i, {fill: "#BF360C", opacity: 80}); break;
        }
      }
    }
  }
  private floodFill(flood:number[][] | undefined, roomName:string){
    if (flood != undefined) for(var i = 0; i < 50; i++){
      for (var j = 0; j < 50; j++) {
        switch(flood[i][j]){
          case 0: break;
          case -1: new RoomVisual(roomName).circle(j,i, {fill: "#388E3C", opacity: 80}); break;
          case 1: new RoomVisual(roomName).circle(j,i, {fill: "#303F9F", opacity: 80}); break;
        }
      }
    }
  }
}
