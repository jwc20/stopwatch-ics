# stopwatch-ics

[demo](https://gateway.pinata.cloud/ipfs/QmbtWYQmt6LSq2TxcpFwrAFXivfHZbxmHd7C1TceGTJuQf/)

## FIXME

- [x] The splitList render must be empty before starting.\
       ~~- [ ] The splitTimer resets when pausing.~~
- [x] Data disappears when removing the last element in the splitList.
- [ ] Make splitList into a table
- [ ] Dont export start (first element) of the splitList(?)
- [ ] Events uses predecessor interval time as duration.

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

- [ ] implement caching
- [ ] add svg block visuals
- [ ] really need refactoring


## Note
- For all calendars (Google Calendar, Apple/Microsoft Calendar), each events that are less than or equal to 1 minute appear as 30 minute block.

## Tools

- adamgibbons/ics
- eligrey/FileSaver.js

## Inspo

- [NASA Optimis Viewer](https://imgur.com/a/7PdIuWE)
- [Planyway](https://planyway.com/help/features/time-tracking#two-views-calendar-and-list) has a very similar app.
- [Cal Newport's Time Block Planner](https://www.timeblockplanner.com/)
