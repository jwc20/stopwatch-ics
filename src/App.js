import { useState, useEffect } from "react";
import {
    formatTime,
    makeEvent,
    makeEvents,
    makeIcs,
    dateToArray,
} from "./utils";
import "./App.css";
import ToggleDark from "./toggleDark";
import { ThemeContext, themes } from "./themeContext";

// const timestamp = new Date(Date.now()).toString().slice(0, 24);

let latestInterval = 0;

const initialSplitList = {
    label: "start",
    time: 0,
    interval: latestInterval,
    timestamp: new Date(Date.now()).toString().slice(0, 24),
};

function App() {
    const [total, setTotal] = useState(0);
    const [darkMode, setDarkMode] = useState(true);
    const [start, setStart] = useState(null);
    const [paused, setPaused] = useState(true);
    const [time, setTime] = useState(() => {
        const saved = localStorage.getItem("time");
        const initialValue = JSON.parse(saved);
        return initialValue || 0;
    });
    const [splitList, setSplitList] = useState(() => {
        const saved = localStorage.getItem("splitList");
        const initialValue = JSON.parse(saved);
        return initialValue || [initialSplitList];
    });

    useEffect(() => {
        localStorage.setItem("time", JSON.stringify(time));
        localStorage.setItem("splitList", JSON.stringify(splitList));
    }, [time, splitList]);

    useEffect(() => {
        if (!paused) {
            let timer = setInterval(() => {
                setTime(() => {
                    const delta = Date.now() - start;
                    return delta;
                });
            }, 4);
            return () => clearInterval(timer);
        }
    }, [paused, start]);

    useEffect(() => {
        if (time === 0) {
            document.title = "Stopwatch";
        } else {
            document.title =
                currentInterval() +
                "/" +
                formatTime(time).slice(0, -2) +
                formatTime(time).slice(-2);
        }
    });

    useEffect(() => {
        window.onbeforeunload = confirmExit;
        function confirmExit() {
            return "show warning";
        }
    }, []);

    const handleExportSubmit = (e) => {
        e.preventDefault();
        let eventList = [];
        if (splitList.length > 1) {
            // first event
            eventList.push({
                start: dateToArray(splitList[0].timestamp),
                duration: {
                    hours: 0,
                    minutes: 1,
                },
                title: splitList[0].label,
            });

            for (let i = 1; i < splitList.length; i++) {
                eventList.push(makeEvent(splitList[i], splitList[i - 1]));
            }

            const icsText = makeEvents(eventList);
            makeIcs(icsText, splitList[0].timestamp);
        }
    };

    const startTimer = () => {
        setStart(Date.now() - time);
        setPaused((p) => !p);
        if (!paused) splitTimer("pause");
    };

    const splitTimer = (splitLabel) => {
        const timestamp = new Date(Date.now()).toString().slice(0, 24);
        if (splitLabel === "pause") {
            setSplitList((split) => [
                ...split,
                {
                    label: "pause",
                    time,
                    interval: latestInterval,
                    timestamp: timestamp,
                },
            ]);
        } else {
            setSplitList((split) => [
                ...split,
                {
                    label: "split",
                    time,
                    interval: latestInterval,
                    timestamp: timestamp,
                },
            ]);
        }
    };

    const resetTimer = () => {
        setTime(0);
        setTotal(0);
        setPaused(true);
        // setSplitList([initialSplitList]);
        setSplitList([
            {
                label: "start",
                time: 0,
                interval: latestInterval,
                timestamp: new Date(Date.now()).toString().slice(0, 24),
            },
        ]);
    };

    const totalTimer = () => {
        const items = [...splitList];
        // console.log(items)
        let totalIntervalTime = 0;
        for (let i = 0; i < items.length; i++) {
            if (
                items[i].label !== "split" &&
                items[i].label !== "start" &&
                items[i].label !== "rest" &&
                items[i].label !== "pause"
            ) {
                totalIntervalTime += items[i].interval;
                // console.log(items[i].label)
            }

            // console.log(items[i].interval)
        }

        setTotal(totalIntervalTime);
        // console.log(totalIntervalTime)
    };

    const handleLabelChange = (index, e) => {
        const items = [...splitList];
        items[index][e.target.name] = e.target.value;
        setSplitList(items);
    };

    const handlePlaceholderChange = (index, label) => {
        if (index === 0) return "start";
        else if (label === "pause") return "pause";
        else if (label === "split") return "split";
        else return label;
    };

    const currentInterval = () => {
        const { length, [length - 2]: last2nd, [length - 1]: last } = splitList;
        if (reset) return "SPLIT TIME";
        if (!last) return formatTime(time);
        if (paused && last2nd !== undefined) {
            //   console.log(last2nd);
            return formatTime(last.time - last2nd.time);
        }
        return formatTime(time - last.time);
    };

    const handleRemoveSplit = (i, interval) => {
        const items = [...splitList];
        splitList[i - 1].interval += interval;
        items.splice(i, 1);
        setSplitList(items);
    };

    const reset = time === 0;

    return (
        <div className="App">
            <ThemeContext.Consumer>
                {({ changeTheme }) => (
                    <ToggleDark
                        toggleDark={() => {
                            setDarkMode(!darkMode);
                            changeTheme(darkMode ? themes.light : themes.dark);
                        }}
                    />
                )}
            </ThemeContext.Consumer>
            <div className="display">
                <div className="timer-display">
                    <span className="timer">
                        {formatTime(time).slice(0, -2)}
                    </span>
                    <span className="milliseconds">
                        {formatTime(time).slice(-2)}
                    </span>
                </div>
                <div className="split-timer-display">{currentInterval()}</div>
            </div>

            <div className="buttons">
                <button
                    className={paused ? "start" : "pause"}
                    onClick={startTimer}
                >
                    {!paused ? "Pause" : "Start"}
                </button>

                <button
                    className="split"
                    disabled={reset || paused}
                    onClick={splitTimer}
                >
                    Split
                </button>

                <button
                    className="reset"
                    disabled={reset || !paused}
                    onClick={resetTimer}
                >
                    Reset
                </button>
                <button
                    className="total"
                    onClick={totalTimer}
                >
                    Total
                </button>
            </div>
            {splitList.length > 0 && <hr />}
            <form onSubmit={handleExportSubmit}>
                {splitList.map((x, index) => {
                    const { time, label } = x;
                    const interval =
                        index > 0 ? time - splitList[index - 1].time : time;
                    const splitTimeStamp = splitList[index].timestamp;
                    latestInterval = interval;
                    return (
                        <div key={time}>
                            {splitList.length === 1 ? (
                                <div></div>
                            ) : (
                                <div className="split-item">
                                    <div>{index === 0 ? "" : index}</div>
                                    <input
                                        type="text"
                                        className="label-input"
                                        name="label"
                                        value={splitList.label}
                                        placeholder={handlePlaceholderChange(
                                            index,
                                            splitList[index].label
                                        )}
                                        onChange={(e) =>
                                            handleLabelChange(index, e)
                                        }
                                    />
                                    <div className={label}>
                                        {formatTime(interval)}
                                    </div>
                                    <div className="total-time">
                                        {formatTime(time)}
                                    </div>
                                    <div className="split-date">
                                        {splitTimeStamp}
                                    </div>
                                    <button
                                        className={
                                            index === 0
                                                ? "button-hidden"
                                                : "remove-button"
                                        }
                                        disabled={
                                            index === splitList.length - 1
                                        }
                                        onClick={() =>
                                            handleRemoveSplit(index, interval)
                                        }
                                    >
                                        X
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
                <button
                    type="submit-button"
                    disabled={reset || !paused}
                    onClick={handleExportSubmit}
                >
                    export
                </button>
              <div className="split-item" style={{ position: "relative", top: 20}}>
                    Total labeled time: {formatTime(total)}
                </div>
            </form>
        </div>
    );
}

export default App;
