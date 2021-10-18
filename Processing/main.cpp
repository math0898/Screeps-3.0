#include <iostream>
#include <string>
#include <fstream>

using namespace std;

int main () {
    cout << "Deleting previously proccessed code..." << endl;
    
    cout << "Running jest tests..." << endl;
    system("jest");

    cout << "Proccessing code..." << endl;

    cout << "Attempting to push code to screeps server using grunt..." << endl;
    system("grunt screeps");
    return 0;
}
