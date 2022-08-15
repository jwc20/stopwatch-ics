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

export const makeEvent = (splitItem) => {
  let time = splitItem.timestamp;
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let day = time.getDate();
  let hour = time.getHours();
  let minute = time.getMinutes();
  let startDate = [year, month, day, hour, minute];
  let splitInterval = new Date(splitItem.interval);
  let intervalHour = splitInterval.getUTCHours();
  let intervalMinute = splitInterval.getUTCMinutes();
  let label = splitItem.label

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

export const makeIcs = (eventsIcs) => {
  let FileSaver = require("file-saver");
  let blob = new Blob([eventsIcs], {
    type: "text/calendar;charset=utf-8;",
  });
  FileSaver.saveAs(blob, "test.ics");
};
