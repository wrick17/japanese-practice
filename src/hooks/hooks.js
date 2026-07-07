import { useCallback, useEffect, useRef, useState } from "react";
import { getInitialList, getItemsToShow } from "../utils/utilsV2";

const durations = [1, 5, 10, 30];

export const useJapanese = () => {
  const [list, setList] = useState(getInitialList());
  const [itemsToShow, setItemsToShow] = useState(getItemsToShow(list));
  const [currentItem, setCurrentItem] = useState(0);
  const [duration, setDuration] = useState(durations[0]);
  const [remaining, setRemaining] = useState(duration);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef();
  const remainingRef = useRef(duration);
  const [kanaScript, setKanaScript] = useState("hiragana");

  const toggleScript = () => {
    setKanaScript((currentScript) => {
      return currentScript === "hiragana" ? "katakana" : "hiragana";
    });
  };

  const changeDuration = () => {
    const index = durations.indexOf(duration);
    const nextIndex = index + 1 === durations.length ? 0 : index + 1;
    setDuration(durations[nextIndex]);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    clearInterval(remainingRef.current);
    setRemaining(duration);
    setTimerRunning(() => false);
  };

  const toggleTimer = () => {
    if (timerRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  };

  const reShuffle = useCallback(() => {
    setItemsToShow(() => getItemsToShow(list));
  }, [list]);

  const next = () => {
    if (timerRunning) {
      startTimer();
    }
    setCurrentItem((index) => {
      if (index < itemsToShow.length - 1) {
        return index + 1;
      } else {
        reShuffle();
        return 0;
      }
    });
  };
  // , [currentItem, itemsToShow, list, duration, timerRunning, kanaScript]

  const startRemainingTimer = useCallback(() => {
    clearInterval(remainingRef.current);
    setRemaining(() => duration);
    remainingRef.current = setInterval(() => {
      setRemaining((prev) => (prev === 1 ? duration : prev - 1));
    }, 1000);
  }, [duration]);

  const timerFunction = () => {
    setRemaining(() => duration);
    next();
  };

  const startTimer = () => {
    stopTimer();
    setTimerRunning(() => true);
    startRemainingTimer();
    timerRef.current = setInterval(timerFunction, duration * 1000);
  };

  useEffect(() => {
    setRemaining(() => duration);
  }, [duration]);

  useEffect(() => {
    reShuffle();
  }, [reShuffle]);

  const kanaMap = {
    hiragana: "kana",
    katakana: "kanaK",
  };

  return {
    list,
    setList,
    itemsToShow,
    next,
    currentItem,
    timerRunning,
    toggleTimer,
    duration,
    changeDuration,
    remaining,
    kanaScript,
    kana: kanaMap[kanaScript],
    toggleScript,
  };
};
