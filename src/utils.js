// import { saveAs } from "file-saver";
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

export const formatTimeHour = (mSec) => {
    let timeElapsed = new Date(mSec);
    let hour = timeElapsed.getUTCHours();
    return hour;
};

export const formatTimeMinute = (mSec) => {
    let timeElapsed = new Date(mSec);
    let min = timeElapsed.getUTCMinutes();
    console.log(min);
    if (min < 1) min = 1;
    return min;
};

// Date object to [year, month, day, hour, minute]
export const dateToArray = (date) => {
    let time = new Date(Date.parse(date));
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let day = time.getDate();
    let hour = time.getHours();
    let minute = time.getMinutes();
    let dateArray = [year, month, day, hour, minute];
    // console.log(dateArray);
    return dateArray;
};

export const makeEvent = (splitItem, prevSplitItem) => {
    // variables for start
    const startDate = dateToArray(splitItem.timestamp);

    // variable for title
    let label = splitItem.label;

    // variables for duration
    // const intervalDuration = splitItem.interval;
    const intervalDuration = prevSplitItem.interval;
    let intervalDurationHours = formatTimeHour(intervalDuration);
    let intervalDurationMinutes = formatTimeMinute(intervalDuration);

    const timestampDifference =
        Date.parse(splitItem.timestamp) - Date.parse(prevSplitItem.timestamp);
    let timestampDifferenceHours = formatTimeHour(timestampDifference);
    let timestampDifferenceMinutes = formatTimeMinute(timestampDifference);

    // console.log(
    //     splitItem.label,
    //     intervalDuration,
    //     timestampDifference,
    //     timestampDifferenceHours,
    //     timestampDifferenceMinutes
    // );

    // If splitItem.interval < timestampDifference, then duration = splitItem.interval
    // If splitItem.interval >= timestampDifference, then duration = timestampDifference
    // if (intervalDuration < timestampDifference) {
    //     const event = {
    //         start: startDate,
    //         duration: {
    //             hours: timestampDifferenceHours,
    //             minutes: timestampDifferenceMinutes,
    //         },
    //         title: label,
    //     };
    //     console.log("timestmapd", event);
    //     return event;
    // } else if (intervalDuration > timestampDifference) {
    //     const event = {
    //         start: startDate,
    //         duration: {
    //             hours: intervalDurationHours,
    //             minutes: intervalDurationMinutes,
    //         },
    //         title: label,
    //     };
    //     console.log("intervalD", event);
    //     return event;
    // }

    const event = {
        start: startDate,
        duration: {
            hours: timestampDifferenceHours,
            minutes: timestampDifferenceMinutes,
        },
        title: label,
    };

    // console.log("timestmapd", event);
    return event;
    // return event;
};

export const makeEvents = (events) => {
    const { error, value } = ics.createEvents(events);
    if (error) {
        console.log(error);
        return;
    }
    // console.log(value);
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
