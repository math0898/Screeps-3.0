/**
 * @file harvesting.hpp
 * @author Sugaku (sugaku@protonmail.com)
 * @brief Function declarations for harvesting simulations.
 * @version 0.1
 * @date 2022-03-07
 * 
 * @copyright Copyright (c) 2022
 */

/**
 * Simulates a harvester mining until they reach max capacity 
 * and then carring it to spawn. Reports on total energy gained
 * and overall efficiency at various distances and creep sizes.
 * 
 * @param energy   The amount of energy that can be spent on any one creep.
 * @param distance The distance between the spawn and the source.
 */
void simulateHarvesting (int energy, int distance);
