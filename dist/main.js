'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * This enum cotains a couple number threasholds which are used later in this
 * file and in main.ts to determine how urgent a task may be. High number means
 * more urgency.
 */
var priority;
(function (priority) {
    priority[priority["HIGH"] = 100] = "HIGH";
    priority[priority["MEDIUM"] = 50] = "MEDIUM";
    priority[priority["LOW"] = 25] = "LOW";
    priority[priority["NONE"] = 0] = "NONE";
})(priority || (priority = {}));
/**
 * The Request class defines what a request looks like when it's sent from
 * somewhere other than main.ts. With the exception of main.ts every added to
 * the queue will be a version of the Request class at some point.
 */
class Request {
    /**
     * This describes the basic construction of a priority. Similar to the Request
     * class its fairly basic and just requires the setting of local counterparts.
     * Runtime: O(2)
     * @param t The described in the request
     * @param p The prioirty the task should be run at
     */
    constructor(t, p) { this.task = t; this.prio = p; } //O(2)
    /**
     * getTask() returns the task in the Request object.
     * Runtime: O(1)
     */
    getTask() { return this.task; } //O(1)
    /**
     * The getPrio method returns the priority of the Request object.
     * Runtime: O(1)
     */
    getPrio() { return this.prio; } //O(1)
}
/**
 * This class, Queue implements a queue object which contains a list of tasks
 * to be run in reverse order on the priority level. For example if you add a, b
 * and c at priority HIGH once the queue starts the HIGH prioity it will resolve
 * in, c -> b -> a, assuming there's sufficent cpu remaining.
 */
class Queue {
    constructor() {
        /**
         * highTasks contains an array of tasks objects which are assumed to have a
         * priority of HIGH. Tasks with a HIGH priority are run without consideration
         * for cpu usage.
         */
        this.highTasks = [];
        /**
         * The mediumTasks array contains an array of tasks objects which are assumed
         * to have a priority of MEDIUM. Tasks are often run quickly with some
         * consideration for CPU usage.
         */
        this.mediumTasks = [];
        /**
         * This variable, lowTasks contains an array of task objects which are assumed
         * to have a priority of LOW. These tasks are run when they do not pose much
         * risk to going over on CPU.
         */
        this.lowTasks = [];
        /**
         * tasks contains an array of tasks objects which are assumed to have no
         * priority. A few examples of tasks which may end up here include various
         * screen drawing functions and console logging. Tasks at this level do not
         * run if they have the potential to go over on CPU.
         */
        this.tasks = [];
    }
    /**
     * The printQueue method prints all the items in the queue to the console in a
     * hopefully human readable format.
     * Runtime: O(9 + 5h + 5m + 5l + 5t) or O(9 + 5n) where n is the number of
     * tasks in all arrays
     */
    printQueue() {
        //Nice header
        console.log("---- Queue: ----"); //O(1)
        //Print a sub header
        console.log(priority.HIGH + ": "); //O(2)
        //Iterate through the list and print
        for (var j = 0; j < this.highTasks.length; j++)
            console.log("    " + this.highTasks[j].getName()); //O(3 + 5h)
        //Print a sub header
        console.log(priority.MEDIUM + ": "); //O(4 + 5h)
        //Iterate through the list and print
        for (var j = 0; j < this.mediumTasks.length; j++)
            console.log("    " + this.mediumTasks[j].getName()); //O(5 + 5h + 5m)
        //Print a sub header
        console.log(priority.LOW + ": "); //O(6 + 5h + 5m)
        //Iterate through the list and print
        for (var j = 0; j < this.lowTasks.length; j++)
            console.log("    " + this.lowTasks[j].getName()); //O(7 + 5h + 5m + 5l)
        //Print a sub header
        console.log(priority.NONE + ": "); //O(8 + 5h + 5m + 5l)
        //Iterate through the list and print
        for (var j = 0; j < this.tasks.length; j++)
            console.log("    " + this.tasks[j].getName()); //O(9 + 5h + 5m + 5l + 5t)
    }
    /**
     * This method runQueue runs the queue object with all of the given tasks. It
     * checks cpu before every task is run if it has reached a total cpu usage of
     * 50% before then but skips the check if bellow. Without considering that the
     * runtime of this method can vary wildly in runtime depending on the tasks
     * that are in the queue. As such I have opted not to give this method a
     * formal runtime analysis and most optimizations should be done in the tasks
     * themselves or in the free reign threashold which is currently 50%.
     */
    runQueue() {
        var _a, _b, _c, _d, _e, _f, _g;
        //Run all of the high tasks regardless of cpu
        while (this.highTasks.length > 0)
            (_a = this.highTasks.pop()) === null || _a === void 0 ? void 0 : _a.run();
        //Run all of the medium tasks if we're bellow 50% usage
        if (Game.cpu.getUsed() < Game.cpu.limit * 0.5)
            while (this.mediumTasks.length > 0)
                (_b = this.mediumTasks.pop()) === null || _b === void 0 ? void 0 : _b.run();
        //Run medium tasks until within 98% if we're above 50% usage
        else
            while (this.mediumTasks.length > 0 && Game.cpu.getUsed() < Game.cpu.limit * 0.98)
                (_c = this.mediumTasks.pop()) === null || _c === void 0 ? void 0 : _c.run();
        //Run all of the low tasks if we're bellow 50% usage
        if (Game.cpu.getUsed() < Game.cpu.limit * 0.5)
            while (this.lowTasks.length > 0)
                (_d = this.lowTasks.pop()) === null || _d === void 0 ? void 0 : _d.run();
        //Run low tasks until within 95% if we're above 50% usage
        else
            while (this.lowTasks.length > 0 && Game.cpu.getUsed() < Game.cpu.limit * 0.95)
                (_e = this.lowTasks.pop()) === null || _e === void 0 ? void 0 : _e.run();
        //Run all no prioirty tasks if we're bellow 50% usage
        if (Game.cpu.getUsed() < Game.cpu.limit * 0.5)
            while (this.tasks.length > 0)
                (_f = this.tasks.pop()) === null || _f === void 0 ? void 0 : _f.run();
        //Run no priority tasks until we're within 10% of cap
        else
            while (this.tasks.length > 0 && Game.cpu.getUsed() < Game.cpu.limit * 0.90)
                (_g = this.tasks.pop()) === null || _g === void 0 ? void 0 : _g.run();
    }
    /**
     * queueAdd adds an item to the queue immediatly, defaulting to a priority of
     * zero, unless one is provided.
     * Runtime: O(3)
     * @param t The task to be added to the queue
     * @param p the priority for the item to be added, defaults to no priority
     */
    queueAdd(t, p = priority.NONE) {
        //Check the priority this should be added at
        switch (p) { //O(1)
            //We're adding the item to the highTasks
            case priority.HIGH:
                this.highTasks.push(t);
                break; //O(3)
            //We're adding the item to the mediumTasks
            case priority.MEDIUM:
                this.mediumTasks.push(t);
                break; //O(3)
            //We're adding the item to the lowTasks
            case priority.LOW:
                this.lowTasks.push(t);
                break; //O(3)
            //We're adding the item to the tasks
            case priority.NONE:
                this.tasks.push(t);
                break; //O(3)
        }
    }
    /**
     * The request method works as a way for tasks to request other tasks to be
     * completed. Requests must be proccessed to a Queue object before they can
     * run.
     * Runtime: O(4)
     * @param t The task to be added to the requests array
     * @param p The priority for the request to be added, defaults to no priority
     */
    static request(t, p = priority.NONE) {
        //Make a quick request then push it to the array
        var request = new Request(t, p); //O(3)
        //Add it to the array to be proccessed later
        Queue.requests.push(request); //O(4)
    }
    /**
     * Proccesses all the requests that are in the requests array held on the
     * Queue static item. The object proccessRequests is called on will hold the
     * requests in its Queue.
     * Runtime: O(2 + 6n) where n is the length of the requests array
     */
    proccessRequests() {
        //Iterate through the requests and add them to the queue
        for (var i = 0; i < Queue.requests.length; i++)
            this.queueAdd(Queue.requests[i].getTask(), Queue.requests[i].getPrio()); //O(1 + 6n)
        //Clear the requests array
        Queue.requests = []; //O(2 + 6n)
    }
    /**
     * prugeDuplicateRequests removes all requests which are duplicates. This
     * prevents certain algorithms from running multiple times per tick such as
     * distanceTransform.
     * Runtime: O(2n) where n is the length of the requests array
     */
    static purgeDuplicateRequests() {
        //An array of request names
        var have = [];
        //A temporary array to store requests once they've been confirmed unique
        var temp = [];
        //Iterate through the requests and check if they've been in the array
        for (var i = 0; i < Queue.requests.length; i++) {
            //Check if its in the array
            if (have.indexOf(Queue.requests[i].getTask().getName()) > -1)
                continue;
            //If its not in the array add it
            have.push(Queue.requests[i].getTask().getName());
            //Add it to the temp array
            temp.push(Queue.requests[i]);
        }
        //Update the requests array with the purged copy
        Queue.requests = temp;
    }
}
/**
 * By default requests are empty but requests can be added by other tasks and
 * classes which need something to be done. requests are static and not bound
 * to any particular Queue object but are removed once they've entered a
 * specific queue.
 */
Queue.requests = [];

/**
 * A simple class which implements getName() so I don't have to a hundred times
 * over lol xD
 */
class template {
    //Constructor
    /**
     * Implementations of task should call this constructor with their name so it
     * can be private and not changed in the future.
     */
    constructor(n) {
        //Variables
        /**
         * A string varaible which stores the shorthand name for the task.
         */
        this.name = "Undefined";
        this.name = n;
    }
    //Accessor methods
    /**
     * Returns the name of the task
     */
    getName() { return this.name; }
}

/**
 * This file handles the definitions for the statsmamanger class. The stats class
 * handles tracking, logging, and printing of script preformence.
 */
class StatsManager {
    //Constructor
    /**
     * Runs setup for the StatsManager so it can run without issue.
     * Runtime: O(c) ---> Runs in constant time.
     */
    constructor() {
        //Initalize if we haven't
        if (StatsManager.getInitStatus() == false)
            StatsManager.init();
    }
    //Accessor methods
    static getInitStatus() {
        //Check the memory locations that need to be set if any are undefined we need to init
        //Check if we think we're initalized
        if (Memory.statsInit != true)
            return false;
        //Check the running average of cpu
        else if (Memory.cpuAverage == undefined)
            return false;
        //We must be all good then
        else
            return true;
    }
    //Real methods
    /**
     * This function initalizes the memory to take in stats.
     */
    static init() {
        //Set up the number of ticks we've collected data
        Memory.dataCollected = 0;
        //Set up the average cpu so far
        Memory.cpuAverage = 0;
        //Set up the peak cpu recorded
        Memory.cpuPeak = 0;
        //Set the fact we're initalized
        Memory.statsInit = true;
        //Set the tick we've started on
        Memory.startTick = Game.time;
        //Success
        return 0;
    }
    /**
     * Prints the stats collected, these are stored in Memory.stats.
     * Runtime: O(c) ---> Runs in constant time.
     */
    static print() {
        //Print a nice header
        console.log("---- Preformence Report ----");
        //The tick we begun collecting data on
        console.log("Tick Started on: " + Memory.startTick);
        //The tick we're on
        console.log("Tick Ended on: " + Game.time);
        //Data capture rate
        console.log("Data Captured on: " + (Memory.dataCollected - 1) + " / " + (Game.time - Memory.startTick) + " for a rate of " + Math.fround((Memory.dataCollected - 1) / (Game.time - Memory.startTick) * 100) + "%");
        //Print the average cpu used
        console.log("Average CPU Usage: " + Memory.cpuAverage);
        //Print the peak cpu used
        console.log("Peak CPU Usage: " + Memory.cpuPeak);
        //Report everything was successful
        return 0;
    }
    /**
     * Collects all the stats for cpu this tick.
     * Runtime: O(c) ---> Runs in constant time.
     */
    static collectCpu() {
        //Temp
        var cpuUsed = Game.cpu.getUsed();
        //Read memory
        var count = Memory.dataCollected;
        var average = Memory.cpuAverage;
        var peak = Memory.cpuPeak;
        //Do the maths for the new average
        var newAverage = ((average * count) + cpuUsed) / (count + 1);
        //Set the new peak if current tick is higher
        if (peak < cpuUsed)
            Memory.cpuPeak = cpuUsed;
        //Write to memory and increment our count
        Memory.cpuAverage = newAverage;
    }
    /**
     * Collects the stats for the StatsManager.
     */
    static collectStats() {
        //Collect Cpu data.
        this.collectCpu();
        //Increment the fact we collected data
        Memory.dataCollected++;
    }
}
/**
 * The collect_Stats task collects all the stats for the given tick.
 * Runtime: O(c) ---> Runs in constant time
 */
