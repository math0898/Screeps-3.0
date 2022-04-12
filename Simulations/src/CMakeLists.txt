cmake_minimum_required(VERSION 3.22.3)

project(screeps-simulations_exe)

add_subdirectory(framework)
add_subdirectory(simulations)

set(screeps-simulations_source_files main.cpp)

target_link_libraries(screeps-simulations_exe Simulations)
