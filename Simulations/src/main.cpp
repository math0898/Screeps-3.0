#include <iostream>
#include "mining.hpp"

using namespace std;

int main () {
    cout << "Enter the simulation to run." << endl;
    cout << "- mining" << endl;
    cout << endl << "> ";
    string input;
    cin >> input;
    if (input == "mining") simulateMining();
    return 0;
}
