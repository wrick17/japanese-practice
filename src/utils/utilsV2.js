import wordsData from "../constants/wordsV2.json";
import { japanese } from "../constants/constantsV2";
import { kanji } from "../constants/kanjiV1";

const lang = "ja-JP";
let speechTimer;

const kanaVowelSounds = {
  a: "aa",
  i: "ee",
  u: "oo",
  e: "eh",
  o: "oh",
};

export const STORAGE_KEY = "japanese-practice-settings-v1";

export const modes = {
  learn: "learn",
  kanaToRomaji: "kana-to-romaji",
  romajiToKana: "romaji-to-kana",
  words: "words",
};

export const scripts = {
  hiragana: "hiragana",
  katakana: "katakana",
  kanji: "kanji",
};

export const wordPrompts = {
  japanese: "japanese",
  romaji: "romaji",
  english: "english",
};

export const defaultSettings = {
  mode: modes.learn,
  kanaScript: scripts.hiragana,
  shuffle: false,
  wordPrompt: wordPrompts.romaji,
  selectedRows: ["gojuuon:a"],
  selectedKanji: ["kanji:n5"],
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
  utterance.voice = synth
    .getVoices()
    .find((voice) => voice.lang.toLowerCase().startsWith("ja"));
  utterance.lang = lang;
  utterance.rate = [...input].length === 1 ? 0.05 : 0.25;
  utterance.volume = 1;
  globalThis.clearTimeout(speechTimer);
  synth.cancel();
  speechTimer = globalThis.setTimeout(() => synth.speak(utterance), 100);
};

export const getKanjiAudio = (item) =>
  (item.on[0] ?? item.kun[0]).replace(/[.-]/g, "");

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

const kanaRowDefinitions = japanese.flatMap((group) =>
  group.rows.map((row) => ({
    id: getRowId(group, row),
    value: getRowValue(group, row),
    group: group.group,
    row,
  })),
);

const kanjiDefinitions = kanji.map((group) => ({
  id: `kanji:${group.group}`,
  group,
}));

const rowIds = new Set(kanaRowDefinitions.map((row) => row.id));
const kanjiIds = new Set(kanjiDefinitions.map((item) => item.id));
const modeValues = new Set(Object.values(modes));
const scriptValues = new Set(Object.values(scripts));
const wordPromptValues = new Set(Object.values(wordPrompts));

const unitsByScript = {
  [scripts.hiragana]: kanaRowDefinitions
    .flatMap(({ row }) =>
      row.filter((item) => item.roumaji).map((item) => item.kana),
    )
    .toSorted((a, b) => b.length - a.length),
  [scripts.katakana]: kanaRowDefinitions
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
  const hasSelectedKanji = Array.isArray(settings.selectedKanji);
  const selectedKanji = hasSelectedKanji
    ? settings.selectedKanji.filter((item) => kanjiIds.has(item))
    : defaultSettings.selectedKanji;
  const migratedKanji =
    hasSelectedKanji &&
    !selectedKanji.length &&
    settings.selectedKanji.some((item) => item.startsWith("kanji:"))
      ? defaultSettings.selectedKanji
      : selectedKanji;
  const kanaScript = scriptValues.has(settings.kanaScript)
    ? settings.kanaScript
    : defaultSettings.kanaScript;
  const mode = modeValues.has(settings.mode)
    ? settings.mode
    : defaultSettings.mode;

  return {
    mode:
      kanaScript === scripts.kanji && mode === modes.words ? modes.learn : mode,
    kanaScript,
    shuffle:
      typeof settings.shuffle === "boolean"
        ? settings.shuffle
        : defaultSettings.shuffle,
    wordPrompt: wordPromptValues.has(settings.wordPrompt)
      ? settings.wordPrompt
      : defaultSettings.wordPrompt,
    selectedRows,
    selectedKanji: migratedKanji,
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

export const getInitialList = (selectedRows, kanaScript = scripts.hiragana) => {
  const selected = new Set(
    selectedRows ??
      (kanaScript === scripts.kanji
        ? defaultSettings.selectedKanji
        : defaultSettings.selectedRows),
  );

  if (kanaScript === scripts.kanji) {
    return [
      {
        title: "jlpt",
        label: "JLPT estimates",
        rows: kanji.map((group) => {
          const id = `kanji:${group.group}`;
          return {
            id,
            value: group.label,
            checked: selected.has(id),
          };
        }),
      },
    ];
  }

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
    kanaRowDefinitions.flatMap(({ id, row }) => {
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

  return kanaRowDefinitions.flatMap(({ id, row }) => {
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

const getKanjiItems = (list) => {
  const selectedLevels = new Set(getSelectedRows(list));
  return kanjiDefinitions.flatMap(({ id, group }) =>
    selectedLevels.has(id)
      ? group.items.map((item) =>
          Object.assign({}, item, {
            kind: "kanji",
            level: group.label,
            audio: getKanjiAudio(item),
          }),
        )
      : [],
  );
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
    kanaScript === scripts.kanji
      ? getKanjiItems(list)
      : mode === modes.words
        ? getWordItems(list, kanaScript)
        : getKanaItems(list, kanaScript);

  return (mode === modes.words && kanaScript !== scripts.kanji) || shouldShuffle
    ? shuffle(items)
    : items;
};
