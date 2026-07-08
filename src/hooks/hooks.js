import { useEffect, useMemo, useState } from "react";
import {
  clearSettings,
  defaultSettings,
  getDeck,
  getInitialList,
  getKanaKey,
  getSelectedRows,
  loadSettings,
  normalizeSettings,
  saveSettings,
} from "../utils/utilsV2";

export const useJapanese = () => {
  const [settings, setSettings] = useState(loadSettings);
  const [list, setList] = useState(() => getInitialList(settings.selectedRows));
  const [currentItem, setCurrentItem] = useState(0);
  const [cycle, setCycle] = useState(0);

  const deck = useMemo(
    () => getDeck({ ...settings, list, cycle }),
    [cycle, list, settings],
  );

  const updateSettings = (nextSettings) => {
    setSettings((current) =>
      normalizeSettings({
        ...current,
        ...nextSettings,
        selectedRows: getSelectedRows(list),
      }),
    );
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

  const reset = () => {
    clearSettings();
    setSettings(defaultSettings);
    setList(getInitialList(defaultSettings.selectedRows));
    setCurrentItem(0);
    setCycle((value) => value + 1);
  };

  useEffect(() => {
    setCurrentItem(0);
  }, [list]);

  useEffect(() => {
    if (currentItem >= deck.length) setCurrentItem(0);
  }, [currentItem, deck.length]);

  useEffect(() => {
    saveSettings({
      ...settings,
      selectedRows: getSelectedRows(list),
    });
  }, [list, settings]);

  return {
    list,
    setList,
    deck,
    next,
    currentItem,
    settings,
    updateSettings,
    reset,
    kana: getKanaKey(settings.kanaScript),
  };
};
