# Description (Out Dated)

This is my second attempt at making a fully automatic screeps bot. This one runs
on typescript mainly however it can easily be imported into your own server
using the two javascript files under dist/.

## PylonOS

PylonOS is our approach to the common operating system challenge proposed by
screeps. It has processes (warps), a scheduler (oracle), kernel (mothership),
process registry, process table, threads (warp components), and a logger (Pylon
Archive). The implementation is about what you'd expect from the parts but more
details about each part follows.

### Warps (Processes)

Warps are very rudimentary in structure. They simply have information about their
name, the tick that they were registered, and the initial weight they were given.
All of those properties are read by other parts of the operating system to make
management easier. Beyond the basic data warps just have a run action which
reports back true if the process completed and false if it still needs to run next
tick.

## Colonies (Out Dated)

Colonies are the highest level of types in my program. They call their own
roomPlanner and SpawnManagers to handle everything they need. Most actions which
are pushed to the Operating System automatically are Colony level actions. The
colony then makes requests as to what it would like to have run.

## Room Planner (Out Dated)

Each room has a dedicated planner which determines where roads should be placed
along with a general bunker stamp hard coded. The Room Planner uses a number of
algorithms to determine what can and cannot be built in the room as well as
checks for effective fortifications and the building of defenses.

### Algorithms (Out Dated)

The following algorithms all have an iterative approach implemented in the code
but may not be actively used. The idea behind using an iterative approach is
that it can be called over multiple ticks without maxing out the cpu and saves a
lot of computation instead of calculating each cell individually.

#### Distance Transform (Out Dated)

The distance transform algorithm checks how far away each cell is from the
nearest wall. My implementation uses a version of euclidean distance.

[Screeps Plus](https://wiki.screepspl.us/index.php/Automatic_base_building#Distance-Transform)

[Wikipedia](https://en.wikipedia.org/wiki/Distance_transform)

#### Flood Fill (Out Dated)

My code will likely not have much a reason to utilize flood fill as it can be kind
of expensive. Nonetheless I have an optimized implementation that can be viewed
by a player using room visuals and controlled with flags.

[Screeps Plus](https://wiki.screepspl.us/index.php/Automatic_base_building#Flood_Fill)

[Wikipedia](https://en.wikipedia.org/wiki/Flood_fill)

## Market Manipulator (Out Dated)

This is the mastermind behind the exploitation of the Screeps market. Right now
the system is fairly basic since its kind of hard to test market code in a
private server. In the future you can expect some real shenanigans going on
here.

### Market Sell (Out Dated)

Sells all of the resource until it runs out of energy to pay fees or runs out of
the resource regardless of cost. Still needs some tweaking to be considered
fully functional.
