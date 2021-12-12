import { Mothership } from "./PylonOS/Mothership";
import { DistanceTransform } from "./Algorithms/DistanceTransform";

let m = new Mothership();

module.exports.loop = function () {
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