class collect_Stats extends template {
    //Constructors
    constructor() { super("Collect Stats"); }
    //Real methods
    run() {
        //Collect the stats... its really just that easy.
        StatsManager.collectStats();
    }
}

/**
 * This file contains the definitions for the Room class which defines a room,
 * whether hostile or not and assigns it certain properties.
 * @Author Sugaku, math0898
 */
/**
 * This enum holds definitions for the states that a room can be in.
 */
var state;
(function (state) {
    state["ALLIED"] = "allied";
    state["CONTROLLED"] = "controlled";
    state["HOSTILE"] = "hostile";
    state["EXPAND"] = "expand";
    state["MINE"] = "mine";
    state["UNKOWN"] = "unkown";
})(state || (state = {}));
/**
 * The room class. Handles information about rooms.
 */
class struc_Room {
    //Constructors
    /**
     * Constructs a room when given a hash for Game.rooms.
     * Runtime: O(f) ---> find command used.
     */
    constructor(name) {
        var _a, _b;
        //Refrence which points to the room in the future
        this.roomRefrence = name;
        //The current state of the room.
        this.roomState = this.findRoomState(); //O(f) ---> find command used.
        //Short hand the room name so we don't need to type that out all the time.
        const r = Game.rooms[name];
        //Check if the controlled is defined, if so set the level to it.
        if (r.controller != undefined)
            this.roomLevel = r.controller.level;
        //Otherwise set level to -1, there is no controller.
        else
            this.roomLevel = -1;
        //The owner of the room... is possible to be undefined in which case :shrug:
        this.roomOwner = (_b = (_a = r.controller) === null || _a === void 0 ? void 0 : _a.owner) === null || _b === void 0 ? void 0 : _b.username;
        //Set the spawn arrays
        this.roomSpawns = Game.rooms[this.roomRefrence].find(FIND_MY_SPAWNS);
        //Reset the total creep count for the room
        this.creepCount = 0;
        //Count the number of creeps which have this room as a refrence
        for (let c in Game.creeps) {
            //Check if their memory has a refrence to the room and increment if it does
            if (Game.creeps[c].memory.room == this.roomRefrence && Game.creeps[c] != undefined)
                this.creepCount++;
        }
    }
    //Acessor methods
    /**
     * Returns the refrence to the room.
     * Runtime: O(c) ---> Runs in constant time.
     */
    getRoomRefrence() { return this.roomRefrence; }
    /**
     * Returns the current state of the room.
     * Runtime: O(c) ---> Runs in constant time.
     */
    getRoomState() { return this.roomState; }
    /**
     * Returns the current level of the room.
     * Runtime: O(c) ---> Runs in constant time.
     */
    getRoomLevel() { return this.roomLevel; }
    /**
     * Prints the stats about the room in a nice human readable format.
     * Runtime: O(c) ---> Runs in constant time.
     */
    print() {
        //Print a nice header
        console.log("---- Room[" + this.roomRefrence + "] ----");
        //Print the current state of the room
        console.log("Room State: " + this.roomState);
        //Print the level of the room
        console.log("Room Level: " + this.roomLevel);
        //Print the owner of the room
        console.log("Room Owner: " + this.roomOwner);
        //Print the main spawn
        console.log("Main Room Spawn: " + this.roomSpawns[0].name);
    }
    //Real methods
    /**
     * Returns the state of the room after finding it.
     * Runtime: O(f) ---> find command used.
     * @param r The room which's type is being checked. Defaults to this object.
     */
    findRoomState(r = this) {
        //Make this const so we can call methods fewer times.
        const room = Game.rooms[r.getRoomRefrence()];
        //If the controller is not undefined...
        if (room.controller != undefined) {
            //Check if we own the controller, and return we control the room if we do.
            if (room.controller.my)
                return state.CONTROLLED;
            //If the room has a defined owner, and its not mine, its probably hostile.
            else if (room.controller.owner != undefined)
                return state.HOSTILE; //todo: More logic here for allies.
            //The room is unclaimed.
            else {
                //Scan for sources
                var s = room.find(FIND_SOURCES); //O(f) --> find command used.
                //If there's one source it could make a mine.
                if (s.length == 1)
                    return state.MINE;
                //If there's two sources it could make a good expansion.
                else if (s.length == 2)
                    return state.EXPAND;
            }
        }
        //The state of the room is unknown.
        return state.UNKOWN;
    }
    /**
     * Updates the room information.
     * Runtime: O(f) ---> find command used.
     */
    updateRoom() {
        var _a;
        //Find the current room state and update it.
        this.roomState = this.findRoomState(); //O(f) ---> find command used.
        //Check if a controller is defined
        if (Game.rooms[this.roomRefrence].controller != undefined) {
            //Update the room level to the controller level
            this.roomLevel = (_a = Game.rooms[this.roomRefrence].controller) === null || _a === void 0 ? void 0 : _a.level;
            //If there's a controller there can be spawns
            //Reset the current spawns
            this.roomSpawns = [];
            //Find my spawns and set room spawns
            this.roomSpawns = Game.rooms[this.roomRefrence].find(FIND_MY_SPAWNS);
        }
        //Reset the total creep count for the room
        this.creepCount = 0;
        //Count the number of creeps which have this room as a refrence
        for (let c in Game.creeps) {
            //Check if their memory has a refrence to the room and increment if it does
            if (Game.creeps[c].memory.room == this.roomRefrence)
                this.creepCount++;
        }
    }
}
/**
 * The init_Rooms task which initializes all the rooms current visible in
 * Game.rooms. It is a fairly costly task and so shouldn't be run much.
 * Runtime: O(r * f) --> find is used at most once per room in Game.rooms
 */
class init_Rooms extends template {
    //Constructors
    /**
     * Takes the room array where the intialized rooms should be placed. WARN! This
     * will overwrite any data currently here!
     * @param rooms The room array to store the data in.
     */
    constructor(rooms) {
        //Call super
        super("Initalize Rooms");
        //Set localized counter part
        this.rooms = rooms;
    }
    //Real methods
    run() {
        //Reset rooms to a blank array
        this.rooms = [];
        //Setup a short hand for rooms
        for (let name in Game.rooms) {
            //Assign it because well this is kind of annoying
            var r = Game.rooms[name];
            //Now push the rooms into the array one by one
            this.rooms.push(new struc_Room(r.name));
        }
        return this.rooms;
    }
}
/**
 * The update_Rooms task updates all the rooms currently initalized in the given
 * array at construction.
 * Runtime: O(r * f) --> find is used at most once per room in Game.rooms
 */
class update_Rooms extends template {
    //Constructors
    /**
     * Makes an update_Rooms task.
     * @param rooms The room array to be updated.
     */
    constructor(rooms) {
        //Call super
        super("Update Rooms");
        //Set localized counter part
        this.rooms = rooms;
    }
    //Real methods
    /**
     * Updates all the rooms in the current array. It does not add new rooms.
     * Runtime: O(r * f) ---> Uses the find command for each room.
     */
    run() {
        //Check if rooms is undefined
        if (this.rooms == undefined) {
            console.log("Could not update rooms");
            return;
        }
        //Iterate down the array and call update room.
        for (var i = 0; i < this.rooms.length; i++)
            this.rooms[i].updateRoom(); //O(r * f)
    }
}

/**
 * This boolean tells whether creeps should report what they are doing or not.
 */
/**
 * Should the debug messages be sent to everyone?
 */
var publicDebug = true;
/**
 * A breif enum describing the possible goals creeps can carry out for their
 * colony.
 */
var Goals;
(function (Goals) {
    Goals["FILL"] = "Fill";
    Goals["FIX"] = "Fix";
    Goals["BUILD"] = "Build";
    Goals["UPGRADE"] = "Upgrade";
    Goals["REINFORCE"] = "Reinforce";
    Goals["STORE"] = "Store";
    Goals["TRADE"] = "Trade";
})(Goals || (Goals = {}));
/**
 * This is an abstract class which holds of lot of useful utility functions for
 * creep roles in general. This class includes an optimized movement method, and
 * short hands for common tasks such as mining and filling containers. Creep
 * roles should all extend this class and implement the interface bellow in this
 * file.
 */
