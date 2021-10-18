/**
 * This interface describes the memory being stored on individual creeps and
 * their typings.
 */
interface CreepMemory {
  sources?:string;
  emptyStructure?:string;
  droppedResource?:string;
  building?:string;
  pathTarget?:RoomPosition;
  path?:PathStep[];
  pathStep?:number;
  target?:string;
  working?:boolean;
  build?:boolean;
  repair?:string;
  role?: string;
  reinforce?:string;
  room: string;
  goal?: string;
  mineral?: string;
  tombstone?:string;
}
/**
 * For the next two memory sections I need an array indexed by strings and this
 * is what defines that for me.
 */
interface IDictionary { [index: string]: number; }
/**
 * The general memory being used. This includes mainly things like runtime stats
 * and creep memory management.
 */
interface Memory {
  /**
   * The number of ticks data has been collected on.
   */
  dataCollected: number;
  /**
   * The average cpu usage of all tasks.
   */
  cpuAverage: number;
  /**
   * The peak cpu usage of all ticks.
   */
  cpuPeak: number;
  /**
   * The first tick which had data collected on.
   */
  startTick: number;
  /**
   * The last tick creep memory was cleaned.
   */
  lastCreepClean: number;
  /**
   * Are stats initalized yet or not?
   */
  statsInit: boolean;
  /**
   * An array indexed by strings which describes the cpu cost of each task on
   * every tick.
   */
  taskCpu: IDictionary;
  /**
   * An array indxed by strings which counts the number of times each task has
   * been run.
   */
  taskCount: IDictionary;
}

interface RoomMemory {
  counts:IDictionary;
  energyStatus?:number;
}
