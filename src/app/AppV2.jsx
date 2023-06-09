import { CheatSheetV2 } from "../components/CheatSheetV2";
import { Info } from "../components/Info";
import { SelectorV2 } from "../components/SelectorV2";
import { ShowCase } from "../components/ShowCase";
import { useJapanese } from "../hooks/hooks";

import "./App.css";

const AppV2 = () => {
  const {
    list,
    setList,
    itemsToShow,
    next,
    currentItem,
    timerRunning,
    toggleTimer,
    duration,
    changeDuration,
    remaining,
    kanaScript,
    toggleScript,
    kana,
  } = useJapanese();

  const isHiragana = kanaScript === "hiragana";

  return (
    <div className="select">
      <h2>
        What's the{" "}
        <span onClick={toggleScript} className="script-selector">
          {isHiragana ? "Hiragana" : "Katakana"}
        </span>{" "}
        for this?
      </h2>
      <ShowCase item={itemsToShow[currentItem]} kana={kana} />
      <div className="button-group">
        <button
          className="switch highlight"
          onClick={next}
          disabled={!itemsToShow[currentItem]}
        >
          Next
        </button>
        <button
          className="switch timer duration highlight"
          onClick={changeDuration}
          disabled={timerRunning}
          style={{
            background: timerRunning
              ? `radial-gradient(closest-side, transparent 50%, transparent 80% 100% ), conic-gradient(#004040 ${
                  (remaining / duration) * 100
                }%, #222 0)`
              : "#222",
          }}
        >
          {remaining}
        </button>
        <button
          className="switch highlight"
          onClick={toggleTimer}
          disabled={!itemsToShow[currentItem]}
        >
          {timerRunning ? "Stop" : "Timer"}
        </button>
      </div>
      <SelectorV2 list={list} setList={setList} />
      <CheatSheetV2 kana={kana} />
      <Info />
    </div>
  );
};

export default AppV2;



