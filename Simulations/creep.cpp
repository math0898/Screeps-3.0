/**
 * @file creep.cpp
 * @author Sugaku (sugaku@protonmail.com)
 * @brief Implementation of the creep classes.
 * @version 0.1
 * @date 2022-03-06
 * 
 * @copyright Copyright (c) 2022
 */
#include "structures.h"
#include "creep.h"

using namespace creeps;
using namespace structures;

/**
 * Runs the tick logic for this creep.
 */
void Creep::tick () {
    lifeSpan--;
    if (fatigue > 0) {
        fatigue -= countParts(MOVE) * 2;
        if (fatigue < 0) fatigue = 0;
    }
}

/**
 * Makes this creep mine the given source.
 * 
 * @param source The source to mine. 
 * @return The amount of energy that was mined.
 */
int Creep::mine (Source* source) {
    return source->mine(countParts(WORK));
}

/**
 * Attempts to move this creep. Returns 0 if successful.
 * 
 * @return 0 if the move was successful, otherwise -11.
 */
int Creep::move () {
    if (fatigue == 0) {
        fatigue = size - countParts(MOVE); // Road version where each body part only generates a single fatigue point.
        return 0;
    }
    return -11;
}
