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
     * An optimized version of the creep.moveTo() command.
     * 
     * Self plagiarized from https://github.com/math0898/Screeps-2.0/blob/main/src/CreepTypes/CreepRole.ts#L31
     * 
     * @param {RoomPosition} pos The target position to move to.
     */
    smartMove (pos) {
        let creep = this.getCreep();
        if (creep.fatigue > 0) return -11; //Creep is fatigued

        const step = creep.memory.pathStep;
        const path = creep.memory.path;
      
        if (creep.memory.pathTarget == creep.pos || path == undefined || step == path.length) {
          creep.memory.path = creep.pos.findPathTo(pos, {ignoreCreeps: false});
          creep.memory.pathTarget = pos.pos;
          creep.memory.pathStep = 0;
          return 1; //Path found
        }
      
        if(path != undefined && step != undefined) {
          if (path[step] != undefined) {
            creep.move(path[step].direction);
            creep.memory.pathStep = step + 1;
            return 0; //Function completed as intended
          }
        }
        return -666; //Uh....
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
 * CombatCreeps are related to the general fighting aspects of the game.
 * 
 * @author Sugaku
 */
class CombatCreep extends SmartCreep {

    /**
     * Creates a new CombatCreep with the given Creep reference.
     * 
     * @param {string} c The name of the Creep object of this SmartCreep. 
     */
    constructor (c) {
        super(c);
        if (c == "") return;
        let creep = this.getCreep();
        creep.memory.homeRoom = creep.room.name;
    }

    /**
     * Announces the role of this creep to creep.say().
     */
    announceRole () {
        let creep = this.getCreep();
        creep.say("⚔ " + creep.memory.role);
    }

    /**
     * Called to have this creep add itself to the creep counts of their home room.
     */
    countSelf () {
        let creep = this.getCreep();
        let role = creep.memory.role;
        let mem = Game.rooms[creep.memory.homeRoom].memory;
        if (mem.census[role] == undefined) mem.census[role] = 0;
        mem.census[role] += 1;
    }
}

/**
 * Scouts are very simple creeps with a single move part.
 * 
 * @author Sugaku
 */
class Scout extends CombatCreep {
    
    /**
     * Creates a new CombatCreep with the given Creep reference.
     * 
     * @param {string} c The name of the Creep object of this SmartCreep. 
     */
    constructor (c) {
        super(c);
        if (c == "") return;
        let creep = this.getCreep();
        if (Game.flags["Scout " + creep.room.name] == undefined) {
            creep.suicide();
            return;
        }
        creep.memory.target = Game.flags["Scout " + creep.room.name].pos.roomName;
    }

    /**
     * Runs the logic for this creep.
     * 
     * @return {Number} 0 - The logic ran successfully.
     */
    runLogic () {
        let creep = this.getCreep();
        creep.say('🛰', true);
        if (creep.memory.target != undefined) this.smartMove(new RoomPosition(25, 25, creep.memory.target));
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
        let mem = this.getCreep().room.memory;
        if (mem.census[role] == undefined) mem.census[role] = 0;
        mem.census[role] += 1;
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
        let creep = this.getCreep();
        let room = creep.room;
        if (creep.memory.working) {
            let fill = Game.getObjectById(room.memory.fill);
            if (creep.transfer(fill, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) this.smartMove(fill);
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) creep.memory.working = false;
        } else {
            let source = Game.getObjectById(room.memory.sources[0]);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) this.smartMove(source);
            if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) creep.memory.working = true;
        }
        this.announceRole();
        return 0;
    }
}

/**
 * 
 */
class Upgrader extends EconomicCreep {

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
        let creep = this.getCreep();
        let room = creep.room;
        if (creep.memory.working) {
            let controller = room.controller;
            if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) this.smartMove(controller);
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) creep.memory.working = false;
        } else {
            let source = Game.getObjectById(room.memory.sources[0]);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) this.smartMove(source);
            if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) creep.memory.working = true;
        }
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
            var n; // TODO: Find a way to increase this number on subsequent spawns in same room.
            switch (spawn.room.memory.spawnTarget[0]) { // TODO: Make getBody() static.
                case "harvester":
                    n = "Harvester";
                    c = spawn.spawnCreep(new Harvester("").getBody(10, 300), this.generateName(spawn.room.name, n)); 
                    break;
                case "upgrader":
                    n = "Upgrader";
                    c = spawn.spawnCreep(new Upgrader("").getBody(10, 300), this.generateName(spawn.room.name, n));
                    break;
                case "scout":
                    n = "Scout";
                    c = spawn.spawnCreep(new Scout("").getBody(10, 300), this.generateName(spawn.room.name, n));
                    break;
            } // TODO: Finding the name needs to be done differently.
            if (c == OK) Game.creeps[this.generateName(spawn.room.name, n)].memory.role = spawn.room.memory.spawnTarget[0];
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
        let room = Game.rooms[name];
        let sources = room.find(FIND_SOURCES);
        room.memory.sources = [];
        for (var i = 0; i < sources.length; i++) room.memory.sources[i] = sources[i].id;
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
     * Identifies potential spawn targets for this room.
     */
    identifySpawnTargets () {
        let room = this.getRoom();

        room.memory.spawnTarget = [];

        if (room.memory.census == undefined) room.memory.spawnTarget.push("harvester");
        if (Game.flags["Scout " + room.name] != undefined && (room.memory.census["scout"] == undefined || room.memory.census["scout"] < 1)) room.memory.spawnTarget.push("scout");
        if (room.memory.census["harvester"] == undefined || room.memory.census["harvester"] < 3) room.memory.spawnTarget.push("harvester");
        if (room.memory.census["upgrader"] == undefined || room.memory.census["upgrader"] < 3) room.memory.spawnTarget.push("upgrader");
        if (room.memory.spawnTarget.length == 0) room.memory.spawnTarget = undefined;
    }

    /**
     * Runs room logic for this room.
     */
    runLogic () {
        var room = this.getRoom(); // TODO: Allow an array of spawn targets.
        this.identifySpawnTargets();

        if (room.memory.fill == undefined 
            || Game.getObjectById(room.memory.fill) == undefined 
            || Game.getObjectById(room.memory.fill).store.getFreeCapacity() == 0) {
            let low = room.find(FIND_MY_STRUCTURES, {filter: (s) => (s.store != undefined && s.structureType != STRUCTURE_STORAGE && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0)});
            console.log();
            if (low.length == 0) room.memory.fill = undefined;
            else room.memory.fill = low[0].id;
        }

        this.resetCounts();
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
                case "upgrader": creeps[c] = new Upgrader(c); break;
                case "scout": creeps[c] = new Scout(c); break;
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
