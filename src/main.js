import { Mothership } from "./PylonOS/Mothership";
import { DistanceTransform } from "./Algorithms/DistanceTransform";
import { CreepWarp } from "./CreepWarp";

let m = new Mothership();

module.exports.loop = function () {
    m.addWarp(new CreepWarp("Creep Logic", 1, Game.time()));
    m.loop();
}
