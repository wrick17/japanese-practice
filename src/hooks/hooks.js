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
  const [lists, setLists] = useState(() =>
    Object.fromEntries(
      Object.values(scripts).map((script) => [
        script,
        getInitialList(settings.selectedRows[script], script),
      ]),
    ),
  );
  const [currentItem, setCurrentItem] = useState(0);
  const [cycle, setCycle] = useState(0);

  const setList = (script, nextList) => {
    setLists((current) => ({ ...current, [script]: nextList }));
    setCurrentItem(0);
  };

  const deck = useMemo(
    () => getDeck({ ...settings, lists, cycle }),
    [cycle, lists, settings],
  );

  const updateSettings = (nextSettings) => {
    const next = normalizeSettings({
      ...settings,
      ...nextSettings,
      selectedRows: Object.fromEntries(
        Object.entries(lists).map(([script, list]) => [
          script,
          getSelectedRows(list),
        ]),
      ),
    });

    setSettings(next);
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
    setLists(
      Object.fromEntries(
        Object.values(scripts).map((script) => [
          script,
          getInitialList(defaultSettings.selectedRows[script], script),
        ]),
      ),
    );
    setCurrentItem(0);
    setCycle((value) => value + 1);
  };

  useEffect(() => {
    if (currentItem >= deck.length) setCurrentItem(0);
  }, [currentItem, deck.length]);

  useEffect(() => {
    saveSettings({
      ...settings,
      selectedRows: Object.fromEntries(
        Object.entries(lists).map(([script, list]) => [
          script,
          getSelectedRows(list),
        ]),
      ),
    });
  }, [lists, settings]);

  return {
    lists,
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
