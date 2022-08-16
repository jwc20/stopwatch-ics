import { useState, useEffect } from "react";
import { formatTime, makeEvent, makeEvents, makeIcs } from "./utils";
import "./App.css";

const timestamp = new Date(Date.now());
let latestInterval = 0;

function App() {
  const [start, setStart] = useState(null);
  const [paused, setPaused] = useState(true);
  const [time, setTime] = useState(0);
  const [splitList, setSplitList] = useState([
    {
      label: "start",
      time: 0,
      interval: latestInterval,
      timestamp: timestamp,
    },
  ]);

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

  const handleExportSubmit = (e) => {
    e.preventDefault();
    let eventList = [];
    if (splitList.length > 1) {
      for (let i = 0; i < splitList.length; i++) {
        eventList.push(makeEvent(splitList[i]));
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
    const timestamp = new Date(Date.now());
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
    setPaused(true);
    setSplitList([
      {
        time: 0,
        interval: 0,
        label: "start",
        timestamp: timestamp,
      },
    ]);
  };

  const handleLabelChange = (index, e) => {
    const items = [...splitList];
    items[index][e.target.name] = e.target.value;
    setSplitList(items);
  };

  const handlePlaceholderChange = (index, label) => {
    if (index === 0) return "start";
    else if (label === "pause") return "pause";
    else return "split";
  };

  const currentInterval = () => {
    const { length, [length - 2]: last2nd, [length - 1]: last } = splitList;
    if (reset) return "SPLIT TIME";
    if (!last) return formatTime(time);
    if (paused) return formatTime(last.time - last2nd.time);
    return formatTime(time - last.time);
  };

  const handleRemoveSplit = (i, interval) => {
    const items = [...splitList];
    splitList[i - 1].interval += interval;
    items.splice(i, 1);
    setSplitList(items);
  };

  const timerState = !paused ? "Pause" : "Start";
  const reset = time === 0;
  const formattedTime = formatTime(time);

  return (
    <div className="App">
      <div className="display">
        <div className="timer-display">
          <span>{formatTime(time).slice(0, -2)}</span>
          <span>{formatTime(time).slice(-2)}</span>
        </div>
        <div className="split-timer-display">{currentInterval()}</div>
      </div>

      <div className="split-list">
        <button className={paused ? "start" : "pause"} onClick={startTimer}>
          {timerState}
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
      </div>
      {splitList.length > 0 && <hr />}
      <form onSubmit={handleExportSubmit}>
        {splitList.map((x, index) => {
          const { time, label, timestamp } = x;
          const interval = index > 0 ? time - splitList[index - 1].time : time;
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
                    onChange={(e) => handleLabelChange(index, e)}
                  />
                  <div className={label}>{formatTime(interval)}</div>
                  <div className="total-time">{formatTime(time)}</div>
                  <div className="split-date">
                    {splitTimeStamp.toString().slice(0, 24)}
                  </div>
                  <button
                    className={index === 0 ? "button-hidden" : "remove-button"}
                    disabled={index === splitList.length - 1}
                    onClick={() => handleRemoveSplit(index, interval)}
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
          disabled={reset}
          onClick={handleExportSubmit}
        >
          export
        </button>
      </form>
    </div>
  );
}

export default App;
