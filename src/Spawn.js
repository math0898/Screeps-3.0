import { Scout } from "./creeps/combat/Scout";
import { Harvester } from "./creeps/economy/Harvester";
import { Upgrader } from "./creeps/economy/Upgrader";

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
            var n; // TODO: Find a way to increase this number on subsequent spawns in same room.
            switch (spawn.room.memory.spawnTarget[0]) { // TODO: Make getBody() static.
                case "harvester":
                    n = "Harvester";
                    c = spawn.spawnCreep(new Harvester("").getBody(10, 300), this.generateName(spawn.room.name, n)); 
                    break;
                case "upgrader":
                    n = "Upgrader"
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
