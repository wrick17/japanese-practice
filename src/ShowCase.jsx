import { useEffect, useState } from "react";
import classNames from "classnames";
import { speak } from './utils';

export const ShowCase = ({ item }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    speak(item.kana);
  }, [item]);

  return (
    <div className="showcase">
      <div className="block roumaji" onClick={() => speak(item.kana)}>
        {item.roumaji}
      </div>
      <div
        className={classNames("block kana", { hiding: !show })}
        onClick={() => {
          if (!show) setShow(true);
        }}
      >
        {show ? item.kana : "🔎"}
      </div>
    </div>
  );
};