class Creep_Prototype {
    constructor() {
        /**
         * This is the role string which holdes the name of the role being defined.
         * Since this is the abstract class it is empty, but all other classes which
         * extend this one should add an appropriate role string.
         */
        this.role = "";
    }
    /**
     * getRole retruns the role stored in the role string of the object.
     * Runtime: O(1)
     */
    getRole() {
        //This aint rocket science, return the role
        return this.role; //O(1)
    }
    /**
     * The compareRoomPos() function takes two room positions and compares them.
     * It returns true if and only if they are equal. If either are undefined the
     * function returns false.
     * Runtime: O(c)
     * @param a - The first room to compare
     * @param b - The second room to compare
     */
    static compareRoomPos(a, b) {
        //Check if both parameters are defined
        if (a != undefined && b != undefined) {
            //Check the x positions
            if (a.x != b.x)
                return false;
            //Check the y positions
            if (a.y != b.y)
                return false;
            //Check the room names
            if (a.roomName != b.roomName)
                return false;
            //Then the positions are equal
            return true;
            //One of the parameters is undefined, return false.
        }
        else
            return false;
    }
    /**
     * This is a small utility function which when called on a creep checks how
     * much longer they have to life. If it is equal to some threashold then the
     * count in the room memory for that creep is reduced.
     * Runtime: O(c)
     * @param creep - The creep's life to check
     */
    static checkLife(creep) {
        //Check how long the creep has to live and decrement if necessary
        if (creep.body.length * 3 == creep.ticksToLive)
            Game.rooms[creep.memory.room].memory.counts["Worker"]--;
    }
    /**
     * creepOptimizedMove optimizes the movement that creeps do. This is primarly
     * done but greatly reducing the number of times a creep recalcualtes its
     * pathing. It works well between rooms, judging from slack it works way
     * better than the default moveTo(pos) for multiple rooms. I don't know why
     * this is... it just happens to be. Should not be used for actions that
     * require very reponsive creep movement such as combat!
     * Runtime: O(c)
     * @param creep - The creep being moved
     * @param target - The target position you want the creep to reach.
     */
    static creepOptimizedMove(creep, target) {
        var _a;
        //If the creep is fatigued exit
        if (creep.fatigue > 0)
            return;
        //Check if there's a path for this position or if we've reached the end of one
        if (!(this.compareRoomPos(creep.memory.pathTarget, target)) || creep.memory.pathStep == ((_a = creep.memory.path) === null || _a === void 0 ? void 0 : _a.length)) {
            //Generate a path and save it to memory
            creep.memory.path = creep.pos.findPathTo(target, { ignoreCreeps: false });
            //Update the target of the path saved in memory
            creep.memory.pathTarget = target;
            //Start our step counter from 0
            creep.memory.pathStep = 0;
        }
        //Read memory
        var step = creep.memory.pathStep;
        var path = creep.memory.path;
        //Quickly make some basic checks that we can actually move
        if (path != undefined && step != undefined) {
            //Move the creep and increase the step
            if (path[step] != undefined) {
                creep.move(path[step].direction);
                creep.memory.pathStep++;
            }
        }
    }
    /**
     * The method creepFill makes the given creep fill nearby strucutres. The
     * strucuture it fills is determined by findClosestByPath.
     * Runtime: O(c)
     * Note: n comes from the use of the RoomPosition.find method.
     * @param creep The creep actions are taken on
     */
    static creepFill(creep) {
        //Send a message saying we're filling if we are
        creep.say('⚙ ⛴', publicDebug);
        //Check to see if we have a target defined
        if (creep.memory.emptyStructure == undefined) {
            //Find the nearest strucutre without full energy
            var s = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0 });
            //Set memory if s is not null
            if (s != null)
                creep.memory.emptyStructure = s.id;
        }
        //Make sure we have a target structure before going on
        if (creep.memory.emptyStructure != undefined) {
            //Read memory
            var x = Game.getObjectById(creep.memory.emptyStructure);
            //Check if the structure exists
            if (x != null && x.store.getFreeCapacity(RESOURCE_ENERGY) != 0) {
                //Check if we're near the structure and move to it if we aren't
                if (!(creep.pos.isNearTo(x)))
                    this.creepOptimizedMove(creep, x.pos);
                //Transfer the resource
                else
                    creep.transfer(x, RESOURCE_ENERGY);
                //If the structure is null reset the memory
            }
            else
                creep.memory.emptyStructure = undefined;
            //Looks like stuff is good
            return 0;
        }
        //Something went wrong
        return -1;
    }
    /**
     * This method makes the creep pick up nearby dropped resources. As a method
     * of resource collection it works faster than mining and helps to reduce lost
     * resources to decay.
     * Runtime: O(c)
     * Note: It is unknown how many calculations RoomPosition.findPathTo() is
     * making so its denoted as 'c'.
     * @param creep The creep which is picking up resources
     * @param filter The resource the creep is picking up. Defaults to energy
     */
    static creepPickup(creep, filter = RESOURCE_ENERGY) {
        //Say we're picking stuff up
        creep.say('♻', publicDebug);
        //Check if dropped is undefined
        if (creep.memory.droppedResource == undefined) {
            //Find nearby dropped resources of type filter
            var d = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: { resourceType: filter } });
            //Set dropped resoucres if d is not null
            if (d != null)
                creep.memory.droppedResource = d.id;
            else {
                const t = creep.pos.findClosestByPath(FIND_TOMBSTONES);
                if (t != null)
                    if (t.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
                        creep.memory.tombstone = t.id;
            }
        }
        //Make sure dropped is defined before moving on
        if (creep.memory.droppedResource != undefined) { //O(3) -> O(7 + n)
            //Read memory
            var d = Game.getObjectById(creep.memory.droppedResource);
            //Check if the resource exists
            if (d != null) {
                //Check if we're near the resource and move to it if we aren't
                if (!(creep.pos.isNearTo(d)))
                    this.creepOptimizedMove(creep, d.pos);
                //Pickup the resource
                else
                    creep.pickup(d);
            }
            else {
                //We didn't get anything back from the Game.getObjectById so reset the id
                creep.memory.droppedResource = undefined;
            }
        }
        else if (creep.memory.tombstone != undefined) {
            //Read memory
            var t = Game.getObjectById(creep.memory.tombstone);
            //Check if the resource exists
            if (t != null) {
                //Check if we're near the resource and move to it if we aren't
                if (!(creep.pos.isNearTo(t)))
                    this.creepOptimizedMove(creep, t.pos);
                //Pickup the resource
                else
                    creep.withdraw(t, RESOURCE_ENERGY);
            }
            else {
                //We didn't get anything back from the Game.getObjectById so reset the id
                creep.memory.droppedResource = undefined;
            }
        }
    }
    /**
     * creepHarvest navigates the creep to the nearest source and makes it mine
     * it. If the creep does nothing during this method a couple of different
     * return options are available.
     * Runtime: O(c)
     * @param creep The creep to be doing the harvesting
     * @return 0 Harvesting completed successfully
     * @return -1 A game object could not be found
     * @return -2 The creep has no sources string in memory and we couldn't assign
     * one.
     */
    static creepHarvest(creep) {
        //Check if the creep has any work parts
        for (var i = 0; i <= creep.body.length; i++) {
            if (i == creep.body.length)
                return -3;
            if (creep.body[i].type == WORK)
                break;
        }
        //Say we're harvesting
        creep.say('⛏', publicDebug);
        //check if sources is undefined
        if (creep.memory.sources == undefined) {
            //Find the active sources
            var t = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            //Set sources if t is not null
            if (t != null)
                creep.memory.sources = t.id;
        }
        //Make sure source is defined before moving on
        if (creep.memory.sources != undefined) {
            //Read memory
            var s = Game.getObjectById(creep.memory.sources);
            //Check if there exists a source
            if (s != null && s.energy != 0) {
                //Check if we're near the source and move to it if we aren't
                if (!(creep.pos.isNearTo(s)))
                    this.creepOptimizedMove(creep, s.pos);
                //Harvest the source
                else
                    creep.harvest(s);
                //Everything was successful
                return 0;
                //We couldn't find the right game object
            }
            else {
                creep.memory.sources = undefined;
                return -1;
            }
        }
        //The creep has no sources string in memory and we couldn't assign it one
        return -2;
    }
    /**
     * The creepUpgrade method makes the creep upgrade the controller of the room
     * they are in. This is a very short and well optimized method and even
     * handles cases where a room does not have a controller.
     * Runtime: O(c) ---> Runs in constant time.
     * @param creep The creep to upgrade the controller
     */
    static creepUpgrade(creep) {
        //Say we're upgrading
        creep.say('⚙ 🕹', publicDebug);
        //Read the room controller
        var r = creep.room.controller;
        //Make sure r is defined
        if (r != undefined) {
            //Check if we're in range of the controller, and move towards if we're not
            if (!(creep.pos.inRangeTo(r, 3)))
                this.creepOptimizedMove(creep, r.pos);
            //Upgrade the controller
            else
                creep.upgradeController(r);
            return 0;
        }
        return -1;
    }
    /**
     * This method, creepBuild makes the creep build the nearest construction
     * site. What's special about this method is that there is not anything
     * special to note.
     * Runtime: O(n)
     * @param creep The creep to build the construction site
     */
    static creepBuild(creep) {
        //Say we're building
        creep.say('⚙ ⚒', publicDebug);
        //check if building is undefined
        if (creep.memory.building == undefined) {
            //Find the nearest site
            var b = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES); //O(n)
            //Set building if b is not null
            if (b != null)
                creep.memory.building = b.id;
        }
        //Make sure building is defined before moving on
        if (creep.memory.building != undefined) {
            //Read memory
            var b = Game.getObjectById(creep.memory.building);
            //Check if there exists a building
            if (b != null) {
                //Check if we're near the source and move to it if we aren't
                if (!(creep.pos.inRangeTo(b, 3)))
                    this.creepOptimizedMove(creep, b.pos);
                //Harvest the source
                else
                    creep.build(b);
                //We need to find a new construction site
            }
            else
                creep.memory.building = undefined;
            //Looks like a success
            return 0;
        }
        //Something went wrong
        return -1;
    }
    /**
     * creepMelee makes the creep attack the given victim. It uses moveTo without
     * reusing paths because combat is a situation where creeps must be very
     * responsive.
     * Runtime: O(c) ---> Runs in constant time.
     * @param creep The creep to move and attack
     * @param victim The creep we're trying to kill
     */
    static creepMelee(creep, victim) {
        //Say we're building
        creep.say('⚔', publicDebug);
        //Move to the creep we're attacking, visualize the path and refresh often
        if (!(creep.pos.isNearTo(victim.pos)))
            creep.moveTo(victim.pos, { reusePath: 0, visualizePathStyle: {} });
        //Attack them! grr!
        else
            creep.attack(victim);
    }
    /**
     * This method makes the creep repair buildings which are low on health. This
     * method is surprisingly complicted and can likely be simplified a lot.
     * Runtime: O(c) ---> Runs in constant time.
     * @param creep The creep to repair the building
     */
    static creepRepair(creep) {
        //Say we're building
        creep.say('⚙ ⛓', publicDebug);
        //check if building is undefined
        if (creep.memory.repair == undefined) {
            //Find the nearest site
            var b = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (c) => c.hits < c.hitsMax && (c.structureType != STRUCTURE_WALL && c.structureType != STRUCTURE_RAMPART) }); //O(n)
            //Set building if b is not null
            if (b != null)
                creep.memory.repair = b.id;
        }
        //Make sure building is defined before moving on
        if (creep.memory.repair != undefined) {
            //Read memory
            var b = Game.getObjectById(creep.memory.repair);
            //Check if there exists a building
            if (b != null && b.hits < b.hitsMax) {
                //Check if we're near the source and move to it if we aren't
                if (!(creep.pos.inRangeTo(b, 3)))
                    this.creepOptimizedMove(creep, b.pos);
                //Harvest the source
                else
                    creep.repair(b);
            }
            else {
                //We need to find a new construction site
                creep.memory.repair = undefined;
            }
            return 0;
        }
        return -1;
    }
    static creepReinforce(creep) {
        var threashold = 3;
        for (var i = 1; i <= creep.room.controller.level; i++)
            threashold = threashold * 10;
        creep.say('⚙ 🏛', publicDebug);
        if (creep.memory.reinforce == undefined) {
            var w = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (c) => (c.structureType == STRUCTURE_RAMPART || c.structureType == STRUCTURE_WALL) && c.hits < (threashold / 20) });
            if (w == null)
                w = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (c) => (c.structureType == STRUCTURE_RAMPART || c.structureType == STRUCTURE_WALL) && c.hits < threashold });
            if (w != null)
                creep.memory.reinforce = w.id;
        }
        if (creep.memory.reinforce != undefined) {
            var w = Game.getObjectById(creep.memory.reinforce);
            if (w != null && w.hits < threashold) {
                if (!(creep.pos.inRangeTo(w, 3)))
                    this.creepOptimizedMove(creep, w.pos);
                else
                    creep.repair(w);
            }
            else
                creep.memory.reinforce = undefined;
            return 0;
        }
        return -1;
    }
    static creepStore(creep) {
        creep.say('⚙ 🛢', publicDebug);
        var s = undefined;
        for (var i = 0; i < RESOURCES_ALL.length; i++)
            if (creep.store.getUsedCapacity(RESOURCES_ALL[i]) > 0) {
                s = RESOURCES_ALL[i];
                break;
            }
        if (creep.room.storage != undefined && s != undefined)
            if (creep.transfer(creep.room.storage, s) == ERR_NOT_IN_RANGE)
                this.creepOptimizedMove(creep, creep.room.storage.pos);
        return 0;
    }
    static trader(creep) {
        creep.say('🏙', publicDebug);
        if (creep.memory.working) {
            for (var i = 0; i < RESOURCES_ALL.length; i++) {
                if (creep.store.getUsedCapacity(RESOURCES_ALL[i]) > 0) {
                    if (creep.transfer(creep.room.terminal, RESOURCES_ALL[i]) == ERR_NOT_IN_RANGE)
                        creep.moveTo(creep.room.terminal);
                }
            }
        }
        else {
            if (creep.room.terminal.store.getUsedCapacity() <= 100000) {
                for (var i = 0; i < RESOURCES_ALL.length; i++) {
                    if (creep.room.storage.store.getUsedCapacity(RESOURCES_ALL[i]) > 1) {
                        if (creep.withdraw(creep.room.storage, RESOURCES_ALL[i], Math.min(creep.store.getFreeCapacity(), creep.room.storage.store.getUsedCapacity(RESOURCES_ALL[i]) - 1)) == ERR_NOT_IN_RANGE)
                            creep.moveTo(creep.room.storage);
                    }
                }
            }
            else
                return -1;
        }
        return 0;
    }
    static run(creep) {
        //If goal in creep memory was undefined we can upgrade for now
        if (creep.memory.goal == undefined)
            creep.memory.goal = Goals.UPGRADE;
        //Check if we're full on energy
        if (creep.store.getFreeCapacity() == 0)
            creep.memory.working = true;
        //If we're out of energy obtain more
        else if (creep.store.getUsedCapacity() == 0 || creep.memory.working == undefined)
            creep.memory.working = false;
        if (creep.memory.goal == Goals.TRADE) {
            this.trader(creep);
            return;
        }
        //Lets Spend some energy
        if (creep.memory.working) {
            //Switch through possible goals and our actions based on them
            switch (creep.memory.goal) {
                //If goal is undefined... it shouldn't be make a confused face and hope math fixes it
                case undefined:
                    creep.say("⁉");
                    return;
                case Goals.BUILD:
                    if (Creep_Prototype.creepBuild(creep) != 0)
                        creep.memory.goal = undefined;
                    break;
                case Goals.FILL:
                    if (Creep_Prototype.creepFill(creep) != 0)
                        creep.memory.goal = undefined;
                    break;
                case Goals.FIX:
                    if (Creep_Prototype.creepRepair(creep) != 0)
                        creep.memory.goal = undefined;
                    break;
                case Goals.REINFORCE:
                    if (Creep_Prototype.creepReinforce(creep) != 0)
                        creep.memory.goal = undefined;
                    break;
                case Goals.UPGRADE:
                    if (Creep_Prototype.creepUpgrade(creep) != 0)
                        creep.memory.goal = undefined;
                    break;
                case Goals.STORE:
                    if (Creep_Prototype.creepStore(creep) != 0)
                        creep.memory.goal = undefined;
                    break;
            }
        }
        //Lets get some energy
        else {
            //We're mining
            creep.say('⛏', publicDebug);
            if (Creep_Prototype.creepHarvest(creep) != 0)
                Creep_Prototype.creepPickup(creep);
        }
    }
}

//Import the creepRole interface
/**
 * This is the class for the JumpStart creep. The primary job of the JumpStart
 * creep is to push the RCL from 1 to 2 or to fill extensions in case the colony
 * dies It is mostly static as it simply needs to act on harvester creeps
 *instead of storing them in cache as an object.
 */
class Scout extends Creep_Prototype {
    constructor() {
        super(...arguments);
        //Variables
        this.name = "Scout";
    }
    //Real Methods
    run(creep) {
        Scout.run(creep);
    }
    static run(creep) {
        //Scouts need to say things
        creep.say('🛰', true);
        //Scouts are simple... move to the scout target
        if (creep.memory.target != undefined)
            Creep_Prototype.creepOptimizedMove(creep, new RoomPosition(25, 25, creep.memory.target));
        //Else the mission is complete
        else
            creep.suicide();
    }
}

//Import the creepRole interface
/**
 * This is the class for the Carrier creep. The primary role of the carrier
 * creep is to move resources around the base and into storage or other devices
 * that could use them.
 */
