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
#include "room.hpp"
#include "creep.hpp"

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

        /**
         * The starting distance between the creep and source.
         */
        int startingDistance;

    public:

        /**
         * Creates a new MiningSimulation with the given starting distance and creep.
         * 
         * @param distance The distance between the creep and the source.
         * @param creep    The creep that will be mining in this simulation.
         */
        MiningSimulation (int distance, Creep* creep) : distance(distance), creep(creep) {
            startingDistance = distance;
            room = new Room();
            creep->setRoom(room);
        };

        /**
         * Returns the net gain in energy as a result of this mining creep.
         * 
         * @return The net gain in energy from this creep mining.
         */
        int getNet () {
            return mined - creep->energyCost();
        }

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
            cout << "Starting Distance: " << startingDistance << endl;
            cout << "Creep Cost: " << creep->energyCost() << endl;
            cout << "Creep Body: " << creep->niceBody() << endl;
            cout << "Energy Mined: " << mined << endl;
            cout << "Net: " << getNet() << endl;
            cout << "Efficiency: " << ((float) (mined - creep->energyCost())) / ((float) mined) << endl;
        }
};

/**
 * Simulates mining creeps and their relative efficiency.
 * 
 * @param energy   The amount of energy that can be spent on any one creep.
 * @param distance The distance between the spawn and the source.
 */
void simulateMining (int energy, int distance) {
    int simulations = 0;
    int max_size = energy / 50;
    int* b = new int[max_size];
    for (int current_size = 1; current_size <= max_size; current_size++) {
        for (int i = 0; i < max_size; i++) b[i] = MOVE;
        for (int j = -1; j < current_size; j++) {
            if (j >= 0) b[j] = WORK;
            Creep* c = new Creep(nullptr, b, current_size);
            if (c->energyCost() > energy) continue;
            MiningSimulation* sim = new MiningSimulation(distance, c);
            simulations++;
            sim->run();
            if (sim->getNet() > 0) sim->print();
            delete(c);
            delete(sim);
        }
    }
    delete(b);
    cout << endl << "Ran " << simulations << " simulations" << endl;
}
