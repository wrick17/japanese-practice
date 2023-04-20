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
    <div className="showcase" onClick={() => speak(item.kana)}>
      <div className="block roumaji">{item.roumaji}</div>
      <div
        className={classNames("block kana", { hiding: !show })}
        onClick={() => {
          if (!show) setShow(true);
        }}
      >
        {show ? (
          item.kana
        ) : (
          <div>
            <span>😵‍💫</span>
            <div>Help Me!</div>
          </div>
        )}
      </div>
    </div>
  );
};







// "🔎"