class Defender extends Creep_Prototype {
    constructor() {
        super(...arguments);
        //Variables
        this.name = "Defender";
    }
    //Real Methods
    run(creep) {
        Defender.run(creep);
    }
    static run(creep) {
        //Find hostile creeps
        var h = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        //Check if there are some
        if (h != undefined) {
            //Attack!!
            super.creepMelee(creep, h);
        }
        else {
            //No enemies
            creep.say('🛏︎', true);
        }
    }
}

//Import the creepRole interface
/**
 * This is the class for the Carrier creep. The primary role of the carrier
 * creep is to move resources around the base and into storage or other devices
 * that could use them.
 */
class Extractor extends Creep_Prototype {
    constructor() {
        super(...arguments);
        //Variables
        this.name = "Extractor";
    }
    //Real Methods
    run(creep) {
        Extractor.run(creep);
    }
    static run(creep) {
        if (creep.memory.working == undefined)
            creep.memory.working = false;
        else if (creep.store.getFreeCapacity() == 0)
            creep.memory.working = true;
        else if (creep.store.getUsedCapacity() == 0)
            creep.memory.working = false;
        if (creep.memory.working) {
            creep.say("🛢", true);
            var s = undefined;
            for (var i = 0; i < RESOURCES_ALL.length; i++)
                if (creep.store.getUsedCapacity(RESOURCES_ALL[i]) > 0) {
                    s = RESOURCES_ALL[i];
                    break;
                }
            if (creep.room.storage != undefined && s != undefined)
                if (creep.transfer(creep.room.storage, s) == ERR_NOT_IN_RANGE)
                    this.creepOptimizedMove(creep, creep.room.storage.pos);
        }
        else {
            creep.say("🏗", true);
            // if (creep.memory.mineral = undefined) {
            //   var h = creep.pos.findClosestByPath(FIND_MINERALS);
            //   if (h != null) creep.memory.mineral = h.id;
            // }
            // if (creep.memory.mineral != undefined) {
            var m = creep.pos.findClosestByPath(FIND_MINERALS);
            if (m != null) {
                if (creep.harvest(m) == ERR_NOT_IN_RANGE)
                    creep.moveTo(m.pos);
                else if (creep.harvest(m) == ERR_NOT_FOUND)
                    creep.memory.role = undefined;
                else if (creep.harvest(m) == ERR_NOT_ENOUGH_RESOURCES)
                    creep.memory.working = true;
            }
            // else creep.memory.mineral = undefined;
            // }
        }
    }
}

//Import the creepRole interface
/**
 * This is the class for the Carrier creep. The primary role of the carrier
 * creep is to move resources around the base and into storage or other devices
 * that could use them.
 */
class Miner extends Creep_Prototype {
    constructor() {
        super(...arguments);
        //Variables
        this.name = "Miner";
    }
    //Real Methods
    run(creep) {
        Miner.run(creep);
    }
    static run(creep) {
        if (creep.memory.sources == undefined)
            var s = creep.room.find(FIND_SOURCES_ACTIVE);
        if (s != undefined) {
            var t = s[0];
            for (var i = 1; i < s.length; i++)
                if (s[i].energy > t.energy)
                    t = s[i];
        }
        Creep_Prototype.creepHarvest(creep);
    }
}

//Import the queue so we can request tasks, priority so we can set priority
var params = {};
params["Scout"] = new Scout();
params["Defender"] = new Defender();
params["Extractor"] = new Extractor();
params["Miner"] = new Miner();
/**
 * This is an class describing a job for creeps to take on.
 */
class Job {
    constructor(g, r) {
        this.goal = g;
        this.room = r;
    }
    getGoal() { return this.goal; }
    getRoom() { return this.room; }
}
/**
 * This is the creep manager class. It is mostly static and handles the
 * management of creeps including their AI and memory.
 */
class CreepManager {
    //Constructors
    constructor() {
        //Set the last time we cleaned memory to the anchient times
        Memory.lastCreepClean = 0;
    }
    //Accessor methods
    //Real methods
    /**
     * Runs the creep manager class. Static as it has nothing it needs to modify
     * on the object.
     * Runtime: O(c) ---> Runs in constant time.
     */
    static run() {
        CreepManager.updateCreeps();
        //Start at 6,000 ticks and increment down. Request a clean based on how long ago it was
        for (var i = 4; i > 0; i--)
            if (Game.time - Memory.lastCreepClean >= 1500 * i || Memory.lastCreepClean == undefined) {
                Queue.request(new cleanMemory_CreepManager(), i * 25);
                console.log("Requested memory clean");
                break;
            }
    }
    static runCreepsAI() {
        CreepManager.updateCreeps();
        CreepManager.assignJobs();
        //Iterate through creeps
        for (let c in Game.creeps) {
            //Short hand
            var creep = Game.creeps[c];
            //Check if the creep is spawning
            if (creep.spawning)
                break;
            //If the creep has a defined role run that role's AI
            if (creep.memory.role != undefined)
                params[creep.memory.role].run(creep);
            //Run the creep generalized AI
            else
                Creep_Prototype.run(creep);
            //Check the creep's life
            Creep_Prototype.checkLife(creep);
        }
    }
    /**
     * Clears the memory of dead creeps.
     * Runtime: O(n) ---> n is the number of creeps.
     */
    static cleanMemory() {
        //Iterate through creeps and check if they're alive, if they're not clean the memory
        for (var c in Memory.creeps)
            if (!Game.creeps[c])
                delete Memory.creeps[c]; //O(n)
        //Set the last clean date to right now
        Memory.lastCreepClean = Game.time;
    }
    static updateCreeps() {
        CreepManager.creeps = [];
        for (var c in Memory.creeps) {
            if (!Game.creeps[c])
                delete Memory.creeps[c];
            else
                CreepManager.creeps.push(Game.creeps[c]);
        }
    }
    static declareJob(j) { CreepManager.jobs.push(j); }
    static assignJobs() {
        for (var i = 0; i < CreepManager.jobs.length; i++)
            for (var j = 0; j < CreepManager.creeps.length; j++) {
                if (CreepManager.creeps[j].memory.room == CreepManager.jobs[i].getRoom()) {
                    if (CreepManager.creeps[j].memory.goal == undefined || CreepManager.creeps[j].memory.goal == Goals.UPGRADE) {
                        CreepManager.creeps[j].memory.goal = CreepManager.jobs.pop().getGoal();
                        break;
                    }
                }
            }
    }
    static printJobs() {
        for (var i = 0; i < CreepManager.jobs.length; i++)
            console.log(CreepManager.jobs[i].getRoom() + " - " + CreepManager.jobs[i].getGoal());
        return 0;
    }
    static resetJobs() {
        while (CreepManager.jobs.length > 0)
            CreepManager.jobs.pop();
    }
}
//Variables
CreepManager.jobs = [];
CreepManager.creeps = [];
/**
 * The run CreepManager task runs the logic for the CreepManager which requests
 * other tasks that need to be completed in the future.
 */
class run_CreepManager extends template {
    constructor() { super("Run Creep Manager"); }
    //Real Methods
    run() {
        //Simple enough I'd say
        CreepManager.run();
    }
}
/**
 * The creepAI CreepManager task runs the ai for all the creeps.
 */
class creepAI_CreepManager extends template {
    constructor() { super("Run Creep AI"); }
    //Real Methods
    run() {
        //Simple enough I'd say
        CreepManager.runCreepsAI();
    }
}
/**
 * The clean memory task clears the memory of any old creeps so they don't clog
 * it up too much in the future.
 */
class cleanMemory_CreepManager extends template {
    //Variables
    constructor() { super("Clean Creep Memory"); }
    //Real Methods
    run() {
        //Simple enough I'd say
        CreepManager.cleanMemory();
    }
}

/**
 * This file manages the spawns that need to be completed including the queuing
 * of spawns and handling of when new spawns should happen.
 */
class SpawnManager {
    //Constructor
    constructor(r) {
        //Set the local counterparts
        this.room = r;
        //find the spawns we can use
        this.spawns = this.room.find(FIND_MY_SPAWNS);
        //Make a spawn queue for this manager
        this.spawnQueue = new SpawnQueue(this.spawns);
    }
    /**
     * Runs the SpawnManager which looks for creeps that need to be spawned and
     * adds them to the spawn queue.
     */
    run() {
        this.spawnQueue.print();
        //TODO logic for spawning creeps
        //Run the queue if it isn't empty
        if (!(this.spawnQueue.isEmpty()))
            this.spawnQueue.run();
    }
}
/**
 * This is a queue which holds creeps that need to be spawned based on their
 * importance.
 */
class SpawnQueue {
    //Constructor
    constructor(s) {
        this.queue = [];
        this.spawns = s;
    }
    //Accessor methods
    isEmpty() { return !(this.queue.length > 0); }
    print() {
        for (var i = 0; i < this.queue.length; i++) {
            console.log(this.queue[i].role);
        }
    }
    //Methods
    add(c) { this.queue.push(c); }
    run() {
        //Find an unused spawn
        for (var i = 0; i < this.spawns.length; i++) {
            //Check if there's anything left, return if there isn't
            if (this.queue[0] == undefined)
                return;
            //Do this for some nice short hand
            var spawn = this.spawns[i];
            //Grab the creep real quick
            var c = this.queue.pop();
            console.log((spawn.spawnCreep(c.body, Game.time + "", { dryRun: true })));
            console.log(c.body);
            //Spawn the creep, if we can
            if (spawn.spawnCreep(c.body, Game.time + "", { dryRun: true }) == OK)
                c.run(spawn);
        }
    }
    contains(r) {
        for (var i = 0; i < this.queue.length; i++) {
            if (this.queue[i].role == r)
                return true;
        }
        return false;
    }
}

/**
 * Spawns a defender creep at the given spawn and at the level given.
 * O(c) --> Runs in constant time.
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be produced
 */
/**
 * Spawns a claimer creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
// function spawnClaimer(capacity, spawn){
//   //Claimers are easy... basic body
//   var body = [MOVE,CLAIM]; //Cost - 650
//   //Temp name storage
//   var name = '[' + spawn.room.name + '] Claimer ' + Game.time;
//   //Spawn the creep, Increment the claimer count in the room if successful
//   if(spawn.spawnCreep(body,name, {memory: {role: 'claimer', distance: Game.flags['Claim'].room.name}}) == OK) spawn.room.memory.count.claimer++;
// }
/**
 * Spawns a distance harvester creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 * @param targetRoom The room which the distance harvester will be mining in
 */
