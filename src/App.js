import { useState, useEffect } from "react";
import { formatTime } from "./utils";

import "./App.css";

function App() {
  const [start, setStart] = useState(null);
  const [paused, setPaused] = useState(true);
  const [time, setTime] = useState(0);
  //   const [splitList, setSplitList] = useState([])
  const [splitList, setSplitList] = useState([
    {
      time: 0,
      label: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(splitList);
  };

  const startTimer = () => {
    setStart(Date.now() - time);
    setPaused((p) => !p);
    if (!paused) splitTimer("pause");
  };

  const splitTimer = () => {
    if (splitList.length === 1) {
      setSplitList((split) => [{ time: 0, label: "start" }]);
    }
    setSplitList((split) => [...split, { time, label: "split" }]);
  };

  // setSplitList((split) => console.log(split));

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
      <form onSubmit={handleSubmit}>
        <div className="split-item">
          <div>0</div>
          <input
            type="text"
            className="label-input"
            name="label"
            value={splitList[0].label}
            placeholder="start"
            onChange={(e) => handleLabelChange(0, e)}
          />
          <div className="start">{formatTime(0)}</div>
        </div>
        {splitList.slice(1).map((x, index, splitList) => {
          const { time, label } = x;
          const interval = index > 0 ? time - splitList[index - 1].time : time;

          return (
            <div className="split-item" key={time}>
              <div>{index + 1}</div>
              <input
                type="text"
                className="label-input"
                name="label"
                value={splitList.label}
                placeholder="split"
                onChange={(e) => handleLabelChange(index, e)}
              />
              <div className={label}>{formatTime(interval)}</div>
            </div>
          );
        })}
        <button type="submit" onClick={handleSubmit}>
          export
        </button>
      </form>
    </div>
  );
}

export default App;
