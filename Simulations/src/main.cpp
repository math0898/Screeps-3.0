#include <iostream>
#include "mining.hpp"
#include "sugaku_colors.hpp"

using namespace std;

int main () {
    cout << "Enter the simulation to run." << endl;
    cout << C_GRAY << "-" << C_CYAN << " mining" << C_RESET << endl;
    cout << endl << C_GRAY << "> " << C_RESET;
    string input;
    int param1;
    int param2;
    cin >> input;
    cin >> param1;
    cin >> param2;
    if (input == "mining") simulateMining(param1, param2);
    return 0;
}
