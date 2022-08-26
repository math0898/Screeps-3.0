/**
 * @file creep.h
 * @author Sugaku (sugaku@protonmail.com)
 * @brief Contains the classes which represent creeps.
 * @version 0.1
 * @date 2022-03-06
 * 
 * @copyright Copyright (c) 2022
 */
#pragma once
#include <string>
#include "room.hpp"
#include "structures.hpp"
#include "color_codes.hpp"

#define MOVE 1
#define WORK 2
#define CARRY 3

namespace creeps {

    /**
     * The general creep class from which all others inherent.
     */
    class Creep { // TODO deconstructor

        private:

            /**
             * The room this creep belongs to.
             */
            Room* room;

            /**
             * The body of this creep.
             */
            int* body;

            /**
             * The size of this creep.
             */
            int size;

            /**
             * The amount of energy currently stored by this creep.
             */
            int energy{ 0 };

            /**
             * The amount of energy that can be stored by this creep.
             */
            int capacity;

            /**
             * The fatigue of this creep. Creeps can only move when this value is zero.
             */
            int fatigue{ 0 };

            /**
             * The number of ticks that this creep has to live.
             */
            int lifeSpan{ 1500 };

        public:

            /**
             * Creates a new creep in the given room, with the given body, of the given size.
             * 
             * @param room The room this creep is currently in.
             * @param body The body of this creep.
             * @param size The number of body parts this creep has.
             */
            Creep (Room* room, int* body, int size) : room(room), size(size) {
                this->body = new int[size];
                for (int i = 0; i < size; i++) this->body[i] = body[i];
                capacity = countParts(CARRY) * 50;
            };

            /**
             * Runs the tick logic for this creep.
             */
            void tick ();

            /**
             * Makes this creep mine the given source.
             * 
             * @param source The source to mine.
             * @return The amount of energy that was mined.
             */
            int mine (structures::Source* source);

            /**
             * Attempts to move this creep. Returns 0 if successful.
             * 
             * @return 0 if the move was successful, otherwise -11.
             */
            int move ();

            /**
             * Sets the room that this creep is currently in. Does not free old room!!!
             * 
             * @param r The new room that this creep is in.
             */
            inline void setRoom (Room* r) {
                room = r;
            }

            /**
             * Returns whether or not this creep is still alive.
             * 
             * @return True if this creep lives, otherwise false.
             */
            const inline bool isAlive () {
                return lifeSpan != 0;
            }

            /**
             * Returns the energy cost to produce this creep.
             * 
             * @return The total energy cost of this creep.
             */
            const inline int energyCost () {
                int count = 0;
                for (int i = 0; i < size; i++) {
                    switch (body[i]) {
                        case MOVE: count += 50; break;
                        case WORK: count += 100; break;
                        case CARRY: count += 50; break;
                    }
                }
                return count;
            }

            /**
             * Returns the body of this creep in a nice readable format.
             * 
             * @return The body of this creep in a human readable format.
             */
            const inline std::string niceBody () {
                std::string toReturn = "\033[90m[ ";
                for (int i = 0; i < size; i++) {
                    switch (body[i]) {
                        case MOVE: toReturn += "\033[97mMOVE "; break; // C_WHITE
                        case WORK: toReturn += "\033[33mWORK "; break; // C_GOLD
                        case CARRY: toReturn += "\033[0mCARRY "; break; //C_RESET
                    }
                }
                toReturn += "\033[90m]\033[0m";
                return toReturn;
            }

            /**
             * Returns the amount of energy that can be carried by this creep.
             * 
             * @return The energy capacity of this creep.
             */
            const inline int getCapacity () {
                return capacity;
            }

            /**
             * Returns the amount of energy that is currently being carried by this creep.
             * 
             * @return The energy being carried by this creep.
             */
            const inline int getEnergy () {
                return energy;
            }

            /**
             * Dumps all the energy of this creep reseting their carried amount to 0.
             */
            inline void dumpEnergy () {
                energy = 0;
            }

        private:

            /**
             * Counts the number of times the given body part appears in this creep.
             * 
             * @param type The type of the body part to count.
             * @return The number of times this body part is present.
             */
            const inline int countParts (int type) {
                int count = 0;
                for (int i = 0; i < size; i++) if (body[i] == type) count++;
                return count;
            }
    };
};
