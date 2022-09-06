/**
 * A job is a task that can be taken on by a creep.
 * 
 * @author Sugaku
 */
export class Job {

    /**
     * Creates a new job with the given status, type, and target.
     * 
     * @param {string} type     What type of job this is. (upgrade, fill, build, repair) 
     * @param {string} target   The target of this job.
     * @param {number} progress The amount of energy out of the total energy required for the job.
     * @param {number} total    The total amount of needed energy.
     */
    constructor (type, target, progress, total) {
        this.type = type;
        this.target = target;
        this.progress = progress;
        this.total = total;
    }
}
