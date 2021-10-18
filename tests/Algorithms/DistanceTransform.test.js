import { DistanceTransform } from "../../src/Algorithms/DistanceTransform";

// Test cases with expected values.
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

var crazyWall = new Array (new Array(0, 0, 0, 0, 0, 0, 0, 0),
                           new Array(0, 0, 1, 1, 1, 0, 1, 0),
                           new Array(0, 1, 1, 1, 1, 0, 0, 0),
                           new Array(0, 1, 1, 1, 1, 1, 1, 0),
                           new Array(0, 1, 1, 0, 1, 1, 1, 0),
                           new Array(0, 1, 1, 1, 1, 1, 1, 0),
                           new Array(0, 1, 1, 1, 1, 1, 1, 0),
                           new Array(1, 0, 0, 0, 0, 0, 1, 0));

var crazyWallExpected = new Array (new Array(0, 0, 0, 0, 0, 0, 0, 0),
                                   new Array(0, 0, 1, 1, 1, 0, 1, 0),
                                   new Array(0, 1, 1, 2, 1, 0, 0, 0),
                                   new Array(0, 1, 1, 1, 1, 1, 1, 0),
                                   new Array(0, 1, 1, 0, 1, 2, 1, 0),
                                   new Array(0, 1, 1, 1, 1, 2, 1, 0),
                                   new Array(0, 1, 1, 1, 1, 1, 1, 0),
                                   new Array(1, 0, 0, 0, 0, 0, 1, 0));

// Running test cases.

let distanceTransformIterativeFullWalls = new DistanceTransform(fullWalls, 0);
test("Distance transform with the iterative approach on all walls.", () => {
    while (!distanceTransformIterativeFullWalls.isFinished()) distanceTransformIterativeFullWalls.manager();
    expect(distanceTransformIterativeFullWalls.getResult()).toEqual(fullWalls);
});

let distanceTransformComputeFullWalls = new DistanceTransform(fullWalls, 1);
test("Distance transform with the compute approach on all walls.", () => {
    while (!distanceTransformComputeFullWalls.isFinished()) distanceTransformComputeFullWalls.manager();
    expect(distanceTransformComputeFullWalls.getResult()).toEqual(fullWalls);
});

let distanceTransformIterativeCircleWalls = new DistanceTransform(wallCircle, 0);
test("Distance transform with the iterative approach on circle walls.", () => {
    while (!distanceTransformIterativeCircleWalls.isFinished()) distanceTransformIterativeCircleWalls.manager();
    expect(distanceTransformIterativeCircleWalls.getResult()).toEqual(wallCircleExpected);
});

let distanceTransformComputeCircleWalls = new DistanceTransform(wallCircle, 1);
test("Distance transform with the compute approach on circle walls.", () => {
    while (!distanceTransformComputeCircleWalls.isFinished()) distanceTransformComputeCircleWalls.manager();
    expect(distanceTransformComputeCircleWalls.getResult()).toEqual(wallCircleExpected);
});

let distanceTransformIterativeCrazyWalls = new DistanceTransform(crazyWall, 0);
test("Distance transform with the iterative approach on crazy walls.", () => {
    while (!distanceTransformIterativeCrazyWalls.isFinished()) distanceTransformIterativeCrazyWalls.manager();
    expect(distanceTransformIterativeCrazyWalls.getResult()).toEqual(crazyWallExpected);
});

let distanceTransformComputeCrazyWalls = new DistanceTransform(crazyWall, 1);
test("Distance transform with the compute approach on crazy walls.", () => {
    while (!distanceTransformComputeCrazyWalls.isFinished()) distanceTransformComputeCrazyWalls.manager();
    expect(distanceTransformComputeCrazyWalls.getResult()).toEqual(crazyWallExpected);
});
