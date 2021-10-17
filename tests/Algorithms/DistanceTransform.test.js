// import DistanceTransform from "../../Algorithms/DistanceTransform.js";
import { DistanceTransform } from "../../Algorithms/DistanceTransform";

// Test the iterative version.
var data = new Array (new Array(0, 0, 0, 0, 0, 0, 0, 0), // No distances.
                      new Array(0, 0, 0, 0, 0, 0, 0, 0), 
                      new Array(0, 0, 0, 0, 0, 0, 0, 0), 
                      new Array(0, 0, 0, 0, 0, 0, 0, 0), 
                      new Array(0, 0, 0, 0, 0, 0, 0, 0),
                      new Array(0, 0, 0, 0, 0, 0, 0, 0), 
                      new Array(0, 0, 0, 0, 0, 0, 0, 0),  
                      new Array(0, 0, 0, 0, 0, 0, 0, 0));
let dt = new DistanceTransform(data, 0);
while (!dt.isFinished()) dt.manager();
test("Distance transform with the iterative approach on full wall.", () => {
    expect(dt.getResult()).toBe(data);
});