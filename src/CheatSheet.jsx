import { useState } from "react";
import { cheatSheet, speak } from "./utils";

export const CheatSheet = () => {
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  return (
    <div className="cheatsheet">
      <button
        className="show-cheatsheet"
        onClick={() => setShowCheatSheet(!showCheatSheet)}
      >
        {showCheatSheet ? "Hide" : "Show"} Cheat Sheet
      </button>
      {showCheatSheet && (
        <div className="cheatsheet-table">
          {cheatSheet.map((row, index) => {
            return (
              <div className="row" key={index}>
                {row.map((item) => {
                  return (
                    <div
                      className="item"
                      key={item.roumaji}
                      onClick={() => speak(item.kana)}
                    >
                      <div className="item-hiragana">{item.kana}</div>
                      <div className="item-roumaji">{item.roumaji}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

