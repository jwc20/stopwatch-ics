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

function makeInitialSplitList() {
    return [
        {
            label: "start",
            time: 0,
            interval: 0,
            timestamp: new Date(Date.now()).toString().slice(0, 24),
        },
    ];
}

function App() {
    const [total, setTotal] = useState(0);
    const [darkMode, setDarkMode] = useState(true);

    const [paused, setPaused] = useState(() => {
        const saved = localStorage.getItem("paused");
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [start, setStart] = useState(() => {
        const savedPaused = localStorage.getItem("paused");
        const wasPaused = savedPaused !== null ? JSON.parse(savedPaused) : true;
        if (!wasPaused) {
            const savedStart = localStorage.getItem("start");
            return savedStart !== null ? JSON.parse(savedStart) : null;
        }
        return null;
    });

    const [time, setTime] = useState(() => {
        const savedPaused = localStorage.getItem("paused");
        const wasPaused = savedPaused !== null ? JSON.parse(savedPaused) : true;
        if (!wasPaused) {
            const savedStart = localStorage.getItem("start");
            if (savedStart !== null) {
                return Date.now() - JSON.parse(savedStart);
            }
        }
        const savedTime = localStorage.getItem("time");
        return savedTime !== null ? JSON.parse(savedTime) : 0;
    });

    const [splitList, setSplitList] = useState(() => {
        const saved = localStorage.getItem("splitList");
        const initialValue = JSON.parse(saved);
        return initialValue || makeInitialSplitList();
    });

    useEffect(() => {
        localStorage.setItem("time", JSON.stringify(time));
        localStorage.setItem("splitList", JSON.stringify(splitList));
        localStorage.setItem("paused", JSON.stringify(paused));
        localStorage.setItem("start", JSON.stringify(start));
    }, [time, splitList, paused, start]);

    useEffect(() => {
        if (!paused) {
            const timer = setInterval(() => {
                setTime(Date.now() - start);
            }, 4);
            return () => clearInterval(timer);
        }
    }, [paused, start]);

    const reset = time === 0;

    const currentInterval = () => {
        const { length, [length - 2]: last2nd, [length - 1]: last } = splitList;
        if (reset) return "SPLIT TIME";
        if (!last) return formatTime(time);
        if (paused && last2nd !== undefined) {
            return formatTime(last.time - last2nd.time);
        }
        return formatTime(time - last.time);
    };

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
        const handleBeforeUnload = () => "show warning";
        window.onbeforeunload = handleBeforeUnload;
        return () => {
            window.onbeforeunload = null;
        };
    }, []);

    const handleExportSubmit = (e) => {
        e.preventDefault();
        if (splitList.length > 1) {
            const eventList = [
                {
                    start: dateToArray(splitList[0].timestamp),
                    duration: { hours: 0, minutes: 1 },
                    title: splitList[0].label,
                },
            ];

            for (let i = 1; i < splitList.length; i++) {
                eventList.push(makeEvent(splitList[i], splitList[i - 1]));
            }

            const icsText = makeEvents(eventList);
            makeIcs(icsText, splitList[0].timestamp);
        }
    };

    const startTimer = () => {
        const newStart = Date.now() - time;
        setStart(newStart);
        setPaused((p) => !p);
        if (!paused) splitTimer("pause");
    };

    const splitTimer = (splitLabel) => {
        const timestamp = new Date(Date.now()).toString().slice(0, 24);
        setSplitList((prev) => {
            const lastSplit = prev[prev.length - 1];
            const interval = time - lastSplit.time;
            return [
                ...prev,
                {
                    label: splitLabel === "pause" ? "pause" : "split",
                    time,
                    interval,
                    timestamp,
                },
            ];
        });
    };

    const resetTimer = () => {
        setTime(0);
        setTotal(0);
        setStart(null);
        setPaused(true);
        setSplitList(makeInitialSplitList());
    };

    const totalTimer = () => {
        let totalIntervalTime = 0;
        for (const item of splitList) {
            if (
                item.label !== "split" &&
                item.label !== "start" &&
                item.label !== "rest" &&
                item.label !== "pause"
            ) {
                totalIntervalTime += item.interval;
            }
        }
        setTotal(totalIntervalTime);
    };

    const handleLabelChange = (index, e) => {
        const items = splitList.map((item, i) =>
            i === index ? { ...item, [e.target.name]: e.target.value } : item
        );
        setSplitList(items);
    };

    const handlePlaceholderChange = (index, label) => {
        if (index === 0) return "start";
        if (label === "pause") return "pause";
        if (label === "split") return "split";
        return label;
    };

    const handleRemoveSplit = (i, interval) => {
        const items = splitList
            .map((item, idx) =>
                idx === i - 1
                    ? { ...item, interval: item.interval + interval }
                    : item
            )
            .filter((_, idx) => idx !== i);
        setSplitList(items);
    };

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
                    const { time: splitTime, label } = x;
                    const interval =
                        index > 0
                            ? splitTime - splitList[index - 1].time
                            : splitTime;
                    const splitTimeStamp = splitList[index].timestamp;
                    return (
                        <div key={index}>
                            {splitList.length === 1 ? (
                                <div></div>
                            ) : (
                                <div className="split-item">
                                    <div>{index === 0 ? "" : index}</div>
                                    <input
                                        type="text"
                                        className="label-input"
                                        name="label"
                                        value={x.label}
                                        placeholder={handlePlaceholderChange(
                                            index,
                                            label
                                        )}
                                        onChange={(e) =>
                                            handleLabelChange(index, e)
                                        }
                                    />
                                    <div className={label}>
                                        {formatTime(interval)}
                                    </div>
                                    <div className="total-time">
                                        {formatTime(splitTime)}
                                    </div>
                                    <div className="split-date">
                                        {splitTimeStamp}
                                    </div>
                                    <button
                                        type="button"
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
                    type="button"
                    disabled={reset || !paused}
                    onClick={handleExportSubmit}
                >
                    export
                </button>
                <div className="split-item total-labeled-time">
                    Total labeled time: {formatTime(total)}
                </div>
            </form>
        </div>
    );
}

export default App;
