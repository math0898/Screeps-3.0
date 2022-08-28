'use strict';

/**
 * SmartCreep is a wrapper class for the Creep prototype with some helpful methods.
 * 
 * @author Sugaku
 */
class SmartCreep {

    /**
     * Creates a new SmartCreep with the given Creep reference.
     * 
     * @param {string} c The name of the Creep object of this SmartCreep. 
     */
    constructor (c) {
        this.creepName = c;
    }

    /**
     * Announces the role of this creep to creep.say().
     */
    announceRole () {

    }
    
    /**
     * Grabs the current version of the attached creep from the list of game objects.
     * 
     * @return {Creep} The creep object associated with this SmartCreep.
     */
    getCreep () {
        return Game.creeps[this.creepName];
    }

    /**
     * Returns the body that should be attached to this creep given the estimated move distance and available energy.
     * 
     * @param {Number} dis      The expected number of tiles this creep may need to walk.
     * @param {Number} capacity The amount of energy that can be spent on this creep.
     * @return {Number[]} The best body for this task with the given information.
     */
    getBody (dis, capacity) {
        return [ MOVE ];
    }

    /**
     * Runs the logic for this creep.
     * 
     * @return {Number} 0 - The logic ran successfully.
     */
    runLogic () {
        return 0;
    }

    /**
     * Called to have this creep add itself to the creep counts of their home room.
     */
    countSelf () {

    }
}

/**
 * EconomicCreeps are related to the general economy of the creep civilization. They aren't given special privileges such
 * as O(n) calls.
 * 
 * @author Sugaku
 */
class EconomicCreep extends SmartCreep {

    /**
     * Announces the role of this creep to creep.say().
     */
    announceRole () {
        let creep = this.getCreep();
        creep.say("⚙ " + creep.memory.role);
    }

    /**
     * Called to have this creep add itself to the creep counts of their home room.
     */
    countSelf () { // TODO: Simply doesn't work.
        let role = this.getCreep().memory.role;
        // console.log(role);
        let mem = this.getCreep().room.memory;
        if (mem.census[role] == undefined) mem.census[role] = 0;
        mem.census[role] += 1;
        // console.log(mem.census);
    }
}

/**
 * Harvesters are a narrow minded version of workers. They gather resources from sources; then fill spawns and extensions
 * with the energy they harvest.
 * 
 * @author Sugaku
 */
class Harvester extends EconomicCreep {

    /**
     * Returns the body that should be attached to this creep given the estimated move distance and available energy.
     * 
     * @param {Number} dis      The expected number of tiles this creep may need to walk.
     * @param {Number} capacity The amount of energy that can be spent on this creep.
     * @return {Number[]} The best body for this task with the given information.
     */
    getBody (dis, capacity) {
        if (capacity <= 300 && dis <= 100) return [ WORK, MOVE, CARRY, CARRY, MOVE ];  
        return body;
    }

    /**
     * Runs the logic for this creep.
     * 
     * @return {Number} 0 - The logic ran successfully.
     */
    runLogic () {
        this.announceRole();
        return 0;
    }
}

/**
 * Spawns don't need have their own object each so we need only define a function. Hance the static methods.
 * 
 * @author Sugaku
 */
class Spawns {

    /**
     * A simple utility method to format creep names.
     * 
     * @param {String} room This creep will spawn into.
     * @param {String} role The role this creep will be given. 
     */
    static generateName (room, role) {
        return "[" + room + "] " + role + " " + Game.time;
    }

    /**
     * Runs general spawning logic on the given spawn.
     * 
     * @param {String} s The name of the spawn to run logic on.
     */
    static runSpawnLogic (s) {
        let spawn = Game.spawns[s];
        if (spawn.room.memory.spawnTarget != undefined) {
            var c = -1;
            switch (spawn.room.memory.spawnTarget) { // TODO: Make getBody() static.
                case "harvester": 
                    c = spawn.spawnCreep(new Harvester("").getBody(10, 300), this.generateName(spawn.room.name, "Harvester")); 
                    break;
            } // TODO: Finding the name needs to be done differently.
            if (c == OK) Game.creeps[this.generateName(spawn.room.name, "Harvester")].memory.role = spawn.room.memory.spawnTarget; 
        }
    }
}

/**
 * An inferior version of a room with some more advanced logic when needed.
 * 
 * @author Sugaku
 */
class SugaRoom {

    /**
     * Resets the census counts for this room.
     */
    resetCounts () {
        var room = this.getRoom();
        room.memory.census = [];
        room.memory.census["harvester"] = 0;
    }

    /**
     * Creates a new SugaRoom with the given room name.
     * 
     * @param {String} name The name of the room that will be attached to this SugaRoom.
     */
    constructor (name) {
        this.name = name;
    }

    /**
     * Grabs the RoomPrototype from the game.
     * 
     * @return {Room} The game room instance attached to this SugaRoom.
     */
    getRoom () {
        return Game.rooms[this.name];
    }

    /**
     * Runs room logic for this room.
     */
    runLogic () {
        var room = this.getRoom(); // TODO: Allow an array of spawn targets.
        if (room.memory.census == undefined) room.memory.spawnTarget = "harvester";
        else room.memory.spawnTarget = undefined;
        console.log(room.memory.census);
        this.resetCounts();
        console.log(room.memory.census);
    }
}

console.log("Code Refreshed");

require('lodash');

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
};

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
};
//# sourceMappingURL=main.js.map
