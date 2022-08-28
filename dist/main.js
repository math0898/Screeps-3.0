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
     * @param {Creep} c The creep object of this SmartCreep. 
     */
     constructor (c) {
        this.creep = Game.creeps[c];
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
        this.creep.say("Hello World!");
    }
}

/**
 * Miners walk to a source and mine the source until death.
 * 
 * @author Sugaku
 */
class Miner extends EconomicCreep {

    /**
     * Generates the body for a Miner creep with the given
     * distance to a source and maximum capacity.
     * 
     * @param {Number} dis      The number of tiles to get to the source.
     * @param {Number} capacity The amount of energy that can be spent on this creep.
     */
    getBody (dis, capacity) {
        if (capacity <= 300 && dis <= 100) return [ WORK, MOVE, WORK, WORK ];  
        return body;
    }
}

console.log("Code Refreshed");
require('lodash');

var rooms;

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
global.Report = module.exports = {

    /**
     * Lists all currently visible and controlled rooms in a readable format.
     * 
     * @returns 0 on success
     */
    rooms () {
        console.log("Visible Rooms:");
        for (let r in Game.rooms) console.log("- " + r);
        console.log("Controlled Rooms:");
        for (let r in rooms) console.log("- " + rooms[r] + " (" + Game.rooms[rooms[r]].controller.level + ")");
        return 0;
    }
};

initRooms();

/**
 * The game's main execution loop.
 */
module.exports.loop = function () {
    for (let c in Game.creeps) {
        var m = new Miner(c);
        m.announceRole();
    }
};
//# sourceMappingURL=main.js.map