// function spawnDistanceHarvester(capacity:number, spawn:StructureSpawn, targetRoom:string){
//   //The amount of energy towards our total we've spent
//   var spent = 200; //Starts at 200 since we have 2 move (50) parts and 2 carry (50) parts
//   //The starting body for our distance harvester
//   var body:BodyPartConstant[] = [MOVE,MOVE,CARRY,CARRY];
//   //Add another carry part if we have the space
//   if(capacity > 550) { body.push(CARRY); spent += 50;}
//   //Add work parts until we're out of energy but not to exceed 750 cost
//   while(spent + 100 <= capacity && spent < 750) { body.push(WORK); spent += 100;}
//   //Temp name storing
//   var name = '[' + spawn.room.name + '] Distance Harvester ' + Game.time;
//   //Spawn the creep, Increment the distance harvester count in the room if successful
//   if(spawn.spawnCreep(body, name, {memory: {role: 'distanceHarvester', room: spawn.room.name, distance: targetRoom}}) == OK) spawn.room.meory.count.distanceHarvester++;
// }
/**
 * Spawns a harvester creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
function spawnHarvester(capacity, spawn) {
    //It's important to note that the harvester creep is also used for recovery
    // and as such can't cost more than 300 energy
    //Temp body storing
    var body = [MOVE, MOVE, CARRY, CARRY, WORK]; //Cost - 300
    //Temp name storing
    var name = '[' + spawn.room.name + '] Worker ' + Game.time;
    //Spawn the creep, Increment the harvester count in the room if successful
    if (spawn.spawnCreep(body, name, { memory: { room: spawn.room.name } }) == OK)
        spawn.room.memory.counts.Worker++;
}
/**
 * Spawns a harvester creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
function spawnBigBoiHarvester(capacity, spawn) {
    if (capacity > 300 + 20 * 50)
        capacity = 300 + 20 * 50; //Cap the worker size
    //The amount of energy towards our total we've spent
    var spent = 200; //Starts at 200 since we have 2 move (50) parts and 2 carry (50) parts
    //The starting body for our worker
    var body = [MOVE, MOVE, CARRY, CARRY];
    //Add another carry part if we have the space
    while (spent + 50 < capacity / 2) {
        body.push(CARRY);
        spent += 50;
    }
    //Add another carry part if we have the space
    while (spent + 50 < capacity * 3 / 5) {
        body.push(MOVE);
        spent += 50;
    }
    //Add work parts until we're out of energy but not to exceed 750 cost
    while (spent + 100 <= capacity) {
        body.push(WORK);
        spent += 100;
    }
    //Temp name storing
    var name = '[' + spawn.room.name + '] Worker ' + Game.time;
    //Spawn the creep, Increment the harvester count in the room if successful
    if (spawn.spawnCreep(body, name, { memory: { room: spawn.room.name } }) == OK)
        spawn.room.memory.counts.Worker++;
}
function extractor(spawn) {
    if (spawn.spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], '[' + spawn.room.name + '] Extractor ' + Game.time, { memory: { room: spawn.room.name, role: "Extractor" } }) == OK)
        spawn.room.memory.counts.Extractor++;
}
/**
 * Spawns a scout creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
function spawnScout(capacity, spawn) {
    //It's important to note that the scout creep's only purpose is to move and
    // as such its body leaves much to desire
    //Temp body storing
    var body = [MOVE]; //Cost - 50
    //Temp name storing
    var name = '[' + spawn.room.name + '] Scout ' + Game.time;
    //Spawn the creep
    if (spawn.spawnCreep(body, name, { memory: { role: 'Scout', target: Game.flags["Scout"].pos.roomName, room: spawn.room.name } }) == OK)
        spawn.room.memory.counts.Scout++;
}
/**
 * Spawns a worker creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
function spawnWorker(capacity, spawn) {
    //The amount of energy towards our total we've spent
    var spent = 200; //Starts at 200 since we have 2 move (50) parts and 2 carry (50) parts
    //The starting body for our worker
    var body = [MOVE, MOVE, CARRY, CARRY];
    //Add another carry part if we have the space
    while (spent + 50 < capacity / 2) {
        body.push(CARRY);
        spent += 50;
    }
    //Add another carry part if we have the space
    while (spent + 50 < capacity * 3 / 5) {
        body.push(MOVE);
        spent += 50;
    }
    //Add work parts until we're out of energy but not to exceed 750 cost
    while (spent + 100 <= capacity) {
        body.push(WORK);
        spent += 100;
    }
    //Temp name storing
    var name = '[' + spawn.room.name + '] Worker ' + Game.time;
    //Spawn the creep, Increment the upgrader count in the room if successful
    if (spawn.spawnCreep(body, name, { memory: { room: spawn.room.name } }) == OK)
        spawn.room.memory.counts.Worker++;
}
//Public facing functions
/**
 * Finds spawns in the room given and runs the logic for what needs to be spawned.
 * Then functions higher up in the file are called to handle the spawning of specifc
 * creeps.
 * Worst case: O(s + t) --> s is the number of spawns
 * Expected case: O(s + t) --> s is the number of spwans, t is the number of buildings
 * Best case: O(s + t) --> s is the number of spawns
 * @param currentRoom The room in which spawning occurs
 */
function spawn(currentRoom) {
    //Check the capacity we can spawn at
    var capacity = 300 + (currentRoom.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION }).length * 50); //O(t)
    //Iterate through spwans in the game
    for (var s in Game.spawns) { //TODO implement spawns into room.memory so this is O(c), current O(s)
        //Why is this harder than it needs to be?
        var spawn = Game.spawns[s];
        //Is the spawn in the room we want?
        if (currentRoom.name == spawn.room.name) {
            if (currentRoom.memory.counts.Miner == undefined) {
                currentRoom.memory.counts.Miner = 0;
                currentRoom.memory.counts.Carrier = 0;
                currentRoom.memory.counts.Jumpstart = 0;
                currentRoom.memory.counts.Worker = 0;
            }
            //Check if a harvester creep needs to be spawned, this includes recovery if all creeps die
            if (currentRoom.memory.counts.Worker < 1)
                spawnHarvester(capacity, spawn);
            else if (currentRoom.memory.counts.Extractor < 1 && currentRoom.find(FIND_MINERALS)[0].mineralAmount > 0)
                extractor(spawn);
            //Check if a carrier creep needs to be spawned, 2 per miner
            // else if(currentRoom.memory.counts.Carrier < currentRoom.memory.counts.Miner * 2) spawnCarrier(capacity, spawn);
            //Check if a miner creep needs to be spawned, 1 per source
            else if (currentRoom.memory.counts.Worker < 10)
                spawnBigBoiHarvester(capacity, spawn);
            //Check if workers should be spawned, 4 base, // TODO: check if more can be spawned
            else if (currentRoom.memory.counts.Worker < 4)
                spawnWorker(capacity, spawn);
            //Check if a repair bot should be spawned
            // else if(currentRoom.memory.counts.RepairBot < 1) spawnRepairBot(capacity, spawn);
            //Check if a scout should be spawned
            else if (currentRoom.memory.counts.Scout < 1 && Game.flags["Scout"] != null)
                spawnScout(capacity, spawn);
            //Check if a claimer should be spawned
            // else if(currentRoom.memory.countClaimer < 1 && Game.flags['Claim'] != undefined) spawnClaimer(capacity, spawn);
            // TODO: reimplement distance harvesters
            // else if(spawn.store.getCapacity(RESOURCE_ENERGY) == 300 && currentRoom.memory.counts.Worker < 8) spawnWorker(capacity,spawn);
        }
    }
}

/**
 * The visuals manager draws the visual results of algorithms and other useful
 * information to the screen. What is drawn is determined by game flags.
 */
class VisualsManager {
    /**
     * run does some basic logic to determine what should be drawn to screen
     * before calling the helper methods to draw the information to the screen.
     * @param roomName - The room which is being drawn to
     * @param distanceTransform - The distance transform algorithm result
     * @param floodFill - The flood fill algorithm result
     */
    run(roomName, distanceTransform = undefined, floodFill = undefined) {
        //If the DistanceTransform flag is down call the drawing function
        if (Game.flags["DistanceTransform"] != undefined)
            this.distanceTransform(distanceTransform, roomName);
        //If the FloodFill flag is down call the drawing function
        else if (Game.flags["FloodFill"] != undefined)
            this.floodFill(floodFill, roomName);
    }
    /**
     * Draws the distance transform algorithm result to the given room.
     * @param distanceTransform - The distance transform algorithm result
     * @param roomName - The room the data is being drawn to
     */
    distanceTransform(distanceTransform, roomName) {
        //If the transform is defined, iterate through all the elements
        if (distanceTransform != undefined)
            for (var i = 0; i < 50; i++)
                for (var j = 0; j < 50; j++) {
                    //Depending on the value of the cell we want to draw a different color cirlce here
                    switch (distanceTransform[i][j]) {
                        //Draw a gradient of colors depending on the cell's value. Nothing is drawn for walls/boundaries
                        // -1 is only used in the non iterative solution to the distance transform. The gradient
                        // used here is the far right row of web safe colors on this website https://htmlcolors.com/color-chart
                        case -1:
                            new RoomVisual(roomName).circle(j, i, { fill: "#607D8B", opacity: 80 });
                            break;
                        case 0: break;
                        case 1:
                            new RoomVisual(roomName).circle(j, i, { fill: "#B71C1C", opacity: 80 });
                            break;
                        case 2:
                            new RoomVisual(roomName).circle(j, i, { fill: "#880E4F", opacity: 80 });
                            break;
                        case 3:
                            new RoomVisual(roomName).circle(j, i, { fill: "#4A148C", opacity: 80 });
                            break;
                        case 4:
                            new RoomVisual(roomName).circle(j, i, { fill: "#311B92", opacity: 80 });
                            break;
                        case 5:
                            new RoomVisual(roomName).circle(j, i, { fill: "#0D47A1", opacity: 80 });
                            break;
                        case 6:
                            new RoomVisual(roomName).circle(j, i, { fill: "#01579B", opacity: 80 });
                            break;
                        case 7:
                            new RoomVisual(roomName).circle(j, i, { fill: "#006064", opacity: 80 });
                            break;
                        case 8:
                            new RoomVisual(roomName).circle(j, i, { fill: "#004D40", opacity: 80 });
                            break;
                        case 9:
                            new RoomVisual(roomName).circle(j, i, { fill: "#1B5E20", opacity: 80 });
                            break;
                        case 10:
                            new RoomVisual(roomName).circle(j, i, { fill: "#33691E", opacity: 80 });
                            break;
                        case 11:
                            new RoomVisual(roomName).circle(j, i, { fill: "#827717", opacity: 80 });
                            break;
                        case 12:
                            new RoomVisual(roomName).circle(j, i, { fill: "#F57F17", opacity: 80 });
                            break;
                        case 13:
                            new RoomVisual(roomName).circle(j, i, { fill: "#FF6F00", opacity: 80 });
                            break;
                        case 14:
                            new RoomVisual(roomName).circle(j, i, { fill: "#E65100", opacity: 80 });
                            break;
                        case 15:
                            new RoomVisual(roomName).circle(j, i, { fill: "#BF360C", opacity: 80 });
                            break;
                    }
                }
    }
    /**
     * Draws the flood fill algorithm result to the room given.
     * @param floodFill - The flood fill algorithm result
     * @param roomName - The room being drawn to
     */
    floodFill(floodFill, roomName) {
        //If flood fill is defined iterate through cells
        if (floodFill != undefined)
            for (var i = 0; i < 50; i++)
                for (var j = 0; j < 50; j++) {
                    //Make a different circle depending on the drawing
                    switch (floodFill[i][j]) {
                        //Walls have no color
                        case 0: break;
                        //Infected are green
                        case -1:
                            new RoomVisual(roomName).circle(j, i, { fill: "#388E3C", opacity: 80 });
                            break;
                        //Not infected a nice blue color
                        case 1:
                            new RoomVisual(roomName).circle(j, i, { fill: "#303F9F", opacity: 80 });
                            break;
                    }
                }
    }
}

/**
 * An abstract class that defines a few useful functions for all algorithms in
 * general.
 */
class Algorithm {
    //Constructor
    /**
     * Constructs an algorithm with the given name.
     * Runtime: O(c) ---> Runs in constant time.
     */
    constructor(n) {
        //Variables
        /**
         * A string holding the name of the algorithm.
         */
        this.name = "";
        /**
         * A boolean holding the status of whether the algorithm is complete or not.
         */
        this.complete = false;
        this.name = n;
    }
    //Accessor Methods
    /**
     * isComplete returns whether or not the algorithm has completed its
     * calculations or not.
     * Runtime: O(c) ---> Runs in constant time.
     */
    isComplete() { return this.complete; }
    /**
     * This method simply returns the name of the algorithm in the form of a
     * string.
     * Runtime: O(c) ---> Runs in constant time.
     */
    getName() { return this.name; }
    /**
     * Reports the algorithm as complete. Should only be called by the manager.
     * Runtime: O(c) ---> Runs in constant time.
     */
    reportCompletion() { this.complete = true; }
}

/**
 * Import the algorithm abstract class because well... this is an algorithm is
 * it not?
 */
/**
 * The distance transform class handles the computations related to the distance
 * transform algorithm on a given room.
 */
