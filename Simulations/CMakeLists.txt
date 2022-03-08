cmake_minimum_required(VERSION 3.22.3)

project(screeps-simulations)

set(EXEC screeps-simulations)

set(CMAKE_CXX_STANDARD 14)

add_subdirectory(src/framework)
add_subdirectory(src/simulations)

include_directories(includes)

file(GLOB SOURCES src/main.cpp)

add_executable(${EXEC} ${SOURCES})
