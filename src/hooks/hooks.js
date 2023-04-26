import { useCallback, useEffect, useRef, useState } from "react";
import { getInitialList, getItemsToShow } from "../utils/utilsV2";

const durations = [5, 10, 30];

export const useHiragana = () => {
  const [list, setList] = useState(getInitialList());
  const [itemsToShow, setItemsToShow] = useState(getItemsToShow(list));
  const [currentItem, setCurrentItem] = useState(0);
  const [duration, setDuration] = useState(durations[0]);
  const [remaining, setRemaining] = useState(duration);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef();
  const remainingRef = useRef(duration);

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

  const next = useCallback(() => {
    if (timerRunning) {
      startTimer();
    }
    if (currentItem < itemsToShow.length - 1) {
      setCurrentItem((currentItem) => currentItem + 1);
    } else {
      setItemsToShow(() => getItemsToShow(list));
      setCurrentItem(() => 0);
    }
  }, [currentItem, itemsToShow, list, duration, timerRunning]);

  const startRemainingTimer = useCallback(() => {
    clearInterval(remainingRef.current);
    setRemaining(() => duration);
    remainingRef.current = setInterval(() => {
      setRemaining((prev) => prev - 1);
    }, 1000);
  }, [duration, remainingRef.current]);

  const startTimer = useCallback(() => {
    stopTimer();
    setTimerRunning(() => true);

    startRemainingTimer();

    timerRef.current = setInterval(() => {
      setRemaining(() => duration);
      next();
    }, duration * 1000);
  }, [duration, next, timerRef.current, remainingRef.current]);

  useEffect(() => {
    setRemaining(() => duration);
  }, [duration]);

  useEffect(() => {
    setItemsToShow(getItemsToShow(list));
  }, [list]);

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
  };
};

