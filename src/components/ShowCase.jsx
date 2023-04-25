import { useEffect, useState } from "react";
import classNames from "classnames";
import { speak } from "../utils/utils";

export const ShowCase = ({ item }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
  }, [item]);

  return (
    <div>
      <div className="showcase" onClick={() => speak(item.kana)}>
        {!item ? (
          <div className="block kana">
            <div>🥢</div>
            <div className="smaller-subtext">Pick rows below 👇🏻</div>
          </div>
        ) : show ? (
          <div className={classNames("block kana", { hiding: !show })}>
            <div>{item.kana}</div>
            <div className="small-subtext">{item.roumaji}</div>
          </div>
        ) : (
          <div className="block roumaji">{item.roumaji}</div>
        )}
      </div>
      <button
        className="show"
        onClick={() => {
          if (!show) setShow(true);
        }}
      >
        {show ? "☝🏻 Here you go!" : "😵‍💫 Help Me!"}
      </button>
    </div>
  );
};







