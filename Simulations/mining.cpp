/**
 * @file mining.cpp
 * @author Sugaku (sugaku@protonmail.com)
 * @brief Contains all the classes and functions related to running mining simulation tests. Used to determine what the most
 * efficient combination of body parts is for mining at various spawn distances with different energy budgets.
 * @version 0.1
 * @date 2022-03-06
 * 
 * @copyright Copyright (c) 2022
 */
#include <iostream>
#include "room.h"
#include "creep.h"

using namespace creeps;
using namespace std;

class MiningSimulation {

    private:

        /**
         * Pointer to the room being used by this simulation.
         */
        Room* room;

        /**
         * Pointer to the creep being used by this simulation.
         */
        Creep* creep;

        /**
         * The amount of energy mined by the creep.
         */
        int mined{ 0 };

        /**
         * The remaining distance between the creep and source.
         */
        int distance;

    public:

        /**
         * Creates a new MiningSimulation with the given starting distance and creep.
         * 
         * @param distance The distance between the creep and the source.
         * @param creep    The creep that will be mining in this simulation.
         */
        MiningSimulation (int distance, Creep* creep) : creep(creep), distance(distance) {
            room = new Room();
            creep->setRoom(room);
        };

        /**
         * Runs this mining simulation.
         */
        void run () {
            while (creep->isAlive()) {
                room->tick();
                creep->tick();
                if (distance > 0) {
                    if (creep->move() == 0) distance--;
                } else mined += creep->mine(room->getSource());
            }
        }

        /**
         * Prints the results of this simulation to cout.
         */
        void print () {
            cout << " ---- Creep Mine Simulation ----" << endl << endl;
            cout << "Distance: " << distance << endl;
            cout << "Creep Cost: " << creep->energyCost() << endl;
            cout << "Energy Mined: " << mined << endl;
            cout << "Net: " << mined - creep->energyCost() << endl;
            cout << "Efficiency: " << ((float) mined) / ((float) (mined - creep->energyCost())) << endl;
        }
};

/**
 * Runs the mining simulation.
 */
void simulateMining () {
    int* b = new int[5];
    b[0] = WORK;
    b[1] = WORK;
    b[2] = MOVE;
    b[3] = MOVE;
    b[4] = WORK;
    Creep* c = new Creep(nullptr, b, 5);
    MiningSimulation* sim = new MiningSimulation(10, c);
    sim->run();
    sim->print();
}
