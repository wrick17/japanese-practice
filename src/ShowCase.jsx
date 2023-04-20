import { useEffect, useState } from "react";
import classNames from "classnames";
import { speak } from './utils';

export const ShowCase = ({ randomItem }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    speak(randomItem.kana);
  }, [randomItem]);

  return (
    <div className="showcase">
      <div className="block roumaji" onClick={() => speak(randomItem.kana)}>
        {randomItem.roumaji}
      </div>
      <div
        className={classNames("block kana", { hiding: !show })}
        onClick={() => {
          if (!show) setShow(true);
        }}
      >
        {show ? randomItem.kana : "🔎"}
      </div>
    </div>
  );
};

