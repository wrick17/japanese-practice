import wordsData from "../constants/wordsV2.json";
import { japanese } from "../constants/constantsV2";

const lang = "ja-JP";

const kanaVowelSounds = {
  a: "aa",
  i: "ee",
  u: "oo",
  e: "eh",
  o: "oh",
};

export const STORAGE_KEY = "japanese-practice-settings-v1";

export const modes = {
  romajiToKana: "romaji-to-kana",
  kanaToRomaji: "kana-to-romaji",
  learn: "learn",
  words: "words",
};

export const scripts = {
  hiragana: "hiragana",
  katakana: "katakana",
};

export const wordPrompts = {
  japanese: "japanese",
  romaji: "romaji",
  english: "english",
};

export const defaultSettings = {
  mode: modes.romajiToKana,
  kanaScript: scripts.hiragana,
  shuffle: false,
  wordPrompt: wordPrompts.romaji,
  selectedRows: ["gojuuon:a"],
};

const getKanaSound = (romaji) => {
  if (romaji === "wo") return "oh";

  const vowel = romaji.at(-1);
  const sound = kanaVowelSounds[vowel];
  return sound ? `${romaji.slice(0, -1)}${sound}` : romaji;
};

export const getKanaRomajiDisplay = (romaji) => {
  const sound = getKanaSound(romaji);
  return sound === romaji ? romaji : `${romaji}(${sound})`;
};

const kanaMap = {
  [scripts.hiragana]: "kana",
  [scripts.katakana]: "kanaK",
};

export const speak = (input) => {
  if (!input) return;
  const synth = globalThis.speechSynthesis;
  const Utterance = globalThis.SpeechSynthesisUtterance;
  if (!synth || typeof Utterance !== "function") return;

  const utterance = new Utterance(input);
  utterance.voice = synth.getVoices().find((voice) => voice.lang === lang);
  utterance.lang = lang;
  utterance.rate = 0.3;
  utterance.volume = 1;
  synth.speak(utterance);
};

export const shuffle = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const getRowValue = (group, row) => {
  const firstItem = row[0];
  if (firstItem.kana === "ん") return "N";
  return `${firstItem.roumaji[0]}${group.group === "youon" ? "+" : ""}`;
};

const getRowId = (group, row) => `${group.group}:${getRowValue(group, row)}`;

const rowDefinitions = japanese.flatMap((group) =>
  group.rows.map((row) => ({
    id: getRowId(group, row),
    value: getRowValue(group, row),
    group: group.group,
    row,
  })),
);

const rowIds = new Set(rowDefinitions.map((row) => row.id));
const modeValues = new Set(Object.values(modes));
const scriptValues = new Set(Object.values(scripts));
const wordPromptValues = new Set(Object.values(wordPrompts));

const unitsByScript = {
  [scripts.hiragana]: rowDefinitions
    .flatMap(({ row }) =>
      row.filter((item) => item.roumaji).map((item) => item.kana),
    )
    .toSorted((a, b) => b.length - a.length),
  [scripts.katakana]: rowDefinitions
    .flatMap(({ row }) =>
      row.filter((item) => item.roumaji).map((item) => item.kanaK),
    )
    .toSorted((a, b) => b.length - a.length),
};

export const getKanaKey = (kanaScript) =>
  kanaMap[kanaScript] ?? kanaMap.hiragana;

export const normalizeSettings = (settings = {}) => {
  const hasSelectedRows = Array.isArray(settings.selectedRows);
  const selectedRows = hasSelectedRows
    ? settings.selectedRows.filter((row) => rowIds.has(row))
    : defaultSettings.selectedRows;

  return {
    mode: modeValues.has(settings.mode) ? settings.mode : defaultSettings.mode,
    kanaScript: scriptValues.has(settings.kanaScript)
      ? settings.kanaScript
      : defaultSettings.kanaScript,
    shuffle:
      typeof settings.shuffle === "boolean"
        ? settings.shuffle
        : defaultSettings.shuffle,
    wordPrompt: wordPromptValues.has(settings.wordPrompt)
      ? settings.wordPrompt
      : defaultSettings.wordPrompt,
    selectedRows,
  };
};

export const loadSettings = (storage = globalThis.localStorage) => {
  try {
    const saved = storage?.getItem(STORAGE_KEY);
    return saved ? normalizeSettings(JSON.parse(saved)) : defaultSettings;
  } catch {
    return defaultSettings;
  }
};

export const saveSettings = (settings, storage = globalThis.localStorage) => {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(normalizeSettings(settings)));
  } catch {
    return;
  }
};

export const clearSettings = (storage = globalThis.localStorage) => {
  try {
    storage?.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
};

export const getInitialList = (selectedRows = defaultSettings.selectedRows) => {
  const selected = new Set(selectedRows);
  return japanese.map((group) => ({
    title: group.group,
    rows: group.rows.map((row) => ({
      id: getRowId(group, row),
      value: getRowValue(group, row),
      checked: selected.has(getRowId(group, row)),
    })),
  }));
};

export const getSelectedRows = (list) =>
  list.flatMap((group) =>
    group.rows.filter((row) => row.checked).map((row) => row.id),
  );

const getSelectedKana = (list, kanaScript) => {
  const selectedRows = new Set(getSelectedRows(list));
  const kanaKey = getKanaKey(kanaScript);
  return new Set(
    rowDefinitions.flatMap(({ id, row }) => {
      if (!selectedRows.has(id)) return [];
      return row.filter((item) => item.roumaji).map((item) => item[kanaKey]);
    }),
  );
};

const segmentKana = (input, kanaScript) => {
  const units = unitsByScript[kanaScript];
  const segments = [];
  let index = 0;

  while (index < input.length) {
    const unit = units.find((value) => input.startsWith(value, index));
    if (!unit) return [];
    segments.push(unit);
    index += unit.length;
  }

  return segments;
};

const getKanaItems = (list, kanaScript) => {
  const selectedRows = new Set(getSelectedRows(list));
  const kanaKey = getKanaKey(kanaScript);

  if (!selectedRows.size) return [];

  return rowDefinitions.flatMap(({ id, row }) => {
    if (!selectedRows.has(id)) return [];
    return row
      .filter((item) => item.roumaji)
      .map((item) =>
        Object.assign({}, item, {
          kind: "kana",
          japanese: item[kanaKey],
        }),
      );
  });
};

const getWordItems = (list, kanaScript) => {
  const selectedKana = getSelectedKana(list, kanaScript);
  if (!selectedKana.size) return [];

  return wordsData.words
    .filter((word) => word.script === kanaScript)
    .filter((word) => {
      const segments = segmentKana(word.japanese, kanaScript);
      return (
        segments.length > 0 && segments.every((unit) => selectedKana.has(unit))
      );
    })
    .map((word) =>
      Object.assign({}, word, {
        kind: "word",
      }),
    );
};

export const getDeck = ({ list, mode, kanaScript, shuffle: shouldShuffle }) => {
  const items =
    mode === modes.words
      ? getWordItems(list, kanaScript)
      : getKanaItems(list, kanaScript);

  return mode === modes.words || shouldShuffle ? shuffle(items) : items;
};
