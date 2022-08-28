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
        else room.memory.spawnTarget = undefined;
        console.log(room.memory.census);
        this.resetCounts();
        console.log(room.memory.census);
    }
}
