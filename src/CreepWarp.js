import { Warp } from "./PylonOS/Warp";

/**
 * The creep warp handles all the logic relating to creep movement.
 * 
 * @author Sugaku
 */
export class CreepWarp extends Warp {

    /**
     * Overrides the run class on the warp so that creep logic can be run.
     */
    run () {
        console.log("Hello from creep warp!");
        return true;
    }
}
