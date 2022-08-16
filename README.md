# stopwatch-ics

[demo](https://gateway.pinata.cloud/ipfs/QmbtWYQmt6LSq2TxcpFwrAFXivfHZbxmHd7C1TceGTJuQf/)

## FIXME

- [x] The splitList render must be empty before starting.\
      ~~- [ ] The splitTimer resets when pausing.~~
- [ ] Make splitList into a table
- [ ] Data disappears when removing the last element in the splitList.

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
- [ ] really need refactoring


## Tools
- adamgibbons/ics
- eligrey/FileSaver.js
