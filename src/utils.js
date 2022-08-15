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

const makeEvent = () => {
  const event = {
    start: [2018, 5, 30, 6, 30],
    duration: { hours: 6, minutes: 30 },
    title: "",
    description: "",
    location: "",
    url: "",
    geo: {},
    categories: [],
    status: "CONFIRMED",
    busyStatus: "BUSY",
    organizer: {},
    attendees: [{}],
  };
  return event;
};

const makeEvents = (events) => {
  const { error, value } = ics.createEvents(events);
  if (error) {
    console.log(error);
    return;
  }
  // console.log(value);
  return value;
};


// let events = [
//   {
//     start: [2018, 5, 30, 6, 30],
//     duration: { hours: 6, minutes: 30 },
//     title: "",
//     description: "",
//     location: "",
//     url: "",
//     geo: {},
//     categories: [],
//     status: "CONFIRMED",
//     busyStatus: "BUSY",
//     organizer: {},
//     attendees: [{}],
//   },
//
//   {
//     start: [2019, 5, 30, 6, 30],
//     duration: { hours: 6, minutes: 30 },
//     title: "",
//     description: "",
//     location: "",
//     url: "",
//     geo: {},
//     categories: [],
//     status: "CONFIRMED",
//     busyStatus: "BUSY",
//     organizer: {},
//     attendees: [{}],
//   },
// ];
//
// makeEvents(events);
