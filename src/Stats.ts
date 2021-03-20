/**
 * This file handles the definitions for the statsmamanger class. The stats class
 * handles tracking, logging, and printing of script preformence.
 */
export class StatsManager {
  //Constructor
 /**
  * Runs setup for the StatsManager so it can run without issue.
  * Runtime: O(c) ---> Runs in constant time.
  */
  constructor(){
    //Initalize if we haven't
    if(StatsManager.getInitStatus() == false) StatsManager.init();
  }

  //Accessor methods
  static getInitStatus(){
    //Check the memory locations that need to be set if any are undefined we need to init
    //Check if we think we're initalized
    if (Memory.statsInit != true) return false;
    //Check the count of the amount of cpu used
    else if (Memory.cpuCount == undefined) return false;
    //Check the running average of cpu
    else if (Memory.cpuAverage == undefined) return false;
    //We must be all good then
    else return true;
  }

  //Real methods
 /**
  * This function initalizes the memory to take in stats.
  */
  static init(){
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
  }
 /**
  * Prints the stats collected, these are stored in Memory.stats.
  * Runtime: O(c) ---> Runs in constant time.
  */
  static print(){
    //Print a nice header
    console.log("---- Preformence Report ----");
    //The tick we begun collecting data on
    console.log("Tick Started on: " + Memory.startTick);
    //The tick we're on
    console.log("Tick Ended on: " + Game.time);
    //Data capture rate
    console.log("Data Captured on: " + (Memory.dataCollected-1) + " / " + (Game.time - Memory.startTick) + " for a rate of " + Math.fround((Memory.dataCollected-1)/(Game.time - Memory.startTick) * 100) + "%");
    //Print the average cpu used
    console.log("Average CPU Usage: " + Memory.cpuAverage);
    //Print the peak cpu used
    console.log("Peak CPU Usage: " + Memory.cpuPeak);
  }
 /**
  * Collects all the stats for cpu this tick.
  * Runtime: O(c) ---> Runs in constant time.
  */
  static collectCpu(){
    //Temp
    var cpuUsed:number = Game.cpu.getUsed();
    //Read memory
    var count:number = Memory.dataCollected;
    var average:number = Memory.cpuAverage;
    var peak:number = Memory.cpuPeak;
    //Do the maths for the new average
    var newAverage:number = ((average*count) + cpuUsed)/(count+1);
    //Set the new peak if current tick is higher
    if(peak < cpuUsed) Memory.cpuPeak = cpuUsed;
    //Write to memory and increment our count
    Memory.cpuAverage = newAverage;
  }
 /**
  * Collects the stats for the StatsManager.
  */
  static collectStats(){
    //Collect Cpu data.
    this.collectCpu();
    //Increment the fact we collected data
    Memory.dataCollected++;
  }
}
