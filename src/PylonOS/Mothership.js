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

    /**
     * Accessor method for the oracle of the mothership.
     * 
     * @return The oracle used by this mothership.
     */
    getOracle () {
        return this.#oracle;
    }

    /**
     * Accessor method for the archive of this mothership.
     * 
     * @return The archive used by this mothership.
     */
    getArchive () {
        return this.#archive;
    }

    /**
     * Accessor method for the warp registry attached to this mothership.
     * 
     * @return The warp registry used by this mothership.
     */
    getWarpRegistry () {
        return this.#warpRegistry;
    }

    /**
     * The main loop of the Mothership. Called every tick to handle the logic of managing the operating system.
     */
    loop () {
        for (w in this.#warpRegistry.getWarps()) w.run();
        this.#warpRegistry.clear();
    }

    /**
     * Adds the given warp to the warp registry.
     * 
     * @param {Warp} warp The warp to add to the warp registry.
     */
    addWarp (warp) {
        this.#warpRegistry.addWarp(warp);
    }
}
