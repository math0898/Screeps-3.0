/**
 * @file mining.h
 * @author Sugaku (sugaku@protonmail.com)
 * @brief Prototypes the functions in mining.cpp which are used to simulate mining.
 * @version 0.1
 * @date 2022-03-06
 * 
 * @copyright Copyright (c) 2022
 */
#pragma once

/**
 * Simulates mining creeps and their relative efficiency.
 * 
 * @param energy   The amount of energy that can be spent on any one creep.
 * @param distance The distance between the spawn and the source.
 */
void simulateMining (int energy, int distance);
