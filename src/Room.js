/**
 * An inferior version of a room with some more advanced logic when needed.
 * 
 * @author Sugaku
 */
export class SugaRoom {

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
        if (room.memory.counts == undefined) this.memory.spawnTarget = "harvester";
    }
}
