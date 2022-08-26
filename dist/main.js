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
 * EconomicCreeps are related to the general economy of the creep civilization.
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

require('lodash');

let rooms = new Array();

function initRooms () {
    for (var r in Game.rooms) {
        let room = Game.rooms[r];
        if (room.controller.my) rooms.push(room);
    }
}

initRooms();

module.exports.loop = function () {
    for (let c in Game.creeps) {
        var m = new Miner(c);
        m.announceRole();
    }
};
//# sourceMappingURL=main.js.map
