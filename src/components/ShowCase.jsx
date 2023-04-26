import { useEffect, useState } from "react";
import classNames from "classnames";
import { speak } from "../utils/utilsV2";

export const ShowCase = ({ item, kana }) => {
  const [show, setShow] = useState(false);
  const [announce, setAnnounce] = useState(false);

  useEffect(() => {
    setShow(false);
    if (announce) {
      speak(item?.kana);
    }
  }, [item, announce]);

  return (
    <div>
      <div className="showcase" onClick={() => speak(item?.[kana])}>
        {!item ? (
          <div className="block kana">
            <div>🥢</div>
          </div>
        ) : show ? (
          <div className={classNames("block kana", { hiding: !show })}>
            <div>{item?.[kana]}</div>
            <div className="small-subtext">{item.roumaji}</div>
          </div>
        ) : (
          <div className="block roumaji">{item.roumaji}</div>
        )}
      </div>
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





