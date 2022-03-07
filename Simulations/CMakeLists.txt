cmake_minimum_required(VERSION 3.22.3)

project(screeps-simulations)

set(EXEC screeps-simulations)

set(CMAKE_CXX_STANDARD 14)

include_directories(includes)

file(GLOB SOURCES src/*.cpp)

add_executable(${EXEC} ${SOURCES})