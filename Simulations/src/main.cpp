#include <iostream>
#include "mining.hpp"

using namespace std;

int main () {
    cout << "Enter the simulation to run." << endl;
    cout << "- mining" << endl;
    cout << endl << "> ";
    string input;
    int param1;
    int param2;
    cin >> input;
    cin >> param1;
    cin >> param2;
    if (input == "mining") simulateMining(param1, param2);
    return 0;
}
