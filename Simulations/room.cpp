/**
 * @file room.cpp
 * @author Sugaku (sugaku@protonmail.com)
 * @brief Implements the room class.
 * @version 0.1
 * @date 2022-03-06
 * 
 * @copyright Copyright (c) 2022
 */
#include "structures.h"
#include "room.h"

using namespace structures;

/**
 * Creates a new Room object.
 */
Room::Room () {
    source = new Source();
}

/**
 * Handles all of the tick logic for this room.
 */
void Room::tick () {
    source->tick();
}
