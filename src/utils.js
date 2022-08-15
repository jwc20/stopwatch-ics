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

export const makeEvent = () => {

  let _summary = ""
  let location = ""
  let description = "" 
  let _start = {
    dateTime: "",
    timeZone: "",
  }
  let _end = {
    dateTime: "",
    timeZone: "",
  }
  
  // This follows the Google Calendar API format for events.
  let event = {
    summary: "Google I/O 2015",
    location: "800 Howard St., San Francisco, CA 94103",
    description: "A chance to hear more about Google's developer products.",
    start: {
      dateTime: "2015-05-28T09:00:00-07:00",
      timeZone: "America/Los_Angeles",
    },
    end: {
      dateTime: "2015-05-28T17:00:00-07:00",
      timeZone: "America/Los_Angeles",
    },
    reminders: {
      useDefault: false,
    },
  };

  return event;
};
