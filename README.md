# Description

This is my second attempt at making a fully automatic screeps bot. This one runs
on typescript mainly however it can easily be imported into your own server
using the two javascript files under dist/.

## Operating System

This approach to the problems that screeps provides uses a master operating
system which is very basic compared to some of my peer's solutions. My Operating
System runs on a main Queue on tasks which get added depending on the needs of
each task. For example if the main loop of the creep manager determines that is
has been over a certain amount of time since the last time memory was cleaned it
can request it be added to the Queue. Otherwise items are added mostly in
main.ts.

The queue runs with a strong consideration towards the current cpu usage of the
tick, but allows when under some generous thresholds to simply run all the
tasks in a given priority. Over certain thresholds low and medium priority tasks
wont run and cpu is checked before each task is run to make sure there is enough
space left to run the task without going over on CPU.

## Colonies

Colonies are the highest level of types in my program. They call their own
roomPlanner and SpawnManagers to handle everything they need. Most actions which
are pushed to the Operating System automatically are Colony level actions. The
colony then makes requests as to what it would like to have run.

## Room Planner

Each room has a dedicated planner which determines where roads should be placed
along with a general bunker stamp hard coded. The Room Planner uses a number of
algorithms to determine what can and cannot be built in the room as well as
checks for effective fortifications and the building of defenses.

### Algorithms

The following algorithms all have an iterative approach implemented in the code
but may not be actively used. The idea behind using an iterative approach is
that it can be called over multiple ticks without maxing out the cpu and saves a
lot of computation instead of calculating each cell individually.

#### Distance Transform

The distance transform algorithm checks how far away each cell is from the
nearest wall. My implementation uses a version of euclidean distance.

[Screeps Plus](https://wiki.screepspl.us/index.php/Automatic_base_building#Distance-Transform)

[Wikipedia](https://en.wikipedia.org/wiki/Distance_transform)

#### Flood Fill

My code will likely not have much a reason to utilize flood fill as it can be kind
of expensive. Nonetheless I have an optimized implementation that can be viewed
by a player using room visuals and controlled with flags.

[Screeps Plus](https://wiki.screepspl.us/index.php/Automatic_base_building#Flood_Fill)

[Wikipedia](https://en.wikipedia.org/wiki/Flood_fill)

## Market Manipulator

This is the mastermind behind the exploitation of the Screeps market. Right now
the system is fairly basic since its kind of hard to test market code in a
private server. In the future you can expect some real shenanigans going on
here.

### Market Sell

Sells all of the resource until it runs out of energy to pay fees or runs out of
the resource regardless of cost. Still needs some tweaking to be considered
fully functional.
