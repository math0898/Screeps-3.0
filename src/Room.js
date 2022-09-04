/**
 * An inferior version of a room with some more advanced logic when needed.
 * 
 * @author Sugaku
 */
export class SugaRoom {

    /**
     * Resets the census counts for this room.
     */
    resetCounts () {
        var room = this.getRoom();
        room.memory.census = [];
        room.memory.census["harvester"] = 0;
    }

    /**
     * Creates a new SugaRoom with the given room name.
     * 
     * @param {String} name The name of the room that will be attached to this SugaRoom.
     */
    constructor (name) {
        this.name = name;
        let room = Game.rooms[name];
        let sources = room.find(FIND_SOURCES);
        room.memory.sources = [];
        for (var i = 0; i < sources.length; i++) room.memory.sources[i] = sources[i].id;
    }

    /**
     * Grabs the RoomPrototype from the game.
     * 
     * @return {Room} The game room instance attached to this SugaRoom.
     */
    getRoom () {
        return Game.rooms[this.name];
    }

    /**
     * Identifies potential spawn targets for this room.
     */
    identifySpawnTargets () {
        let room = this.getRoom();

        room.memory.spawnTarget = [];

        if (room.memory.census == undefined) room.memory.spawnTarget.push("harvester");
        if (Game.flags["Scout " + room.name] != undefined && (room.memory.census["scout"] == undefined || room.memory.census["scout"] < 1)) room.memory.spawnTarget.push("scout");
        if (room.memory.census["harvester"] == undefined || room.memory.census["harvester"] < 3) room.memory.spawnTarget.push("harvester");
        if (room.memory.census["upgrader"] == undefined || room.memory.census["upgrader"] < 3) room.memory.spawnTarget.push("upgrader");
        if (room.memory.spawnTarget.length == 0) room.memory.spawnTarget = undefined;
    }

    /**
     * Runs room logic for this room.
     */
    runLogic () {
        var room = this.getRoom();
        this.identifySpawnTargets();

        if (room.memory.fill == undefined 
            || Game.getObjectById(room.memory.fill) == undefined 
            || Game.getObjectById(room.memory.fill).store.getFreeCapacity() == 0) {
            let low = room.find(FIND_MY_STRUCTURES, {filter: (s) => (s.store != undefined && s.structureType != STRUCTURE_STORAGE && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0)});
            if (low.length == 0) room.memory.fill = undefined;
            else room.memory.fill = low[0].id;
        }

        this.resetCounts();
    }
}