class DistanceTransform extends Algorithm {
    /**
     * Construct a DistanceTransform object. For the most part it needs only to
     * know the room its running calculations on.
     * @param r - The room distance transform is being run on.
     */
    constructor(r) {
        //Make an appeal to a higher power with our name
        super("Distance Transform");
        /**
         * The matrix we're using to run the algorithm and report our findings.
         */
        this.distanceTransform = undefined;
        //Set our local room
        this.room = r;
    }
    /**
     * Return the matrix of the algorithm. Note that this may be incomplete and
     * isComplete() should be used before using it for any planning.
     */
    getResult() { return this.distanceTransform; }
    /**
     * The manager manages the distance transform algorithm and guides it through
     * all of its major steps. When making calls to this class only manager or the
     * above accessor methods should be touched or called. Doing anything else may
     * interfere with the algorithm.
     * @return - 2 Distance Transform matrix init'd.
     * @return - 1 We need an another call to make more calculations... progress
     * is being made.
     * @return - 0 The algorithm is done running and is complete. No more calls
     * needed.
     */
    manager() {
        //If our matrix isn't, set it up set it up and return the appropriate value
        if (this.distanceTransform == undefined) {
            this.setupDistanceTransformAlgorithm(1);
            return 2;
        }
        //Run the algorithm and return 1 if it needs to be run again
        else if (this.distanceTransformAlgorithmIterative())
            return 1;
        //The algorithm made no changes and so its complete
        else {
            //Report that we've completed calculations
            this.reportCompletion();
            //Return the appropriate value
            return 0;
        }
    }
    /**
     * setupDistanceTransformAlgorithm sets up this.distanceTransform in a way
     * that allows it to be used by the subsequent method
     * distanceTransformAlgorithm. We need positions that have not had their
     * distance calculated to be negative one and walls or boundaries to remain 0.
     * @param w The value of walkable spaces. When using the per cell algorithm w
     * should be -1 to tell it the cell needs checked. Using the iterative
     * implementation use 1 to indicate the cell's minimum possible distance from
     * the walls.
     */
    setupDistanceTransformAlgorithm(w = -1) {
        //Find the terrain of the room we're in.
        var terrain = this.room.getTerrain();
        //Init the matrix we're setting up
        this.distanceTransform = [];
        //Iterate through the y values
        for (var y = 0; y < 50; y++) {
            //Make a row to temporarily store values
            var row = [];
            //Iterate down the row
            for (var x = 0; x < 50; x++) {
                //If we're too close to the walls its a 0 for the sake of this algorithm even if its walkable
                if (x >= 48 || x <= 1 || y <= 1 || y >= 48)
                    row.push(0);
                //If the terrain is a wall add a 0 to the row array
                else if (terrain.get(x, y) == 1)
                    row.push(0);
                //If the terrain is walkable add a -1 to the row array
                else
                    row.push(w);
            }
            //Add the row to the matrix
            this.distanceTransform.push(row);
        }
    }
    /**
     * Calculates the distance for the first (-1) value it finds in the
     * distanceTransform array. This implementation has far fewer checks than the
     * iterative solution I've used in the past which would preform 8 * 625. This
     * one preforms (<=) 2 * 625 checks. Once for finding the cell and secondly to
     * calculate its distance.
     * @exception "Distance transform storage matrix is not defined."
     * @return true - Changes were made, follow up calls are required.
     * @return false - Changes were not made and follow up calls are not required.
     */
    distanceTransformAlgorithm() {
        //Check if distanceTransform is defined... it should be .-.
        if (this.distanceTransform == undefined)
            throw "Distance Transform storage matrix is not defined.";
        //Variable to determine if we're done or not
        var notDone = false;
        //Iterate through elements until one is -1
        for (var y = 0; y < 50; y++)
            for (var x = 0; x < 50; x++)
                if (this.distanceTransform[y][x] == -1) {
                    //We've found an item that needs calculated so we can say we're not done
                    notDone = true;
                    //The starting delta to check for any walls
                    var delta = 0;
                    //A boolean to determine exit
                    var exit = false;
                    //A nice infinite loop we'll break from in a bit once exit conditions are met
                    while (!exit) {
                        //Increase delta
                        delta++;
                        //Set our dx to delta
                        var dx = delta;
                        //Iterate through y's looking for a wall
                        for (var dy = -delta; dy <= delta; dy++)
                            if (this.distanceTransform[y + dy][x + dx] == 0)
                                exit = true;
                        //Same for negative dx
                        dx = -delta;
                        //Iterate through y's looking for a wall
                        for (var dy = -delta; dy <= delta; dy++)
                            if (this.distanceTransform[y + dy][x + dx] == 0)
                                exit = true;
                        //Set our dy to delta
                        var dy = delta;
                        //Iterate through x's looking for a wall
                        for (var dx = -delta; dx <= delta; dx++)
                            if (this.distanceTransform[y + dy][x + dx] == 0)
                                exit = true;
                        //Same for negative dy
                        dy = -delta;
                        //Iterate through x's looking for a wall
                        for (var dx = -delta; dx <= delta; dx++)
                            if (this.distanceTransform[y + dy][x + dx] == 0)
                                exit = true;
                    }
                    //Set our value to how far we got
                    this.distanceTransform[y][x] = delta;
                    //We don't want to calculate more than one per round since that can get expensive so we return what we got
                    return notDone;
                }
        //Return whether we are done or not
        return notDone;
    }
    /**
     * Calculate the distance transform for all positions iteratively. Overall
     * preforms 8 * 625 checks per rotation which is far more than the above's
     * max of 2 * 625 however this aglorithm only needs to be called n + 1 times
     * where n is the maximum distance any point has from a wall. The other needs
     * called once for every open space which I estimate to be roughly 500 spaces.
     * It works by checking if all of the neighbors of the cell are equal to it
     * and are not a wall. If they're not a wall and have the same distance value
     * as our current self we can assume our distance is at least theirs + 1.
     */
    distanceTransformAlgorithmIterative() {
        //Check that the distance transform is defined
        if (this.distanceTransform == undefined)
            throw "Distance Transform matrix is not defined.";
        //Temporary variable to store the matrix
        var temp = _.cloneDeep(this.distanceTransform);
        //Another temp variable to determine if any changes were made
        var change = false;
        //Iterate through all matrix positions
        for (var y = 0; y < 50; y++)
            for (var x = 0; x < 50; x++) {
                //Store the current cell we're looking at since there's going to be a lot of comparisons
                var current = this.distanceTransform[x][y];
                //If the current cell is a wall we can move on
                if (current == 0)
                    continue;
                //Check the neighbors and if any of them are lower than we are, we cannot
                // assume our distance is any higher than it is so we continue on
                if (this.distanceTransform[x][y - 1] < current)
                    continue;
                if (this.distanceTransform[x + 1][y - 1] < current)
                    continue;
                if (this.distanceTransform[x - 1][y - 1] < current)
                    continue;
                if (this.distanceTransform[x - 1][y] < current)
                    continue;
                if (this.distanceTransform[x + 1][y] < current)
                    continue;
                if (this.distanceTransform[x][y + 1] < current)
                    continue;
                if (this.distanceTransform[x + 1][y + 1] < current)
                    continue;
                if (this.distanceTransform[x - 1][y + 1] < current)
                    continue;
                //If all of our neighbors are lower than us we can make a change and report that
                change = true;
                //Increment the cell
                temp[x][y]++;
            }
        //Update the matrix with our calculations
        this.distanceTransform = temp;
        //Return whether or not a change was made to the matrix
        return change;
    }
}

/**
 * Import the algorithm abstract class because well... this is an algorithm is
 * it not?
 */
/**
 * The flood fill class handles the calculation of the flood fill algorithm. The
 * flood fill algorithm simulates a flood starting from a point marked by the flag
 * "Flood" and expands outwards only being stopped by natural walls, man made
 * walls and ramparts.
 */
class FloodFill extends Algorithm {
    /**
     * Construct a FloodFill object. For the most part is needs only to know the
     * room its running calculations on.
     * @param r - The room flood fill is being run on.
     */
    constructor(r) {
        //Make an appeal to a higher power with our name
        super("Flood Fill");
        /**
         * The matrix we're using to run the algorithm and report our findings.
         */
        this.floodFill = undefined;
        //Set our local room
        this.room = r;
    }
    /**
     * Return the matrix of the algorithm. Note that this may be incomplete and
     * isComplete() should be used before using it for any planning.
     */
    getResult() { return this.floodFill; }
    /**
     * The manager manages the flood fill algorithm and guides it through all of its
     * major steps. When making calls to this class only manager or the above
     * accessor methods should be touched or called. Doing anything else may
     * interfere with the algorithm.
     * @return - 2 Flood Fill matrix init'd.
     * @return - 1 We need an another call to make more calculations... progress
     * is being made.
     * @return - 0 The algorithm is done running and is complete. No more calls
     * needed.
     */
    manager() {
        //If our matrix isn't, set it up and return the appropriate value
        if (this.floodFill == undefined) {
            this.setupFloodFillAlgorithm();
            return 2;
        }
        //Run the algorithm and if a change is made return 1
        else if (this.floodFillAlgorithm())
            return 1;
        //If the algorithm was run and no changes were made we're complete
        else
            return 0;
    }
    /**
     * setupFloodFillAlgorithm sets up this.floodFill in a way that allows it to be
     * used by the subsequent method floodFillAlgorithm. We need non walls to be
     * one and walls to be 0.
     */
    setupFloodFillAlgorithm() {
        //Update the stale room game object
        this.room = Game.rooms[this.room.name];
        //Make a temp variable to store the terrain of the room
        var terrain = this.room.getTerrain();
        //Init the matrix so it can store values
        this.floodFill = [];
        //Iterate through the y values
        for (var y = 0; y < 50; y++) {
            //Make a row to temporarily store values
            var row = [];
            //Iterate down the row
            for (var x = 0; x < 50; x++) {
                //If the terrain is a wall add a 0 to the row array
                if (terrain.get(x, y) == 1)
                    row.push(0);
                //If the terrain is walkable add a 01 to the row array
                else
                    row.push(1);
            }
            //Add the row to the matrix
            this.floodFill.push(row);
        }
        //Add the first infected tile to the matrix
        this.floodFill[Game.flags["Flood"].pos.y][Game.flags["Flood"].pos.x] = -1;
    }
    /**
     * Infects tiles next to the infected tile if they should be infected. It
     * checks all neighbors of any -1 cells it finds which is always less than 625
     * so the estimate checks bounded above by 625 + 8 * 625 (The surface area of
     * the current infection).
     * @exception "Flood Fill storage matrix is not defined."
     * @return true - Changes were made, follow up calls are required.
     * @return false - Changes were not made and follow up calls are not required.
     */
    floodFillAlgorithm() {
        //Check if floodfill is defined... it should be .-.
        if (this.floodFill == undefined)
            throw "Flood Fill storage matrix is not defined.";
        //Make a temproary clone of the matrix
        var temp = _.cloneDeep(this.floodFill);
        //Make a temp variable to store whether we've made a change or not
        var change = false;
        //Iterate through the matrix and find an infected cell
        for (var y = 1; y < 49; y++)
            for (var x = 1; x < 49; x++)
                if (this.floodFill[y][x] == -1) {
                    //Check if the value of a cell is 1, if it is call some additional logic to determine whether it should
                    // be changed. We also set change = change || helper() so we can garuntee any changes made will result in
                    // change ending in a true value.
                    if (this.floodFill[y][x - 1] == 1)
                        change = this.floodFillHelper(y, x - 1, temp) || change;
                    if (this.floodFill[y + 1][x - 1] == 1)
                        change = this.floodFillHelper(y + 1, x - 1, temp) || change;
                    if (this.floodFill[y - 1][x - 1] == 1)
                        change = this.floodFillHelper(y - 1, x - 1, temp) || change;
                    if (this.floodFill[y - 1][x] == 1)
                        change = this.floodFillHelper(y - 1, x, temp) || change;
                    if (this.floodFill[y + 1][x] == 1)
                        change = this.floodFillHelper(y + 1, x, temp) || change;
                    if (this.floodFill[y][x + 1] == 1)
                        change = this.floodFillHelper(y, x + 1, temp) || change;
                    if (this.floodFill[y + 1][x + 1] == 1)
                        change = this.floodFillHelper(y + 1, x + 1, temp) || change;
                    if (this.floodFill[y - 1][x + 1] == 1)
                        change = this.floodFillHelper(y - 1, x + 1, temp) || change;
                }
        //Update the flood fill matrix
        this.floodFill = temp;
        //Return whether we made a change or not
        return change;
    }
    /**
     * Determines whether the given position should be infected and makes the
     * change should it be required.
     * @param y - The y position of the cell.
     * @param x - The x position of the cell.
     * @param temp - The matrix we're updating if it needs to be changed.
     * @return true - The change was made.
     * @return false - The change was not made.
     */
    floodFillHelper(y, x, temp) {
        //Look at the cell in the room
        var l = this.room.lookAt(x, y);
        //Make a temp boolean to determine if we're making the change
        var t = false;
        //Search through the items in l and set t to true if one of them satisfies the conditions
        for (let i in l)
            if (l[i].type == LOOK_STRUCTURES) {
                t = true;
                break;
            }
        //If t has been satisfied make the change
        if (!t)
            temp[y][x] = -1;
        //Return whether t has been satisifed
        return t;
    }
}

class ConstructionProject {
    constructor(p, t) {
        this.pos = p;
        this.type = t;
    }
    place() {
        Game.rooms[this.pos.roomName].createConstructionSite(this.pos, this.type);
    }
}
var patterns;
(function (patterns) {
    patterns["BUNKER"] = "bunker";
})(patterns || (patterns = {}));
/**
 * The room planner has a number of nice algorithms and methods defined to help
 * in the planning of rooms as a whole.
 */
