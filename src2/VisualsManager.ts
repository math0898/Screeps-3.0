/**
 * The visuals manager draws the visual results of algorithms and other useful
 * information to the screen. What is drawn is determined by game flags.
 */
export class VisualsManager {
  /**
   * run does some basic logic to determine what should be drawn to screen
   * before calling the helper methods to draw the information to the screen.
   * @param roomName - The room which is being drawn to
   * @param distanceTransform - The distance transform algorithm result
   * @param floodFill - The flood fill algorithm result
   */
  run(roomName:string, distanceTransform:number[][] | undefined = undefined, floodFill:number[][] | undefined = undefined){
    //If the DistanceTransform flag is down call the drawing function
    if (Game.flags["DistanceTransform"] != undefined) this.distanceTransform(distanceTransform, roomName);
    //If the FloodFill flag is down call the drawing function
    else if (Game.flags["FloodFill"] != undefined) this.floodFill(floodFill, roomName);
  }
  /**
   * Draws the distance transform algorithm result to the given room.
   * @param distanceTransform - The distance transform algorithm result
   * @param roomName - The room the data is being drawn to
   */
  private distanceTransform(distanceTransform:number[][] | undefined, roomName:string){
    //If the transform is defined, iterate through all the elements
    if (distanceTransform != undefined) for (var i = 0; i < 50; i++) for (var j = 0; j < 50; j++) {
      //Depending on the value of the cell we want to draw a different color cirlce here
      switch(distanceTransform[i][j]){
        //Draw a gradient of colors depending on the cell's value. Nothing is drawn for walls/boundaries
        // -1 is only used in the non iterative solution to the distance transform. The gradient
        // used here is the far right row of web safe colors on this website https://htmlcolors.com/color-chart
        case -1: new RoomVisual(roomName).circle(j,i, {fill: "#607D8B", opacity: 80}); break;
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
  /**
   * Draws the flood fill algorithm result to the room given.
   * @param floodFill - The flood fill algorithm result
   * @param roomName - The room being drawn to
   */
  private floodFill(floodFill:number[][] | undefined, roomName:string){
    //If flood fill is defined iterate through cells
    if (floodFill != undefined) for (var i = 0; i < 50; i++) for (var j = 0; j < 50; j++) {
      //Make a different circle depending on the drawing
      switch(floodFill[i][j]){
        //Walls have no color
        case 0: break;
        //Infected are green
        case -1: new RoomVisual(roomName).circle(j,i, {fill: "#388E3C", opacity: 80}); break;
        //Not infected a nice blue color
        case 1: new RoomVisual(roomName).circle(j,i, {fill: "#303F9F", opacity: 80}); break;
      }
    }
  }
}
