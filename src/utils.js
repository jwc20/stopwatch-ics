import { saveAs } from "file-saver";
const ics = require("ics");

export const formatTime = (mSec) => {
  let timeElapsed = new Date(mSec);
  let hour = timeElapsed.getUTCHours();
  let min = timeElapsed.getUTCMinutes();
  let sec = timeElapsed.getUTCSeconds();
  let ms = timeElapsed.getUTCMilliseconds();

  return (
    (hour > 9 ? hour : "0" + hour) +
    ":" +
    (min > 9 ? min : "0" + min) +
    ":" +
    (sec > 9 ? sec : "0" + sec) +
    "." +
    (ms > 99 ? ms : ms > 9 ? "0" + ms : "00" + ms)
  );
};

const formatTimeHour = (mSec) => {
  let timeElapsed = new Date(mSec);
  let hour = timeElapsed.getUTCHours();
  return hour;
};

const formatTimeMinute = (mSec) => {
  let timeElapsed = new Date(mSec);
  let min = timeElapsed.getUTCMinutes();
  if (min < 1) min = 1;
  return min;
};

// export const makeEvent = (splitItem) => {
//   // variables for start
//   let time = Date.parse(splitItem.timestampMachine);
//   console.log(time)
//   let year = time.getFullYear();
//   let month = time.getMonth() + 1;
//   let day = time.getDate();
//   let hour = time.getHours();
//   let minute = time.getMinutes();
//   let startDate = [year, month, day, hour, minute];

//   // variables for duration
//   let intervalHour = formatTimeHour(splitItem.interval);
//   let intervalMinute = formatTimeMinute(splitItem.interval);

//   // variable for title
//   let label = splitItem.label;

//   const event = {
//     start: startDate,
//     duration: {
//       hours: intervalHour,
//       minutes: intervalMinute,
//     },
//     title: label,
//   };
//   return event;
// };

export const makeEvent = (splitItem) => {
    // variables for start
    let time = new Date(Date.parse(splitItem.timestamp));
    console.log(time)
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let day = time.getDate();
    let hour = time.getHours();
    let minute = time.getMinutes();
    let startDate = [year, month, day, hour, minute];
  
    // variables for duration
    let intervalHour = formatTimeHour(splitItem.interval);
    let intervalMinute = formatTimeMinute(splitItem.interval);
  
    // variable for title
    let label = splitItem.label;
  
    const event = {
      start: startDate,
      duration: {
        hours: intervalHour,
        minutes: intervalMinute,
      },
      title: label,
    };
    return event;
  };

export const makeEvents = (events) => {
  const { error, value } = ics.createEvents(events);
  if (error) {
    console.log(error);
    return;
  }
  return value;
};

export const makeIcs = (eventsIcs, date) => {
  let filename = date.toString().split(" ", 4).join("_");
  let FileSaver = require("file-saver");
  let blob = new Blob([eventsIcs], {
    type: "text/calendar;charset=utf-8;",
  });
  FileSaver.saveAs(blob, filename + ".ics");
};
