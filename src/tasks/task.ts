/**
 * This file contains the interface definitions for tasks.
 */
export interface task extends template {
 /**
  * A string variable which stores the shorthand name for the task.
  */
  name: string,
 /**
  * Returns the name of the task.
  */
  getName():string,
 /**
  * Runs the task.
  */
  run():void
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
  name: string = "Undefined";

  //Constructor
  constructor(){}

  //Accessor methods
  /**
   * Returns the name of the task
   */
  getName(){ return this.name; }
}
