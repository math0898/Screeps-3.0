console.log("Code Refreshed");
let _ = require('lodash');
import { Miner } from "./creeps/economy/Miner";

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
     * Creates a visual display of current information.
     */

    /**
     * Creates a visual display of current information.
     * 
     * @param {Number} ticks The number of ticks to display the visuals for.
     * @returns 0 on success.
     */
    visualize (ticks) {
        this.displayTicks = ticks;
        Game.map.visual.rect({x: 0, y: 0}, 50, 1, {fill: "#ff000", opacity: 0.2});
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
}
