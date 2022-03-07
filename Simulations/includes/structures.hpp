/**
 * @file structures.h
 * @author Sugaku (sugaku@protonmail.com)
 * @brief Contains classes to simulate the game of screeps.
 * @version 0.1
 * @date 2022-03-06
 * 
 * @copyright Copyright (c) 2022
 */
#pragma once

namespace structures {

    /**
     * The source class simulates how a source operates in screeps.
     */
    class Source {
        
        private:
        
            /**
             * The current energy of the source. 
             */
            int energy;

            /**
             * The max capacity of the source.
             */
            int energyCapacity;

            /**
             * The amount of time until this source regenerates.
             */
            int ticks;

        public:

            /**
             * Creates a new source.
             */
            Source ();

            /**
             * Regenerates this source.
             */
            void regen ();

            /**
             * Simulates mining of this structure.
             * 
             * @param parts The number of work parts on the creep mining this source.
             * @return The amount of energy mined from this source.
             */
            int mine (int parts);

            /**
             * Performs tick logic for this source.
             */
            void tick ();
    };
};
