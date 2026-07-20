import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { BookOpen, EyeOff, X } from "lucide-react";

import { japanese } from "../constants/constantsV2";
import { kanji } from "../constants/kanjiV1";
import { isOutsideDialog } from "../utils/dialog";
import { getKanaKey, modes, scripts } from "../utils/utilsV2";
import { getStudyFields, RevealedCard } from "./ShowCase";

const groupLabels = {
  gojuuon: "Gojuon",
  dakuten: "Dakuten",
  handakuten: "Handakuten",
  youon: "Yoon",
};

export const CheatSheetV2 = ({ kanaScript }) => {
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const dialogRef = useRef(null);
  const kana = getKanaKey(kanaScript);
  const scriptLabel =
    kanaScript === scripts.kanji
      ? "Kanji"
      : kanaScript === scripts.katakana
        ? "Katakana"
        : "Hiragana";
  const groups =
    kanaScript === scripts.kanji
      ? kanji.map((group) => ({
          group: group.group,
          label: `${group.label} (${group.items.length})`,
          rows: [
            group.items.map((item) => {
              const reading = item.on[0] ?? item.kun[0];
              return {
                display: item.japanese,
                pronunciation: reading,
                studyItem: Object.assign({}, item, {
                  kind: "kanji",
                  japanese: item.japanese,
                }),
              };
            }),
          ],
        }))
      : japanese.map((group) => ({
          group: group.group,
          rows: group.rows.map((row) =>
            row.map((item) =>
              Object.assign(
                {},
                item.roumaji && {
                  display: item[kana],
                  pronunciation: item.roumaji,
                  studyItem: Object.assign({}, item, {
                    kind: "kana",
                    japanese: item[kana],
                  }),
                },
              ),
            ),
          ),
        }));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (selectedItem && dialog && !dialog.open) dialog.showModal();
  }, [selectedItem]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const closeOnBackdropClick = (event) => {
      if (isOutsideDialog(event)) dialog.close();
    };

    dialog.addEventListener("click", closeOnBackdropClick);
    return () => dialog.removeEventListener("click", closeOnBackdropClick);
  }, []);

  const fields = getStudyFields(selectedItem, modes.learn).fields;

  return (
    <section
      className="cheatsheet"
      aria-label={`${scriptLabel} ${kanaScript === scripts.kanji ? "reference" : "chart"}`}
    >
      <div className="cheatsheet-header">
        <button
          className="show-cheatsheet highlight with-icon"
          onClick={() => setShowCheatSheet(!showCheatSheet)}
          type="button"
        >
          {showCheatSheet ? (
            <EyeOff aria-hidden="true" className="button-icon" />
          ) : (
            <BookOpen aria-hidden="true" className="button-icon" />
          )}
          {showCheatSheet ? "Hide" : "Show"} {scriptLabel}{" "}
          {kanaScript === scripts.kanji ? "Reference" : "Chart"}
        </button>
      </div>
      {showCheatSheet && (
        <div
          className={classNames("cheatsheet-grid", {
            "kanji-rows": kanaScript === scripts.kanji,
          })}
        >
          {groups.map(({ group, label, rows }) => (
            <div className="table-block" key={group}>
              <h3>{label ?? groupLabels[group] ?? group}</h3>
              <div className="cheatsheet-table">
                {rows.map((items, rowIndex) => (
                  <div
                    className={classNames("row", {
                      wide: group === "youon",
                      kanji: kanaScript === scripts.kanji,
                    })}
                    key={group + rowIndex}
                  >
                    {items.map((item, itemIndex) =>
                      item.pronunciation ? (
                        <button
                          type="button"
                          className="item"
                          key={item.pronunciation + item.display}
                          onClick={() => setSelectedItem(item.studyItem)}
                        >
                          <span className="item-hiragana">{item.display}</span>
                          <span className="item-roumaji">
                            {item.pronunciation}
                          </span>
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
      )}
      <dialog
        aria-labelledby="study-dialog-title"
        className="study-dialog"
        onClose={() => setSelectedItem(null)}
        ref={dialogRef}
      >
        <div className="study-dialog-panel">
          <div className="study-dialog-header">
            <h2 id="study-dialog-title">{scriptLabel} details</h2>
            <button
              aria-label="Close"
              className="modal-close"
              onClick={() => dialogRef.current?.close()}
              type="button"
            >
              <X aria-hidden="true" className="button-icon" />
            </button>
          </div>
          {selectedItem && (
            <div className="study-dialog-card">
              <RevealedCard fields={fields} />
            </div>
          )}
        </div>
      </dialog>
    </section>
  );
};
