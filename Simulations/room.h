/**
 * @file room.h
 * @author Sugaku (sugaku@protonmail.com)
 * @brief Defines the prototypes for the room class.
 * @version 0.1
 * @date 2022-03-06
 * 
 * @copyright Copyright (c) 2022
 */
#pragma once
#include "structures.h"

using namespace structures;

class Room {

    private:
    
        /**
         * The source of this room. TODO: Consider adding more sources.
         */
        Source* source;

    public:

        /**
         * Creates a new Room object.
         */
        Room ();

        /**
         * Accessor method for the source of this room.
         * 
         * @return The source present in this room.
         */
        Source* getSource () {
            return source;
        }

        /**
         * Handles all of the tick logic for this room.
         */
        void tick ();
};
