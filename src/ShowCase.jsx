import { useEffect, useState } from "react";
import classNames from "classnames";
import { speak } from "./utils";

export const ShowCase = ({ item }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    speak(item.kana);
  }, [item]);

  return (
    <>
      <div className="showcase" onClick={() => speak(item.kana)}>
        {show ? (
          <div className={classNames("block kana", { hiding: !show })}>
            <div className="small-subtext">{item.roumaji}</div>
            <div>{item.kana}</div>
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
    </>
  );
};






