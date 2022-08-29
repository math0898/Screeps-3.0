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
     * Runs room logic for this room.
     */
    runLogic () {
        var room = this.getRoom(); // TODO: Allow an array of spawn targets.
        if (room.memory.census == undefined) room.memory.spawnTarget = "harvester";
        else if (room.memory.census["harvester"] == undefined || room.memory.census["harvester"] < 3) room.memory.spawnTarget = "harvester";
        else room.memory.spawnTarget = undefined;

        if (room.memory.fill == undefined 
            || Game.getObjectById(room.memory.fill) == undefined 
            || Game.getObjectById(room.memory.fill).store.getFreeCapacity() == 0) {
            let low = room.find(FIND_STRUCTURES, {filter: s => (s.structureType == STRUCTURE_SPAWN && s.store.getFreeCapacity() > 0)});
            console.log();
            if (low.length == 0) room.memory.fill = undefined;
            else room.memory.fill = low[0].id;
        }

        this.resetCounts();
    }
}
