import { useState, useEffect } from "react";
import { formatTime } from "./utils";

function App() {
  const [start, setStart] = useState(null);
  const [paused, setPaused] = useState(true);
  const [time, setTime] = useState(0);
  const [splitList, setSplitList] = useState([
    {
      time: 0,
      label: "split",
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

  const startTimer = () => {
    setStart(Date.now() - time);
    setPaused((p) => !p);
    // if (!paused) addSplitValue("pause")
  };

  const splitTimer = () => {
    setSplitList((split) => [...split, { time, label: "split" }]);
  };

  const resetTimer = () => {
    setTime(0);
    setPaused(true);
    setSplitList([]);
  };

  const handleLabelChange = (index, e) => {
    // e.preventDefault()
    const values = [...splitList];
    values[index][e.target.name] = e.target.value;
    setSplitList(values);
  };

  const currentInterval = () => {
    const { length, [length - 2]: last2nd, [length - 1]: last } = splitList;
    if (reset) return "SPLIT TIME";
    if (!last) return formatTime(time);
    if (paused) return formatTime(last.time - last2nd.time);
    return formatTime(time - last.time);
  };

  const timerState = !paused ? "Pause" : "Start";
  const reset = time === 0;
  const formattedTime = formatTime(time);

  return (
    <div className="App">
      <div className="display">
        <span>{formatTime(time).slice(0, -2)}</span>
        <span>{formatTime(time).slice(-2)}</span>
      </div>
      <div className="split">{currentInterval()}</div>
      <div>
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
          disabled={reset || paused}
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>
      {splitList.length > 0 && <hr />}
      <div>
        {splitList.map((x, index, splitList) => {
          const { time, label } = x;
          const interval = index > 0 ? time - splitList[index - 1].time : time;

          return (
            <div key={time}>
              <div>{index + 1}</div>
              <div className={label}>{formatTime(interval)}</div>
              <div>{label}</div>
              <input
                type="text"
                className="label-input"
                name="label"
                value={splitList.label}
                onChange={(e) => handleLabelChange}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
