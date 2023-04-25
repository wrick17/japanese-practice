import { useState } from "react";
import classNames from "classnames";

import { hiragana } from "../constants/constantsV2";

export const CheatSheetV2 = () => {
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  return (
    <div className="cheatsheet">
      <button
        className="show-cheatsheet highlight"
        onClick={() => setShowCheatSheet(!showCheatSheet)}
      >
        {showCheatSheet ? "Hide" : "Show"} Cheat Sheet
      </button>
      {showCheatSheet &&
        hiragana.map(({ group, rows }) => (
          <div className="table-block" key={group}>
            <h3>{group}</h3>
            <div className="cheatsheet-table">
              {rows.map((items, rowIndex) => (
                <div
                  className={classNames("row", { wide: group === "youon" })}
                  key={group + rowIndex}
                >
                  {items.map((item, itemIndex) =>
                    item.roumaji ? (
                      <div
                        className="item"
                        key={item.roumaji + item.kana}
                        onClick={() => speak(item.kana)}
                      >
                        <div className="item-hiragana">{item.kana}</div>
                        <div className="item-roumaji">{item.roumaji}</div>
                      </div>
                    ) : (
                      <div
                        className="item empty"
                        key={group + rowIndex + itemIndex}
                      />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};



