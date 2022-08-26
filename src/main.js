let _ = require('lodash');
import { Miner } from "./creeps/economy/Miner";

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
}
