import { useState } from "react";
import classNames from "classnames";

import { japanese } from "../constants/constantsV2";
import { speak } from "../utils/utilsV2";

export const CheatSheetV2 = ({ kana }) => {
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
        japanese.map(({ group, rows }) => (
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
                      <button
                        type="button"
                        className="item"
                        key={item.roumaji + item[kana]}
                        onClick={() => speak(item[kana])}
                      >
                        <span className="item-hiragana">{item[kana]}</span>
                        <span className="item-roumaji">{item.roumaji}</span>
                      </button>
                    ) : (
                      <div
                        className="item empty"
                        key={group + rowIndex + itemIndex}
                      />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};
