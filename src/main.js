import { Miner } from "./economy/Miner";

module.exports.loop = function () {
    for (let c in Game.creeps) {
        var m = new Miner(c);
        m.announceRole();
    }
    console.log('Hello World!');
}
