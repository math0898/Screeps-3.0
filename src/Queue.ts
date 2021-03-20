/**
 * This enum cotains a couple number threasholds which are used later in this
 * file and in main.ts to determine how urgent a task may be. High number means
 * more urgency.
 */
export enum priority { HIGH = 100, MEDIUM = 50, LOW = 25, NONE = 0 }
/**
 * The Request class defines what a request looks like when it's sent from
 * somewhere other than main.ts. With the exception of main.ts every added to
 * the queue will be a version of the Request class at some point.
 */
class Request {
  /*
   * Task points to the task that is in this request.
   */
  private task: task;
  /**
   * Prio is the priority enum level that the request should be run at.
   */
  private prio: priority;
  /**
   * This describes the basic construction of a priority. Similar to the Request
   * class its fairly basic and just requires the setting of local counterparts.
   * Runtime: O(2)
   * @param t The described in the request
   * @param p The prioirty the task should be run at
   */
  constructor(t:task, p:priority){ this.task = t; this.prio = p; } //O(2)
  /**
   * getTask() returns the task in the Request object.
   * Runtime: O(1)
   */
  getTask(){ return this.task; } //O(1)
  /**
   * The getPrio method returns the priority of the Request object.
   * Runtime: O(1)
   */
  getPrio(){ return this.prio; } //O(1)
}
/**
 * We import the task interface from "task" so we can act on class which
 * implement the interace.
 */
import { task } from "task";
/**
 * This class, Queue implements a queue object which contains a list of tasks
 * to be run in reverse order on the priority level. For example if you add a, b
 * and c at priority HIGH once the queue starts the HIGH prioity it will resolve
 * in, c -> b -> a, assuming there's sufficent cpu remaining.
 */
export class Queue{
  /**
   * highTasks contains an array of tasks objects which are assumed to have a
   * priority of HIGH. Tasks with a HIGH priority are run without consideration
   * for cpu usage.
   */
  highTasks: task[] = [];
  /**
   * The mediumTasks array contains an array of tasks objects which are assumed
   * to have a priority of MEDIUM. Tasks are often run quickly with some
   * consideration for CPU usage.
   */
  mediumTasks: task[] = [];
  /**
   * This variable, lowTasks contains an array of task objects which are assumed
   * to have a priority of LOW. These tasks are run when they do not pose much
   * risk to going over on CPU.
   */
  lowTasks: task[] = [];
  /**
   * tasks contains an array of tasks objects which are assumed to have no
   * priority. A few examples of tasks which may end up here include various
   * screen drawing functions and console logging. Tasks at this level do not
   * run if they have the potential to go over on CPU.
   */
  tasks: task[] = [];
  /**
   * By default requests are empty but requests can be added by other tasks and
   * classes which need something to be done. requests are static and not bound
   * to any particular Queue object but are removed once they've entered a
   * specific queue.
   */
  static requests: Request[] = [];
  /**
   * The printQueue method prints all the items in the queue to the console in a
   * hopefully human readable format.
   * Runtime: O(9 + 5h + 5m + 5l + 5t) or O(9 + 5n) where n is the number of
   * tasks in all arrays
   */
  printQueue(){
    //Nice header
    console.log("---- Queue: ----"); //O(1)
    //Print a sub header
    console.log(priority.HIGH + ": "); //O(2)
    //Iterate through the list and print
    for(var j = 0; j < this.highTasks.length; j++) console.log("    " + this.highTasks[j].getName()); //O(3 + 5h)
    //Print a sub header
    console.log(priority.MEDIUM + ": "); //O(4 + 5h)
    //Iterate through the list and print
    for(var j = 0; j < this.mediumTasks.length; j++) console.log("    " + this.mediumTasks[j].getName()); //O(5 + 5h + 5m)
    //Print a sub header
    console.log(priority.LOW + ": "); //O(6 + 5h + 5m)
    //Iterate through the list and print
    for(var j = 0; j < this.lowTasks.length; j++) console.log("    " + this.lowTasks[j].getName()); //O(7 + 5h + 5m + 5l)
    //Print a sub header
    console.log(priority.NONE + ": "); //O(8 + 5h + 5m + 5l)
    //Iterate through the list and print
    for(var j = 0; j < this.tasks.length; j++) console.log("    "+ this.tasks[j].getName()); //O(9 + 5h + 5m + 5l + 5t)
  }

  // TODO: Runtime analysis
  /**
   * Run the queue and any tasks with a relative cost priority less than what is
   * by default all tasks are run.
   * Runtime is dependent on items in the queue and can vary. Using a higher
   * priority run will reduce the runtime though.
   * @param prio The priority level of tasks that should be run.
   */
  runQueue(){
    //NOTE: Might be better to check for each section instead of each task. Maybe
    // implement a check for each group until within 10% then check per task.
    //Run everything in the HIGH queue... no consideration for cpu
    while (this.highTasks.length > 0) this.highTasks.pop()?.run();
    //Run medium tasks until we're within 2% of the cap
    while (this.mediumTasks.length > 0 && Game.cpu.getUsed() < Game.cpu.limit * 0.98) this.mediumTasks.pop()?.run();
    //Run low tasks until we're within 5% of the cap
    while (this.lowTasks.length > 0 && Game.cpu.getUsed() < Game.cpu.limit * 0.95) this.lowTasks.pop()?.run();
    //Run no priority tasks until we're within 10% of the cap
    while (this.tasks.length > 0 && Game.cpu.getUsed() < Game.cpu.limit * 0.90) this.tasks.pop()?.run();
  }
 /**
  * Adds an item to the queue at the prioirty given.
  * Runtime: O(c) ---> Runs in constant time.
  * @param t the task to be added.
  * @param p the priority to add the task at. Defaults to no priority
  */
  queueAdd(t: task, p: priority = priority.NONE){
    //Check the priority this should be added at
    switch(p){
      //We're adding the item to the highTasks
      case priority.HIGH: this.highTasks.push(t); break;
      //We're adding the item to the mediumTasks
      case priority.MEDIUM: this.mediumTasks.push(t); break;
      //We're adding the item to the lowTasks
      case priority.LOW: this.lowTasks.push(t); break;
      //We're adding the item to the tasks
      case priority.NONE: this.tasks.push(t); break;
    }
  }
  /**
   * Enters a request for a task to be completed. Must use proccessRequests()
   * before they can be run from a Queue object.
   * Runtime: O(c) ---> Runs in constant time.
   * @param t the task to be added.
   * @param p the priority to add the task at. Defaults to no priority
   */
   static request(t: task, p: priority = priority.NONE){
     //Make a quick request then push it to the array
     var request = new Request(t,p);
     //Add it to the array to be proccessed later
     Queue.requests.push(request);
   }
  /**
   * This takes the requests in the static member requets[] and adds them to the
   * queue object this was called on.
   */
   proccessRequests(){
     //Iterate through the requests and add them to the queue
     for(var i = 0; i < Queue.requests.length; i++) this.queueAdd(Queue.requests[i].getTask(),Queue.requests[i].getPrio());
     //Clear the requests array
     Queue.requests = [];
   }
}
