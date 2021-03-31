/**
 * An abstract class that defines a few useful functions for all algorithms in
 * general.
 */
export abstract class Algorithm {
  //Variables
  /**
   * A string holding the name of the algorithm.
   */
  private name:string = "";
  /**
   * A boolean holding the status of whether the algorithm is complete or not.
   */
  private complete:boolean = false;
  //Constructor
  /**
   * Constructs an algorithm with the given name.
   * Runtime: O(c) ---> Runs in constant time.
   */
  constructor(n:string){ this.name = n;}
  //Accessor Methods
  /**
   * isComplete returns whether or not the algorithm has completed its
   * calculations or not.
   * Runtime: O(c) ---> Runs in constant time.
   */
  isComplete(){ return this.complete; }
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
  reportCompletion(){ this.complete = true; }
}
