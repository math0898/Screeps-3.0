/**
 * This file contains the interface definitions for tasks.
 */
export interface task extends template {
 /**
  * Runs the task.
  */
  run():number | void //todo: remove void
}
/**
 * A simple class which implements getName() so I don't have to a hundred times
 * over lol xD
 */
export abstract class template {
  //Variables
  /**
   * A string varaible which stores the shorthand name for the task.
   */
  private name: string = "Undefined";

  //Constructor
  /**
   * Implementations of task should call this constructor with their name so it
   * can be private and not changed in the future.
   */
  constructor(n: string){
    this.name = n;
  }

  //Accessor methods
  /**
   * Returns the name of the task
   */
  getName(){ return this.name; }
}
