# Description
This is my second attempt at making a fully automatic screeps bot. This one runs
on typescript mainly however it can easily be imported into your own server
using the two javascript files under dist/.

# Operating System
This approach to the problems that screeps provides uses a master operating
system which is very basic compared to some of my peer's solutions. My Operating
System runs on a main Queue on tasks which get added depending on the needs of 
each task. For example if the main loop of the creep manager determines that is
has been over a certain amount of time since the last time memory was cleaned it
can request it be added to the Queue. Otherwise items are added mostly in
main.ts.
