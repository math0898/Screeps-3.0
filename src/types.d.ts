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

interface Memory {
  [x: string]: any;
  stats: any;
  uuid: number;
  log: any;
}

interface IDictionary { [index: string]: number; }
interface RoomMemory {
  counts:IDictionary;
}
