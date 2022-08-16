# stopwatch-ics

[demo](https://gateway.pinata.cloud/ipfs/QmWe55w6ASYUwYSsSCiMKx3kPAm7GPq2tFzCGDyeLNnn2W/)

## FIXME

- [x] The splitList render must be empty before starting.\
       ~~- [ ] The splitTimer resets when pausing.~~
- [x] Data disappears when removing the last element in the splitList.
- [ ] Make splitList into a table
      ~~- [ ] Dont export start (first element) of the splitList(?)~~
- [x] Events uses predecessor interval time as duration.
- [ ] want to continue counting timer and interval timer to reset to 0 when stopped or refreshed.

## TODO

- [x] Render current time and date in the splitList render.
  - [x] format date in splitList
- [x] disable reset button when the timer is running.\
       ~~- [x] disable export button when the timer is running.~~
- [x] change currentDate to timestamp\
       ~~- [ ] set columns: index | Label | Interval | Total | Time Record~~
- [x] delete button for time splits
- [x] Updating window title
- [x] Export to .ics file
- [x] Add edit button to edit description(for calendar events)

- [/] implement caching

  - Need to store time and splitList
  - Maybe just the splitList and the time of the last element in the array.
  - Because of stringify, it's probably better to store timestamps as strings before caching.
  - Might be buggy

- [ ] add svg block visuals
- [ ] really need refactoring

## Note

- For all calendars (Google Calendar, Apple/Microsoft Calendar), each events that are less than 1 minute appear as 30 minute block.

## Tools

- adamgibbons/ics
- eligrey/FileSaver.js

## Inspo

- [NASA Optimis Viewer](https://imgur.com/a/7PdIuWE)
- [Planyway](https://planyway.com/help/features/time-tracking#two-views-calendar-and-list) has a very similar app.
- [Cal Newport's Time Block Planner](https://www.timeblockplanner.com/)
