console.log("Code Refreshed");
let _ = require('lodash');
import { Miner } from "./creeps/economy/Miner";

var rooms;
var visuals = new Array();

/**
 * Attempts to locate all the rooms currently under this bot's control. They are then placed into a helpful array to
 * to be referenced later.
 */
function initRooms () {
    rooms = new Array();
    for (var s in Game.structures) {
        let structure = Game.structures[s];
        if (structure.structureType != STRUCTURE_CONTROLLER) continue;
        if (structure.my) rooms.push(structure.room.name);
    }
}

/**
 * A collection of helpful functions for reporting how the bot is functioning to console.
 * 
 * @author Sugaku
 */
global.Report = {

    /**
     * Creates a visual display of current information.
     * 
     * @param {String} room The room to display the visuals for.
     * @returns 0 on success.
     */ // TODO: Map visuals
    visualize (room) {
        let roomVis = new RoomVisual(room);
        roomVis.rect(new RoomPosition(0, 0, room), 49, 1, {fill: "#000000", opacity: 0.5})
                .text("-=CPU STATS=-", 4.5, 0.75, {color: '#ffffff', opacity: 0.8})
                .rect(new RoomPosition(1, 1, room), 7, 1, {fill: '#5b5b5b', opacity: 0.5})
                .rect(new RoomPosition(1, 1, room), Game.cpu.getUsed() / 14.28, 1, {fill: '#ffffff', opacity: 0.8})
                .text("CPU: " + Math.round(Game.cpu.getUsed()) + " / " + Game.cpu.limit, 4.5, 1.75, 
                        {color: '#000000', opacity: 0.8})
                .rect(new RoomPosition(1, 2, room), 7, 1, {fill: '#5b5b5b', opacity: 0.5})
                .rect(new RoomPosition(1, 2, room), Game.cpu.bucket / 1428, 1, {fill: '#ffffff', opacity: 0.8})
                .text("BUCKET: " + Game.cpu.bucket, 4.5, 2.75, {color: '#000000', opacity: 0.8});
        visuals[room] = roomVis.export();
        return 0;
    },

    /**
     * Lists all currently visible and controlled rooms in a readable format.
     * 
     * @returns 0 on success.
     */
    rooms () {
        console.log("Visible Rooms:");
        for (let r in Game.rooms) console.log("- " + r);
        console.log("Controlled Rooms:");
        for (let r in rooms) console.log("- " + rooms[r] + " (" + Game.rooms[rooms[r]].controller.level + ")");
        return 0;
    }
}

initRooms();

/**
 * The game's main execution loop.
 */
module.exports.loop = function () {
    for (let c in Game.creeps) {
        var m = new Miner(c);
        m.announceRole();
    }
    for (let v in visuals) {
        if (v == "map") Game.map.visual.import(v);
        else global.Report.visualize(v);
    }
}
