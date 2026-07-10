import { useEffect, useMemo, useState } from "react";
import {
  clearSettings,
  defaultSettings,
  getDeck,
  getInitialList,
  getSelectedRows,
  loadSettings,
  normalizeSettings,
  saveSettings,
  scripts,
} from "../utils/utilsV2";

export const useJapanese = () => {
  const [settings, setSettings] = useState(loadSettings);
  const [list, setListState] = useState(() =>
    getInitialList(
      settings.kanaScript === scripts.kanji
        ? settings.selectedKanji
        : settings.selectedRows,
      settings.kanaScript,
    ),
  );
  const [currentItem, setCurrentItem] = useState(0);
  const [cycle, setCycle] = useState(0);

  const setList = (nextList) => {
    setListState(nextList);
    setCurrentItem(0);
  };

  const deck = useMemo(
    () => getDeck({ ...settings, list, cycle }),
    [cycle, list, settings],
  );

  const updateSettings = (nextSettings) => {
    const selectionKey =
      settings.kanaScript === scripts.kanji ? "selectedKanji" : "selectedRows";
    const next = normalizeSettings({
      ...settings,
      ...nextSettings,
      [selectionKey]: getSelectedRows(list),
    });

    setSettings(next);
    if (
      nextSettings.kanaScript &&
      nextSettings.kanaScript !== settings.kanaScript
    ) {
      setList(
        getInitialList(
          next.kanaScript === scripts.kanji
            ? next.selectedKanji
            : next.selectedRows,
          next.kanaScript,
        ),
      );
    }
    setCurrentItem(0);
  };

  const next = () => {
    if (!deck.length) return;

    setCurrentItem((index) => {
      if (index < deck.length - 1) return index + 1;
      if (settings.shuffle) setCycle((value) => value + 1);
      return 0;
    });
  };

  const previous = () => {
    if (!deck.length) return;
    setCurrentItem((index) => (index > 0 ? index - 1 : deck.length - 1));
  };

  const reset = () => {
    clearSettings();
    setSettings(defaultSettings);
    setList(
      getInitialList(defaultSettings.selectedRows, defaultSettings.kanaScript),
    );
    setCurrentItem(0);
    setCycle((value) => value + 1);
  };

  useEffect(() => {
    if (currentItem >= deck.length) setCurrentItem(0);
  }, [currentItem, deck.length]);

  useEffect(() => {
    const selectionKey =
      settings.kanaScript === scripts.kanji ? "selectedKanji" : "selectedRows";
    saveSettings({
      ...settings,
      [selectionKey]: getSelectedRows(list),
    });
  }, [list, settings]);

  return {
    list,
    setList,
    deck,
    next,
    previous,
    currentItem,
    settings,
    updateSettings,
    reset,
  };
};
