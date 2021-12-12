import { Warp } from "Warp.js"
import { Oracle } from "./Oracle";
import { Archive } from "./Archive";
import { WarpRegistry } from "./WarpRegistry";

/**
 * The kernel to the grand PylonOS. The kernel offers api calls to interact with the OS, such as adding, remove, and running.
 * 
 * @author Sugaku
 */
export class Mothership {

    /**
     * The oracle is used to prioritize operations.
     */
    #oracle = new Oracle();

    /**
     * The archive is used for logging processes and errors.
     */
    #archive = new Archive();

    /**
     * The registry of processes that need to occur.
     */
    #warpRegistry = new WarpRegistry();

    /**
     * Creates a new Mothership object.
     */
    Mothership () {

    }
}
