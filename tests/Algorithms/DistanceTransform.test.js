import { DistanceTransform } from "../../Algorithms/DistanceTransform";

// Test cases.
var fullWalls = new Array (new Array(0, 0, 0, 0, 0, 0, 0, 0),
                           new Array(0, 0, 0, 0, 0, 0, 0, 0),
                           new Array(0, 0, 0, 0, 0, 0, 0, 0),
                           new Array(0, 0, 0, 0, 0, 0, 0, 0),
                           new Array(0, 0, 0, 0, 0, 0, 0, 0),
                           new Array(0, 0, 0, 0, 0, 0, 0, 0),
                           new Array(0, 0, 0, 0, 0, 0, 0, 0),
                           new Array(0, 0, 0, 0, 0, 0, 0, 0));

var wallCircle = new Array (new Array(0, 0, 0, 0, 0, 0, 0, 0),
                            new Array(0, 1, 1, 1, 1, 1, 1, 0),
                            new Array(0, 1, 1, 1, 1, 1, 1, 0),
                            new Array(0, 1, 1, 1, 1, 1, 1, 0),
                            new Array(0, 1, 1, 1, 1, 1, 1, 0),
                            new Array(0, 1, 1, 1, 1, 1, 1, 0),
                            new Array(0, 1, 1, 1, 1, 1, 1, 0),
                            new Array(0, 0, 0, 0, 0, 0, 0, 0));

var wallCircleExpected = new Array (new Array(0, 0, 0, 0, 0, 0, 0, 0),
                                    new Array(0, 1, 1, 1, 1, 1, 1, 0),
                                    new Array(0, 1, 2, 2, 2, 2, 1, 0),
                                    new Array(0, 1, 2, 3, 3, 2, 1, 0),
                                    new Array(0, 1, 2, 3, 3, 2, 1, 0),
                                    new Array(0, 1, 2, 2, 2, 2, 1, 0),
                                    new Array(0, 1, 1, 1, 1, 1, 1, 0),
                                    new Array(0, 0, 0, 0, 0, 0, 0, 0));

// Running test cases.

let distanceTransformIterativeFullWalls = new DistanceTransform(fullWalls, 0);
test("Distance transform with the iterative approach on all walls.", () => {
    while (!distanceTransformIterativeFullWalls.isFinished()) distanceTransformIterativeFullWalls.manager();
    expect(distanceTransformIterativeFullWalls.getResult()).toEqual(fullWalls);
});

// let distanceTransformComputeFullWalls = new DistanceTransform(fullWalls, 1);
// test("Distance transform with the compute approach on all walls.", () => {
//     while (!dt.isFinished()) dt.manager();
//     expect(dt.getResult()).toBe(fullWalls);
// });

let distanceTransformIterativeCircleWalls = new DistanceTransform(wallCircle, 0);
test("Distance transform with the iterative approach on circle walls.", () => {
    while (!distanceTransformIterativeCircleWalls.isFinished()) distanceTransformIterativeCircleWalls.manager();
    expect(distanceTransformIterativeCircleWalls.getResult()).toEqual(wallCircleExpected);
});

// let distanceTransformComputeCircleWalls = new DistanceTransform(wallCircle, 1);
// test("Distance transform with the compute approach on circle walls.", () => {
//     while (!distanceTransformComputeCircleWalls.isFinished()) distanceTransformComputeCircleWalls.manager();
//     expect(distanceTransformComputeCircleWalls.getResult()).toBe(wallCircleExpected);
// });