class RoomPlanner {
    // private minCut:MinCut;
    constructor(r) {
        this.construction = undefined;
        this.planningComplete = false;
        this.room = r;
        this.distanceTransform = new DistanceTransform(r);
        this.floodFill = new FloodFill(r);
    }
    getDistanceTransform() { return this.distanceTransform.getResult(); }
    isDistanceTransformComplete() { return this.distanceTransform.isComplete(); }
    computeDistanceTransform() { return this.distanceTransform.manager(); }
    getFloodFill() { return this.floodFill.getResult(); }
    isFloodFillComplete() { return this.floodFill.isComplete(); }
    computeFloodfill() { return this.floodFill.manager(); }
    // getMinCut(){ return this.minCut.getResult(); }
    // isMinCutComplete() { return this.minCut.isComplete(); }
    // computeMinCut() { return this.mincut.manager(); }
    getConstruction() {
        if (this.room.controller.level < 2)
            return undefined;
        else if (!this.isDistanceTransformComplete())
            return undefined;
        else if (this.construction == undefined && this.room.controller.level == 2)
            this.constructionProjects2();
        return this.construction;
    }
    constructionProjects2() {
        //Roads
        // var s:Source[] = this.room.find(FIND_SOURCES);
        // var p:PathStep[];
        // for (var i = 0; i < s.length; i++) {
        //   p = this.room.findPath(this.room.controller!.pos, s[i].pos, {ignoreCreeps: true, ignoreRoads: true, swampCost: 2});
        //   for (var j = 1; j < p.length - 1; j++) this.construction.push(new ConstructionProject(new RoomPosition(p[j].x,p[j].y,this.room.name), STRUCTURE_ROAD));
        // }
        //Check if construction is defined... it should be
        if (this.construction == undefined)
            throw "Construction is not defined.";
        //If we're using the bunker pattern
        if (this.roomType == patterns.BUNKER) {
            //Throw an error if we don't have bunker center defined for some reason.
            if (this.bunkerCenter == undefined)
                throw "Bunker Center not defined.";
            //Five extensions and their locations
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 3, this.bunkerCenter.y + 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 4, this.bunkerCenter.y + 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 2, this.bunkerCenter.y + 3, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 3, this.bunkerCenter.y + 3, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 2, this.bunkerCenter.y + 4, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
        }
    }
    /**
     * constructionProjects3 adds projects with their appropriate location to the
     * construction array to be built in a room in the future. Buildings are added
     * with the assumption that anything requiring controller level 3 can be
     * built.
     * O(c) --> Runs in constant time.
     * @exception "Needed elements not defined."
     * @exception "Bunker Center not defined."
     */
    constructionProjects3() {
        //Check if construction is defined... it should be
        if (this.construction == undefined)
            throw "Construction is not defined.";
        //If we're using the bunker pattern
        if (this.roomType == patterns.BUNKER) {
            //Throw an error if we don't have bunker center defined for some reason.
            if (this.bunkerCenter == undefined)
                throw "Bunker Center not defined.";
            //One tower and its position
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 1, this.bunkerCenter.y - 1, this.bunkerCenter.roomName), STRUCTURE_TOWER));
            //Five extensions and their positions
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 2, this.bunkerCenter.y - 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 3, this.bunkerCenter.y - 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 4, this.bunkerCenter.y - 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 3, this.bunkerCenter.y - 1, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 3, this.bunkerCenter.y + 1, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
        }
    }
    /**
     * constructionProjects4 adds projects with their appropriate location to the
     * construction array to be built in a room in the future. Buildings are added
     * with the assumption that anything requiring controller level 4 can be
     * built.
     * O(c) --> Runs in constant time.
     * @exception "Needed elements not defined."
     * @exception "Bunker Center not defined."
     */
    constructionProjects4() {
        //Check if construction is defined... it should be
        if (this.construction == undefined)
            throw "Construction is not defined.";
        //If we're using the bunker pattern
        if (this.roomType == patterns.BUNKER) {
            //Throw an error if we don't have bunker center defined for some reason.
            if (this.bunkerCenter == undefined)
                throw "Bunker Center not defined.";
            //One storage and its position
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x, this.bunkerCenter.y + 4, this.bunkerCenter.roomName), STRUCTURE_STORAGE));
            //Ten extensions and their locations
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 2, this.bunkerCenter.y - 3, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 1, this.bunkerCenter.y - 3, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 3, this.bunkerCenter.y - 3, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 2, this.bunkerCenter.y - 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 3, this.bunkerCenter.y - 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 4, this.bunkerCenter.y - 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 3, this.bunkerCenter.y - 1, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 1, this.bunkerCenter.y - 3, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 2, this.bunkerCenter.y - 3, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 3, this.bunkerCenter.y - 3, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
        }
    }
    /**
     * constructionProjects5 adds projects with their appropriate location to the
     * construction array to be built in a room in the future. Buildings are added
     * with the assumption that anything requiring controller level 5 can be
     * built.
     * O(c) --> Runs in constant time.
     * @exception "Needed elements not defined."
     * @exception "Bunker Center not defined."
     */
    constructionProjects5() {
        //Check if construction is defined... it should be
        if (this.construction == undefined)
            throw "Construction is not defined.";
        //If we're using the bunker pattern
        if (this.roomType == patterns.BUNKER) {
            //Throw an error if we don't have bunker center defined for some reason.
            if (this.bunkerCenter == undefined)
                throw "Bunker Center not defined.";
            //One tower and its location
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 1, this.bunkerCenter.y - 1, this.bunkerCenter.roomName), STRUCTURE_TOWER));
            //Ten extensions and their positions
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 5, this.bunkerCenter.y + 1, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 5, this.bunkerCenter.y - 1, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 5, this.bunkerCenter.y + 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 5, this.bunkerCenter.y + 4, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 5, this.bunkerCenter.y + 3, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 4, this.bunkerCenter.y + 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 4, this.bunkerCenter.y + 4, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 3, this.bunkerCenter.y + 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 2, this.bunkerCenter.y - 4, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 2, this.bunkerCenter.y - 4, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
        }
    }
    /**
     * constructionProjects6 adds projects with their appropriate location to the
     * construction array to be built in a room in the future. Buildings are added
     * with the assumption that anything requiring controller level 6 can be
     * built.
     * O(c) --> Runs in constant time.
     * @exception "Needed elements not defined."
     * @exception "Bunker Center not defined."
     */
    constructionProjects6() {
        //Check if construction is defined... it should be
        if (this.construction == undefined)
            throw "Construction is not defined.";
        //If we're using the bunker pattern
        if (this.roomType == patterns.BUNKER) {
            //Throw an error if we don't have bunker center defined for some reason.
            if (this.bunkerCenter == undefined)
                throw "Bunker Center not defined.";
            //The terminal and its location
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 2, this.bunkerCenter.y + 2, this.bunkerCenter.roomName), STRUCTURE_TERMINAL));
            //Three labs and their positions
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 3, this.bunkerCenter.y + 2, this.bunkerCenter.roomName), STRUCTURE_LAB));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 3, this.bunkerCenter.y + 3, this.bunkerCenter.roomName), STRUCTURE_LAB));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 2, this.bunkerCenter.y + 3, this.bunkerCenter.roomName), STRUCTURE_LAB));
            //Ten extensions
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x, this.bunkerCenter.y - 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 1, this.bunkerCenter.y - 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 1, this.bunkerCenter.y - 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x, this.bunkerCenter.y - 4, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 5, this.bunkerCenter.y, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 5, this.bunkerCenter.y + 1, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 5, this.bunkerCenter.y - 1, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 4, this.bunkerCenter.y, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 5, this.bunkerCenter.y, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 4, this.bunkerCenter.y, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
        }
        //Place the extractor
        this.construction.push(new ConstructionProject(this.room.find(FIND_MINERALS)[0].pos, STRUCTURE_EXTRACTOR));
    }
    /**
     * constructionProjects7 adds projects with their appropriate location to the
     * construction array to be built in a room in the future. Buildings are added
     * with the assumption that anything requiring controller level 7 can be
     * built.
     * O(c) --> Runs in constant time.
     * @exception "Needed elements not defined."
     * @exception "Bunker Center not defined."
     */
    constructionProjects7() {
        //Check if construction is defined... it should be
        if (this.construction == undefined)
            throw "Construction is not defined.";
        //If we're using the bunker pattern
        if (this.roomType == patterns.BUNKER) {
            //Throw an error if we don't have bunker center defined for some reason.
            if (this.bunkerCenter == undefined)
                throw "Bunker Center not defined.";
            //Three labs and their positions
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 4, this.bunkerCenter.y + 4, this.bunkerCenter.roomName), STRUCTURE_LAB));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 4, this.bunkerCenter.y + 2, this.bunkerCenter.roomName), STRUCTURE_LAB));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 2, this.bunkerCenter.y + 4, this.bunkerCenter.roomName), STRUCTURE_LAB));
            //Two links and their positions // TODO: add the other two next to sources
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 3, this.bunkerCenter.y + 1, this.bunkerCenter.roomName), STRUCTURE_LINK));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 2, this.bunkerCenter.y + 2, this.bunkerCenter.roomName), STRUCTURE_LINK));
            //One tower and its position
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x, this.bunkerCenter.y - 1, this.bunkerCenter.roomName), STRUCTURE_TOWER));
            //Ten extensions and their positions
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 3, this.bunkerCenter.y - 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 2, this.bunkerCenter.y - 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 4, this.bunkerCenter.y - 4, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 3, this.bunkerCenter.y - 4, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 5, this.bunkerCenter.y - 3, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 3, this.bunkerCenter.y - 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 2, this.bunkerCenter.y - 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 4, this.bunkerCenter.y - 4, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 3, this.bunkerCenter.y - 4, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 5, this.bunkerCenter.y - 3, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            //The second spawn and its position
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 2, this.bunkerCenter.y, this.bunkerCenter.roomName), STRUCTURE_SPAWN));
        }
    }
    /**
     * constructionProjects8 adds projects with their appropriate location to the
     * construction array to be built in a room in the future. Buildings are added
     * with the assumption that anything requiring controller level 8 can be
     * built.
     * O(c) --> Runs in constant time.
     * @exception "Needed elements not defined."
     * @exception "Bunker Center not defined."
     */
    constructionProjects8() {
        //Check if construction is defined... it should be
        if (this.construction == undefined)
            throw "Construction is not defined.";
        //If we're using the bunker pattern
        if (this.roomType == patterns.BUNKER) {
            //Throw an error if we don't have bunker center defined for some reason.
            if (this.bunkerCenter == undefined)
                throw "Bunker Center not defined.";
            //Nuker position in the bunker
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x, this.bunkerCenter.y + 5, this.bunkerCenter.roomName), STRUCTURE_NUKER));
            //Power spawn position in the bunker
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x, this.bunkerCenter.y + 2, this.bunkerCenter.roomName), STRUCTURE_POWER_SPAWN));
            //Observer position in the bunker
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 5, this.bunkerCenter.y + 5, this.bunkerCenter.roomName), STRUCTURE_OBSERVER));
            //Four labs and their positions
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 3, this.bunkerCenter.y + 5, this.bunkerCenter.roomName), STRUCTURE_LAB));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 4, this.bunkerCenter.y + 5, this.bunkerCenter.roomName), STRUCTURE_LAB));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 5, this.bunkerCenter.y + 4, this.bunkerCenter.roomName), STRUCTURE_LAB));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 5, this.bunkerCenter.y + 3, this.bunkerCenter.roomName), STRUCTURE_LAB));
            //Three towers and their positions
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 1, this.bunkerCenter.y, this.bunkerCenter.roomName), STRUCTURE_TOWER));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 1, this.bunkerCenter.y, this.bunkerCenter.roomName), STRUCTURE_TOWER));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x, this.bunkerCenter.y + 1, this.bunkerCenter.roomName), STRUCTURE_TOWER));
            //Ten extensions and their positions
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 5, this.bunkerCenter.y - 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 5, this.bunkerCenter.y - 5, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 2, this.bunkerCenter.y - 6, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 2, this.bunkerCenter.y - 6, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 6, this.bunkerCenter.y - 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 6, this.bunkerCenter.y - 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 6, this.bunkerCenter.y + 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 6, this.bunkerCenter.y + 2, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 2, this.bunkerCenter.y + 6, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x - 2, this.bunkerCenter.y + 6, this.bunkerCenter.roomName), STRUCTURE_EXTENSION));
            //The third spawn's position
            this.construction.push(new ConstructionProject(new RoomPosition(this.bunkerCenter.x + 2, this.bunkerCenter.y, this.bunkerCenter.roomName), STRUCTURE_SPAWN));
        }
    }
}

//Import tasks
var p = {};
var EnergyStatus;
(function (EnergyStatus) {
    EnergyStatus[EnergyStatus["EXTREME_DROUGHT"] = 0] = "EXTREME_DROUGHT";
    EnergyStatus[EnergyStatus["HIGH_DROUGHT"] = 0.5] = "HIGH_DROUGHT";
    EnergyStatus[EnergyStatus["DROUGHT"] = 1] = "DROUGHT";
    EnergyStatus[EnergyStatus["MEDIUM_DROUGHT"] = 1.5] = "MEDIUM_DROUGHT";
    EnergyStatus[EnergyStatus["LIGHT_DROUGHT"] = 2] = "LIGHT_DROUGHT";
    EnergyStatus[EnergyStatus["LIGHT_FLOOD"] = 2.5] = "LIGHT_FLOOD";
    EnergyStatus[EnergyStatus["MEDIUM_FLOOD"] = 3] = "MEDIUM_FLOOD";
    EnergyStatus[EnergyStatus["FLOOD"] = 3.5] = "FLOOD";
    EnergyStatus[EnergyStatus["HIGH_FLOOD"] = 4] = "HIGH_FLOOD";
    EnergyStatus[EnergyStatus["EXTREME_FLOOD"] = 4.5] = "EXTREME_FLOOD";
})(EnergyStatus || (EnergyStatus = {}));
/**
 * A colony is a small collection of rooms. Each colony has a number of creeps
 * it needs to spawn to be functional.
 */
