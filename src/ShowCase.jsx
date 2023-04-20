import { useEffect, useState } from "react";
import classNames from "classnames";

export const ShowCase = ({ randomItem }) => {
  const [show, setShow] = useState(false);

  const speak = (input) => {
    const lang = "ja-JP";
    const synth = window.speechSynthesis;
    const voices = synth.getVoices().filter((voice) => voice.lang === lang);
    let utterance = new SpeechSynthesisUtterance(input);
    utterance.voice = voices[0];
    utterance.lang = "ja-JP";
    utterance.rate = 0.3;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
  };

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

