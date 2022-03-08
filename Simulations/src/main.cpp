#include <iostream>
#include "simulations/mining.hpp"
#include "simulations/harvesting.hpp"
#include "framework/creep.hpp"
#include "framework/color_codes.hpp"

using namespace std;

int main () {
    cout << "Enter the simulation to run." << endl;
    cout << C_GRAY << "-" << C_CYAN << " mining     " << C_GREEN << "<energy> <dist>" << C_RESET << endl;
    cout << C_GRAY << "-" << C_CYAN << " harvesting " << C_GREEN << "<energy> <dist>" << C_RESET << endl;
    cout << endl << C_GRAY << "> " << C_RESET;
    string input;
    int param1;
    int param2;
    cin >> input;
    cin >> param1;
    cin >> param2;
    if (input == "mining") simulateMining(param1, param2);
    else if (input == "harvesting") simulateHarvesting(param1, param2);
    return 0;
}
