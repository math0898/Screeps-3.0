/**
 * This file contains the implementation of tasks relating to the statsManager.
 * @Author Sugaku, math0898
 */
 //Import the tasks interface
 import { task, template } from "tasks/task";
 //Import the relevant structure
 import { StatsManager } from "Stats";
 /**
  * The collect_Stats task collects all the stats for the given tick.
  * Runtime: O(c) ---> Runs in constant time
  */
export class collect_Stats extends template implements task {
  //Variables
  //The name of the task
  name:string = "Collect Stats";

  //Constructors
  constructor(){super();}

  //Real methods
  run(){
    //Collect the stats... its really just that easy.
    StatsManager.collectStats();
  }
}
/**
 * The print_Stats task prints all the stats collected so far from the stats
 * managers and prints it into the console.
 * Runtime O(c) ---> Runs in constant time
 */
export class print_Stats extends template implements task {
  //Variables
  //The name of the task
  name:string = "Print Stats";

  //Constructors
  constructor(){super();}

  //Real methods
  run(){
    //Print the stats... also really just that easy.
    StatsManager.print();
  }
}
