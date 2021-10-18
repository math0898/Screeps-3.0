/**
 * The compareRoomPos() function takes two room positions and compares them.
 * It returns true if and only if they are equal. If either are undefined the
 * function returns false.
 * 
 * @param {RoomPosition} a The first room to compare
 * @param {RoomPosition} b The second room to compare
 */
function compareRoomPos (a, b) {
    if (typeof a != RoomPosition || typeof b != RoomPosition) return false;
    if(a != undefined && b != undefined) {
        if(a.x != b.x) return false;
        if(a.y != b.y) return false;
        if(a.roomName != b.roomName) return false;
        return true;
    } else return false;
}

/**
 * An extension of the Creep prototype. This function is meant to replace
 * creep.moveTo(target). In general it is also more efficient.
 * 
 * @param {RoomPosition} t The target position you wnt the creep to reach
 * @return 1 Path found.
 * @return 0 Function completed as intended.
 * @return -1 Parameter is not of type RoomPosition.
 * @return -11 Creep is fatigued.
 * @return -666 Uh...
 */
Creep.prototype.smartMove = function (t) {
    if (typeof t != RoomPosition) return -1;
    if (this.fatigue > 0) return -11; //Creep is fatigued

    const step = this.memory.pathStep;
    const path = this.memory.path;

    if (compareRoomPos(this.memory.pathTarget, t) || step == path?.length) {
        this.memory.path = this.pos.findPathTo(t, {ignoreCreeps: false});
        this.memory.pathTarget = t;
        this.memory.pathStep = 0;
        return 1; //Path found
    }
  
    if(path != undefined && step != undefined) {
        if (path[step] != undefined) {
            this.move(path[step].direction);
            this.memory.pathStep = step + 1;
            return 0; //Function completed as intended
        }
    }
    return -666; //Uh....
}

/**
 * An extension of the Creep prototype. This function is meant to replace
 * creep.harvest(target), and some relevant processes usually required to use
 * the function. In general it is also more efficient than trying to use those
 * extra processes and creep.harvest(target), Creep.memory.source should be
 * defined as a game object id if a specific source is desired.
 * 
 * @return 1 No source target was found so one was found.
 * @return 0 Function completed as intended.
 * @return -1 A game object of that id could not be found.
 */
Creep.prototype.smartHarvest = function () {
    const sid = this.memory.source;

    if (sid == undefined) {
        const t = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (t != null) this.memory.source = t.id;
        return 1; //No source target was found so one was found
    }

    const s = Game.getObjectById(sid);

    if(s != null && s.energy != 0) {
        if (!(this.pos.isNearTo(s))) this.smartMove(s.pos);
        else this.harvest(s);
        return 0; //Function completed as intended

    } else {
        this.memory.source = undefined;
        return -1; //A game object of that id could not be found
    }
}