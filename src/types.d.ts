// example declaration file - remove these and add your own custom typings

// memory extension samples
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
  room: string;
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

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
