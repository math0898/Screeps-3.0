const { Harvester } = require("./creeps/economy/Harvester");

/**
 * A simple utility method to format creep names.
 * 
 * @param {String} room This creep will spawn into.
 * @param {String} role The role this creep will be given. 
 */
function generateName (room, role) {
    return "[" + room + "] " + role + " " + Game.time;
}

/**
 * Spawns don't need have their own object each so we need only define a function. However I think it'd be cleaner for this
 * function to be defined in a file other than main. Hence the unique import situation.
 */
module.exports = {

    /**
     * Runs general spawning logic on the given spawn.
     * 
     * @param {String} s The name of the spawn to run logic on.
     */
    runSpawnLogic: function (s) {
        let spawn = Game.spawns[s];
        if (spawn.room.memory.spawnTarget != undefined) {
            switch (spawn.room.memory.spawnTarget) { // TODO: Make getBody() static.
                case "harvester": 
                    spawn.spawnCreep(new Harvester("").getBody(10, 300), generateName(spawn.room.name, "Harvester")); 
                    break;
            }
        }
    }
};
