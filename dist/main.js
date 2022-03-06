'use strict';

class EconomicCreep {
    // TODO
}

class Miner extends EconomicCreep {

    /**
     * Creates a new Miner with the given Creep reference.
     * 
     * @param {Creep} c The creep object of this Miner. 
     */
    constructor (c) {
        super();
        this.creep = Game.creeps[c];
    }

    announceRole () {
        this.creep.say("I'm a miner!");
    }
}

module.exports.loop = function () {
    for (let c in Game.creeps) {
        var m = new Miner(c);
        m.announceRole();
    }
    console.log('Hello World!');
};
//# sourceMappingURL=main.js.map
