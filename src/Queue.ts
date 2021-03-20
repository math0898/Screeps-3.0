/**
 * This file implements the Queue class which handles tasks in the priority that
 * they should be run in. The queue handles mostly expensive tasks that should
 * be saved for ticks which don't have as much running.
 * @Author Sugaku, math0898
 */
/**
 * This enum holds the cost levels that the queue can run at.
 */
export enum priority {
  HIGH = 100,
  MEDIUM = 50,
  LOW = 25,
  NONE = 0
}
/**
 * This is a breif class to handle requests.
 */
class Request {
  //Variables
  task: task;
  prio: priority;
  //Constructor
  constructor(t:task, p:priority){
    this.task = t;
    this.prio = p;
  }
  //Accessors
  getTask(){ return this.task; }
  getPrio(){ return this.prio; }
}
//Import the tasks
import { task } from "tasks/task";

//The queue class which prioritizes tasks and runs them relative to their cost.
//BE CAREFUL: Queue resolves in reverse order.
export class Queue{
  //Variables
  highTasks: task[]; //Tasks to be completed with due haste.
  mediumTasks: task[]; //Tasks to be completed with some haste.
  lowTasks: task[]; //Tasks to be completed at the earliest convience.
  tasks: task[]; //Tasks to be completed whenver.
  static requests: Request[] = []; //Tasks to be added to a specfic queue.

  //Constructor
  constructor(){
    //Initalize variables
    this.highTasks = [];
    this.mediumTasks = [];
    this.lowTasks = [];
    this.tasks = [];
  }

  //Accessor methods
 /**
  * Prints the queue at the current priority level.
  * Runtime: O(c) ---> Runs in constant time.
  * @param p the priority cut off for tasks to be printed to the console.
  */
  printQueue(p: priority = priority.NONE){
    //Counter for the number of tasks.
    var i:number = 1;
    //Nice header
    console.log("---- Queue: ----");
    //Print the high prioity section
    if(p <= priority.HIGH) {
      //Print a sub header
      console.log(priority.HIGH + ": ");
      //Iterate through the list
      for(var j = 0; j < this.highTasks.length; j++) {
        //Print the line
        console.log("    " + i + ". " + this.highTasks[j].getName());
        //Increment i
        i++;
      }
    }
    //Print the medium prioity section
    if(p <= priority.MEDIUM) {
      //Print a sub header
      console.log(priority.MEDIUM + ": ");
      //Iterate through the list
      for(var j = 0; j < this.mediumTasks.length; j++) {
        //Print the line
        console.log("    " + i + ". " + this.mediumTasks[j].getName());
        //Increment i
        i++;
      }
    }
    //Print the low prioity section
    if(p <= priority.LOW) {
      //Print a sub header
      console.log(priority.LOW + ": ");
      //Iterate through the list
      for(var j = 0; j < this.lowTasks.length; j++) {
        //Print the line
        console.log("    " + i + ". " + this.lowTasks[j].getName());
        //Increment i
        i++;
      }
    }
    //Print the no prioity section
    if(p <= priority.NONE) {
      //Print a sub header
      console.log(priority.NONE + ": ");
      //Iterate through the list
      for(var j = 0; j < this.tasks.length; j++) {
        //Print the line
        console.log("    " + i + ". " + this.tasks[j].getName());
        //Increment i
        i++;
      }
    }
  }

  //Methods
 /**
  * Run the queue and any tasks with a relative cost priority less than what is
  * by default all tasks are run.
  * Runtime is dependent on items in the queue and can vary. Using a higher
  * priority run will reduce the runtime though.
  * @param prio The priority level of tasks that should be run.
  */
  runQueue(prio: priority = priority.NONE){
    //Run the tasks in the high priority, if priority is sufficently low
    if (prio <= priority.HIGH) while(this.highTasks.length > 0) this.highTasks.pop()?.run();
    //Run the tasks in the medium priority, if priority is sufficently low
    if (prio <= priority.MEDIUM) while(this.mediumTasks.length > 0) this.mediumTasks.pop()?.run();
    //Run the tasks in the low priority, if priority is sufficently low
    if (prio <= priority.LOW) while(this.lowTasks.length > 0) this.lowTasks.pop()?.run();
    //Run the tasks at the minimum priority, if the priority is sufficently low
    if (prio <= priority.NONE) while(this.tasks.length > 0) this.tasks.pop()?.run();
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
