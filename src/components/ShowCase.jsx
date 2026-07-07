import { useEffect, useState } from "react";
import classNames from "classnames";
import { speak } from "../utils/utilsV2";

export const ShowCase = ({ item, kana }) => {
  const [show, setShow] = useState(false);
  const [announce, setAnnounce] = useState(false);
  const playItem = () => speak(item?.[kana]);

  useEffect(() => {
    setShow(false);
    if (announce) {
      speak(item?.[kana]);
    }
  }, [item, announce, kana]);

  return (
    <div>
      <button
        aria-label="Play kana sound"
        className="showcase"
        onClick={playItem}
        type="button"
      >
        {!item ? (
          <span className="block kana">
            <span>🥢</span>
          </span>
        ) : show ? (
          <span className={classNames("block kana", { hiding: !show })}>
            <span>{item?.[kana]}</span>
            <span className="small-subtext">{item.roumaji}</span>
          </span>
        ) : (
          <span className="block roumaji">{item.roumaji}</span>
        )}
      </button>
      <button
        className="show help"
        onClick={() => {
          setShow(!show);
        }}
        disabled={!item}
      >
        {!item
          ? "First pick some rows below 👇🏻"
          : show
            ? "☝🏻 Here you go!"
            : "😵‍💫 Help Me!"}
      </button>
      <button
        className="show speak"
        onClick={() => setAnnounce(!announce)}
        disabled={!item}
      >
        📢 {announce ? "Stop" : "Announce"}
      </button>
    </div>
  );
};
