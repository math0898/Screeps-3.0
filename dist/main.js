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
        this.getCreep().say("⚙" + this.getCreep().memory.role);
    }
    
    /**
     * Grabs the current version of the attached creep from the list of game objects.
     * 
     * @return {Creep} The creep object associated with this SmartCreep.
     */
    getCreep () {
        return Game.creeps[creepName];
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
}

/**
 * EconomicCreeps are related to the general economy of the creep civilization. They aren't given special privileges such
 * as O(n) calls.
 * 
 * @author Sugaku
 */
class EconomicCreep extends SmartCreep {

}

/**
 * Miners walk to a source and mine the source until death.
 * 
 * @author Sugaku
 */
class Miner extends EconomicCreep {

    /**
     * Returns the body that should be attached to this creep given the estimated move distance and available energy.
     * 
     * @param {Number} dis      The expected number of tiles this creep may need to walk.
     * @param {Number} capacity The amount of energy that can be spent on this creep.
     * @return {Number[]} The best body for this task with the given information.
     */
    getBody (dis, capacity) {
        if (capacity <= 300 && dis <= 100) return [ WORK, MOVE, WORK, WORK ];  
        return body;
    }
}

console.log("Code Refreshed");
require('lodash');

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
    for (let v in visuals) {
        if (v == "map") Game.map.visual.import(v);
        else global.Report.visualize(v);
    }
};
//# sourceMappingURL=main.js.map
