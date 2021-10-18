import { Mothership } from "./PylonOS/Mothership";
import { DistanceTransform } from "./Algorithms/DistanceTransform";

module.exports.loop = function () {
    let m = new Mothership();
    var wallCircle = new Array (new Array(0, 0, 0, 0, 0, 0, 0, 0),
                            new Array(0, 1, 1, 1, 1, 1, 1, 0),
                            new Array(0, 1, 1, 1, 1, 1, 1, 0),
                            new Array(0, 1, 1, 1, 1, 1, 1, 0),
                            new Array(0, 1, 1, 1, 1, 1, 1, 0),
                            new Array(0, 1, 1, 1, 1, 1, 1, 0),
                            new Array(0, 1, 1, 1, 1, 1, 1, 0),
                            new Array(0, 0, 0, 0, 0, 0, 0, 0));
    let dt = new DistanceTransform(wallCircle, 0);
    dt.manager();
    console.log(dt.getResult());
}