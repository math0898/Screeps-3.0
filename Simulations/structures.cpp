/**
 * @file structures.cpp
 * @author Sugaku (sugaku@protonmail.com)
 * @brief Contains classes to simulate the game of screeps.
 * @version 0.1
 * @date 2022-03-06
 * 
 * @copyright Copyright (c) 2022
 */
#include "structures.h"

using namespace structures;

/**
 * Creates a new source.
 */
Source::Source () {
    ticks = -1;
    energy = 3000;
    energyCapacity = 3000;
}

/**
 * Regenerates this source.
 */
void Source::regen () {
    ticks = -1;
    energy = energyCapacity;
}

/**
 * Simulates mining of this structure.
 * 
 * @param parts The number of work parts on the creep mining this source.
 * @return The amount of energy mined from this source.
 */
int Source::mine (int parts) {
    int gained = parts * 2;
    if (gained > energy) gained = energy;
    energy -= gained;
    return gained;
}

/**
 * Performs tick logic for this source.
 */
void Source::tick () {
    if (ticks == -1) {
        if (energy < energyCapacity) ticks = 300;
    }
    if (ticks == 0) regen();
    else ticks--;
}