class Colony {
    //Constructors
    constructor(r) {
        this.home = r;
        this.era = -1;
        this.homePrototype = new struc_Room(r.name);
        if (r.controller != undefined)
            if (r.controller.level <= 2)
                this.era = 0;
        this.spawnManager = new SpawnManager(Game.rooms[this.homePrototype.getRoomRefrence()]);
        this.home.memory.counts = p;
        this.roomPlanner = new RoomPlanner(this.home);
    }
    //Methods
    run() {
        this.home = Game.rooms[this.home.name];
        var h = this.home.find(FIND_HOSTILE_CREEPS);
        if (h != undefined && h.length > 0) {
            var t = this.home.find(FIND_MY_STRUCTURES, { filter: (f) => f.structureType == STRUCTURE_TOWER });
            for (var i = 0; i < t.length; i++) {
                // This is legal because of the filter we used.
                // @ts-ignore
                var tower = t[i];
                tower.attack(h[0]);
            }
        }
        var c = this.home.find(FIND_CONSTRUCTION_SITES);
        if (this.roomPlanner.getConstruction() != undefined && c.length == 0)
            this.roomPlanner.getConstruction().pop().place();
        //Request a census every 100 ticks
        if (Game.time % 100 == 0) {
            Queue.request(new Run_Census(this));
            Queue.request(new Check_Energy(this));
        }
        if (this.roomPlanner.getDistanceTransform() == undefined)
            Queue.request(new Calculate_DistanceTransform(this));
        // if (this.roomPlanner.getMinCut() == undefined) {
        //   var pos:RoomPosition[] = [];
        //   var t = this.home.find(FIND_MY_STRUCTURES);
        //   for (var i = 0; i < t.length; i ++) pos.push(t[i].pos);
        //   pos.push(this.home.controller!.pos);
        //   Queue.request(new Calculate_MinCut(this, pos));
        // }
        if (Game.flags["Flood"] != undefined)
            if (Game.flags["Flood"].room.name == this.home.name)
                Queue.request(new Calculate_FloodFill(this, Game.flags["Flood"].pos));
        this.checkGoals();
        //Run the spawn manger.
        spawn(this.home);
        if (Game.flags["Visuals"] != undefined)
            new VisualsManager().run(this.home.name, this.roomPlanner.getDistanceTransform(), this.roomPlanner.getFloodFill());
    }
    /**
     * This method runs a quick census of all the creeps and updates the memory in
     * this.home to their numbers.
     */
    census() {
        this.home.memory.counts["Miner"] = 0;
        this.home.memory.counts["Carrier"] = 0;
        this.home.memory.counts["Jumpstart"] = 0;
        this.home.memory.counts["Worker"] = 0;
        this.home.memory.counts["RepairBot"] = 0;
        this.home.memory.counts["Scout"] = 0;
        this.home.memory.counts["Extractor"] = 0;
        for (let c in Game.creeps) {
            var creep = Game.creeps[c];
            if (creep.memory.room != this.home.name)
                continue;
            if (creep.memory.role == undefined)
                this.home.memory.counts["Worker"]++;
            else
                this.home.memory.counts[creep.memory.role]++;
        }
    }
    /**
     * checkGoals checks the goals of the colony and updates it with new roles
     * which are currently needed.
     */
    checkGoals() {
        //Search for a set of objects
        var threashold = 3;
        for (var i = 1; i <= this.home.controller.level; i++)
            threashold = threashold * 10;
        const w = this.home.find(FIND_STRUCTURES, { filter: (c) => (c.structureType == STRUCTURE_RAMPART || c.structureType == STRUCTURE_WALL) && c.hits < threashold });
        const r = this.home.find(FIND_STRUCTURES, { filter: (c) => c.hits < c.hitsMax && (c.structureType != STRUCTURE_WALL && c.structureType != STRUCTURE_RAMPART) });
        const c = this.home.find(FIND_CONSTRUCTION_SITES);
        const d = this.home.find(FIND_SOURCES_ACTIVE);
        const s = this.home.find(FIND_MY_STRUCTURES, { filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0 }); //O(7 + 3n)
        if (this.home.terminal != undefined && Game.time % 1500 == 0)
            if (this.home.terminal.store.getUsedCapacity(RESOURCE_ENERGY) < 10000)
                CreepManager.declareJob(new Job(Goals.TRADE, this.home.name));
        //Check the goals that need to be taken
        if (w != null && w.length > 0 && Game.time % 500 == 0)
            CreepManager.declareJob(new Job(Goals.REINFORCE, this.home.name));
        if (r != null && r.length > 0 && Game.time % 500 == 0)
            CreepManager.declareJob(new Job(Goals.FIX, this.home.name));
        if (c != null && c.length > 0 && Game.time % 250 == 0)
            CreepManager.declareJob(new Job(Goals.BUILD, this.home.name));
        if (s != null && s.length > 0 && Game.time % 25 == 0)
            CreepManager.declareJob(new Job(Goals.FILL, this.home.name));
        if (d != null && d.length > 0 && Game.time % 500 == 0)
            CreepManager.declareJob(new Job(Goals.STORE, this.home.name));
    }
    checkEnergyStatus() {
        if (this.home.storage == undefined)
            this.energyStatus = undefined;
        else {
            const energy = this.home.storage.store.getUsedCapacity(RESOURCE_ENERGY);
            if (energy > 450000)
                this.energyStatus = EnergyStatus.EXTREME_FLOOD;
            else if (energy > 400000)
                this.energyStatus = EnergyStatus.HIGH_FLOOD;
            else if (energy > 350000)
                this.energyStatus = EnergyStatus.FLOOD;
            else if (energy > 300000)
                this.energyStatus = EnergyStatus.MEDIUM_FLOOD;
            else if (energy > 250000)
                this.energyStatus = EnergyStatus.LIGHT_FLOOD;
            else if (energy > 200000)
                this.energyStatus = EnergyStatus.LIGHT_DROUGHT;
            else if (energy > 150000)
                this.energyStatus = EnergyStatus.MEDIUM_DROUGHT;
            else if (energy > 100000)
                this.energyStatus = EnergyStatus.DROUGHT;
            else if (energy > 50000)
                this.energyStatus = EnergyStatus.HIGH_DROUGHT;
            else
                this.energyStatus = EnergyStatus.EXTREME_DROUGHT;
        }
        this.home.memory.energyStatus = this.energyStatus;
    }
}
class Run_Colony extends template {
    //Constructor
    constructor(c) {
        super("Run Colony");
        this.colony = c;
    }
    //Methods
    run() {
        this.colony.run();
    }
}
class Run_Census extends template {
    //Construtor
    constructor(c) {
        super("Run Census");
        this.colony = c;
    }
    //Methods
    run() {
        this.colony.census();
    }
}
class Check_Energy extends template {
    constructor(c) {
        super("Check Energy");
        this.colony = c;
    }
    run() { this.colony.checkEnergyStatus(); }
}
class Calculate_DistanceTransform extends template {
    //Constructor
    constructor(c) {
        super("Calculate Distance-transform");
        this.colony = c;
    }
    //Methods
    run() {
        if (this.colony.roomPlanner.computeDistanceTransform() != 0)
            Queue.request(new Calculate_DistanceTransform(this.colony));
    }
}
class Calculate_FloodFill extends template {
    //Constructor
    constructor(c, p) {
        super("Calculate Flood Fill");
        this.colony = c;
        this.start = p;
    }
    //Methods
    run() {
        if (this.colony.roomPlanner.computeFloodfill() != 0)
            Queue.request(new Calculate_FloodFill(this.colony, this.start));
    }
}
// export class Calculate_MinCut extends template implements task {
//   //Variables
//   name:string = "Calculate Min Cut";
//   colony:Colony;
//   protect:RoomPosition[] | undefined;
//
//   //Constructor
//   constructor(c:Colony, p:RoomPosition[] | undefined) {
//     super();
//     this.colony = c;
//     this.protect = p;
//   }
//
//   //Methods
//   run() {
//     if (this.colony.roomPlanner.minCutManager(this.protect) != 0) Queue.request(new Calculate_MinCut(this.colony, undefined));
//   }
// }

var SortTypes;
(function (SortTypes) {
    SortTypes["PRICE"] = "price";
})(SortTypes || (SortTypes = {}));
class MarketManipulator {
    static look(r = undefined, t = undefined) {
        if (r == undefined && t == undefined)
            MarketManipulator.orders = Game.market.getAllOrders();
        else if (r != undefined && t == undefined)
            MarketManipulator.orders = Game.market.getAllOrders({ resourceType: r });
        else if (r == undefined && t != undefined && (t == ORDER_SELL || t == ORDER_BUY))
            MarketManipulator.orders = Game.market.getAllOrders({ type: t });
        else if (t == ORDER_SELL || t == ORDER_BUY)
            MarketManipulator.orders = Game.market.getAllOrders({ type: t, resourceType: r });
        else
            throw "Order type is not \"sell\" or \"buy\".";
        return 0;
    }
    static sort(t) {
        switch (t) {
            case SortTypes.PRICE: MarketManipulator.orders.sort((a, b) => b.price - a.price);
        }
        return 0;
    }
    static marketSell(r, t) {
        if (Game.rooms[t].terminal != undefined)
            t = Game.rooms[t].terminal;
        else
            return -1; //throw "No terminal was found in room [" + t + "]";
        MarketManipulator.look(r, ORDER_BUY);
        MarketManipulator.sort(SortTypes.PRICE);
        var spent = 0;
        var totalFees = 0;
        var i = 0;
        const toSpend = t.store.getUsedCapacity(r);
        while (spent < toSpend && MarketManipulator.orders[i] != undefined) {
            const amount = Math.min(MarketManipulator.orders[i].remainingAmount, toSpend - spent);
            const fees = Game.market.calcTransactionCost(amount, t.room.name, MarketManipulator.orders[i].roomName);
            if (totalFees + fees > t.store.getUsedCapacity(RESOURCE_ENERGY))
                return -5;
            Game.market.deal(MarketManipulator.orders[i].id, amount, t.room.name);
            spent += amount;
            totalFees += fees;
            i++;
            if (i == 10)
                break; //No more than 10 orders per tick
        }
        return 0;
    }
    static print() {
        console.log("Current Market View");
        for (var i = 0; i < MarketManipulator.orders.length; i++)
            console.log("[" + MarketManipulator.orders[i].id + "] " + MarketManipulator.orders[i].type + " " + MarketManipulator.orders[i].resourceType + " - " + MarketManipulator.orders[i].remainingAmount + " <" + MarketManipulator.orders[i].price + ">");
        return 0;
    }
}
MarketManipulator.orders = [];

//A queue object holding the items which have been queue'd to complete.
var queue = new Queue();
//A rooms object holding all the rooms.
var rooms;
new StatsManager();
//A colony array holding all of the colonies
exports.colonies = void 0;
// @ts-ignore, javascript shenanigans, ignore it typescript
global.Stats = module.exports = StatsManager;
// @ts-ignore
global.Queue = module.exports = queue;
// @ts-ignore
global.Creeps = module.exports = CreepManager;
// @ts-ignore
global.Market = module.exports = MarketManipulator;
/**
 * This is the main loop for the program. Expect clean concise code, anything
 * else means I should really get to work.
 */
module.exports.loop = function () {
    //Purge duplicate requests on ocasion
    Queue.purgeDuplicateRequests();
    //Proccess the requests from the last tick
    queue.proccessRequests();
    //Check if we have any colonies. If we don't make one.
    if (exports.colonies == undefined) {
        exports.colonies = [];
        for (let r in Game.rooms) {
            exports.colonies.push(new Colony(Game.rooms[r]));
        }
    }
    //Generate a pixel if we can.
    if (Game.cpu.bucket == 10000)
        if (Game.shard.name != "")
            Game.cpu.generatePixel();
    //Things that should always be ran
    queue.queueAdd(new creepAI_CreepManager(), priority.HIGH);
    //Add running the colonies to the queue
    // for(var i = 0; i < colonies.length; i++) queue.queueAdd(new Setup_Goals(colonies[i]), priority.HIGH);
    for (var i = 0; i < exports.colonies.length; i++)
        queue.queueAdd(new Run_Colony(exports.colonies[i]), priority.HIGH);
    //Add items that should always be run... but only if they can be
    queue.queueAdd(new update_Rooms(rooms), priority.LOW);
    queue.queueAdd(new collect_Stats(), priority.LOW);
    queue.queueAdd(new run_CreepManager(), priority.LOW);
    //Check if we need to init rooms again, if so do it at maximum priority
    if (rooms == undefined)
        rooms = (new init_Rooms(rooms).run());
    //Telemetry stuffs
    queue.runQueue();
};
//# sourceMappingURL=main.js.map
