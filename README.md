# stopwatch-ics

[demo](https://gateway.pinata.cloud/ipfs/QmWe55w6ASYUwYSsSCiMKx3kPAm7GPq2tFzCGDyeLNnn2W/)

## FIXME

- [x] The splitList render must be empty before starting.\
       ~~The splitTimer resets when pausing.~~
- [x] Data disappears when removing the last element in the splitList.
- [ ] Make splitList into a table\
       ~~Dont export start (first element) of the splitList(?)~~
- [x] Events uses predecessor interval time as duration.
- [ ] want to continue counting timer and interval timer to reset to 0 when stopped or refreshed.
- [ ] Instead of adding the interval time to the timestamp to get event duration, let duration at some index i be equal to splitList[i+1].timestamp - splitList[i].timestamp for all i >= 0 and convert this readable format.
- [ ] When refreshing client, the input form resets.

## TODO

- [x] Render current time and date in the splitList render.
  - [x] format date in splitList
- [x] disable reset button when the timer is running.\
       ~~disable export button when the timer is running.~~
- [x] change currentDate to timestamp\
       ~~set columns: index | Label | Interval | Total | Time Record~~
- [x] delete button for time splits
- [x] Updating window title
- [x] Export to .ics file
- [x] Add edit button to edit description(for calendar events)
- [x] implement caching
- [ ] add svg block visuals (d3-timeline looks good)
- [ ] really need refactoring
- [ ] Make it mobile friendly with css.

## Note

- For all calendars (Google Calendar, Apple/Microsoft Calendar), each events that are less than 1 minute appear as 30 minute block.

## Tools

- adamgibbons/ics
- eligrey/FileSaver.js

## Inspo

- [NASA Optimis Viewer](https://imgur.com/a/7PdIuWE)
- [Planyway](https://planyway.com/help/features/time-tracking#two-views-calendar-and-list) has a very similar app.
- [Cal Newport's Time Block Planner](https://www.timeblockplanner.com/)
