import { Harvester } from "./creeps/economy/Harvester";

/**
 * Spawns don't need have their own object each so we need only define a function. Hance the static methods.
 * 
 * @author Sugaku
 */
export class Spawns {

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
            if (c == OK) Game.creeps[this.generateName(spawn.room.name, "Harvester")].memory = spawn.room.memory.spawnTarget; 
        }
    }
}
