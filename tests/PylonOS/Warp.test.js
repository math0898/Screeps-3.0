import * as _ from "lodash";
import { Warp } from "../../src/PylonOS/Warp";


let time = _.random(100);
let weight = _.random(100);
let name = "Name " + time + " - " + weight;
let w = new Warp(name, weight, time);


test("Name accessor method should work. " + name, () =>{
    expect(w.getName()).toBe(name);
});
test("Weight accessor method should work. " + weight, () =>{
    expect(w.getWeight()).toBe(weight);
});
test("Scheduled accessor method should work. " + time, () =>{
    expect(w.getScheduled()).toBe(time);
});
test("Process should report that it is complete.", () =>{
    expect(w.run()).toBe(true);
});
