console.log("Code Refreshed");

let _ = require('lodash');
import { Spawns } from "./Spawn";
import { SugaRoom } from "./Room";
import { Harvester } from "./creeps/economy/Harvester";
import { Miner } from "./creeps/economy/Miner";

var rooms;
var visuals = new Array();
var creeps = new Array();

/**
 * Attempts to locate all the rooms currently under this bot's control. They are then placed into a helpful array to
 * to be referenced later.
 */
function initRooms () {
    rooms = new Array();
    for (var s in Game.structures) {
        let structure = Game.structures[s];
        if (structure.structureType != STRUCTURE_CONTROLLER) continue;
        if (structure.my) rooms.push(new SugaRoom(structure.room.name));
    }
}

/**
 * The main CreepAI execution loop. This loop also takes a census of alive creeps per room.
 * 
 * Runtime: O(n) -> n is the number of creeps.
 */
function creepAI () {
    for (let c in Game.creeps) {
        if (creeps[c] == undefined) {
            switch (Game.creeps[c].memory.role) {
                case "harvester": creeps[c] = new Harvester(c); break;
            }
        }
        creeps[c].runLogic();
        creeps[c].countSelf();
    }
}

/**
 * The main RoomAI execution loop. Rooms are allowed to search for structures and potential targets.
 * 
 * Runtime: O(r * (c + s)) -> r is the number of rooms, c is the number of creeps, and s is the number of structures. 
 */
function roomAI () {
    for (let r in rooms) rooms[r].runLogic();
}

/**
 * The main SpawnAI execution loop. Spawns pull spawn targets from room memory.
 * 
 * Runtime: O(n) -> n is the number of spawns.
 */
function spawnAI () {
    for (let s in Game.spawns) Spawns.runSpawnLogic(s);
}

/**
 * Collects telemetry on the current state of the bot overall.
 */
function telemetry () {

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
    },

    /**
     * Lists all currently alive creeps in a readable format.
     * 
     * @returns 0 on success.
     */
    creeps() {
        console.log("Alive Creeps:");
        for (let c in creeps) console.log("- " + c + " (" + 
                (Game.creeps[c] == undefined ? "undefined" : Memory.creeps[c].role) + ")");
        return 0;
    }
}

initRooms();

/**
 * The game's main execution loop.
 */
module.exports.loop = function () {
    creepAI();
    roomAI();
    spawnAI();
    for (let v in visuals) {
        if (v == "map") Game.map.visual.import(v);
        else global.Report.visualize(v);
    }
    telemetry();
}
