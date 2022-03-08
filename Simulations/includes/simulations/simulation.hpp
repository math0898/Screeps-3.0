/**
 * @file simulation.hpp
 * @author Sugaku (sugaku@protonmail.com)
 * @brief Prototypes the simulation class.
 * @version 0.1
 * @date 2022-03-07
 * 
 * @copyright Copyright (c) 2022
 */
#include "room.hpp"
#include "creep.hpp"

/**
 * The simulation class is mostly abstract and implemented by various specific simulations.
 */
class Simulation {

    private:

        /**
         * Pointer to the room being used by this simulation.
         */
        Room* room;

        /**
         * Pointer to the creep being used by this simulation.
         */
        creeps::Creep* creep;

        /**
         * The amount of energy resulting from the simulation.
         */
        int result{ 0 };

        /**
         * The remaining distance between the creep and a target.
         */
        int distance;

        /**
         * The starting distance between the creep and important target.
         */
        int startingDistance;

    public:

        /**
         * Creates a new Simulation with the given starting distance and creep.
         * 
         * @param distance The distance between the creep and the source.
         * @param creep    The creep that will be mining in this simulation.
         */
        Simulation (int distance, creeps::Creep* creep) : distance(distance), creep(creep) {
            startingDistance = distance;
            room = new Room();
            creep->setRoom(room);
        };

        /**
         * Returns the net gain in energy as a result of this mining creep.
         * 
         * @return The net gain in energy from this creep mining.
         */
        inline int getNet () {
            return result - creep->energyCost();
        }

        /**
         * Returns the float percentage (0 -> 1) of the efficiency of this simulation.
         * 
         * @return The float percentage which represents the efficiency.
         */
        inline float getEfficiency () {
            return ((float) (result - creep->energyCost())) / ((float) result);
        }

        /**
         * Runs this simulation.
         */
        virtual void run ();

        /**
         * Prints the results of this simulation to cout.
         */
        virtual void print ();
};
