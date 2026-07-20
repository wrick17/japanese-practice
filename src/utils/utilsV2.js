import wordsData from "../constants/wordsV2.json";
import { japanese } from "../constants/constantsV2";
import { kanji } from "../constants/kanjiV1";

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
  selectedScripts: [scripts.hiragana],
  shuffle: false,
  wordPrompt: wordPrompts.romaji,
  selectedRows: {
    [scripts.hiragana]: ["gojuuon:a"],
    [scripts.katakana]: ["gojuuon:a"],
    [scripts.kanji]: ["kanji:n5"],
  },
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
  const legacyScript = scriptValues.has(settings.kanaScript)
    ? settings.kanaScript
    : scripts.hiragana;
  const selectedScripts = Array.isArray(settings.selectedScripts)
    ? [
        ...new Set(
          settings.selectedScripts.filter((script) => scriptValues.has(script)),
        ),
      ]
    : [legacyScript];
  const safeScripts = selectedScripts.length
    ? selectedScripts
    : defaultSettings.selectedScripts;
  const legacyRows = Array.isArray(settings.selectedRows)
    ? settings.selectedRows
    : null;
  const legacyKanji = Array.isArray(settings.selectedKanji)
    ? settings.selectedKanji
    : null;
  const selectedRows = Object.fromEntries(
    Object.values(scripts).map((script) => {
      const ids = script === scripts.kanji ? kanjiIds : rowIds;
      const saved = Array.isArray(settings.selectedRows?.[script])
        ? settings.selectedRows[script]
        : script === legacyScript
          ? script === scripts.kanji
            ? legacyKanji
            : legacyRows
          : null;
      const filtered = saved?.filter((row) => ids.has(row));
      return [
        script,
        saved
          ? script === scripts.kanji &&
            saved === legacyKanji &&
            !filtered.length &&
            saved.some((row) => row.startsWith("kanji:"))
            ? defaultSettings.selectedRows[script]
            : filtered
          : defaultSettings.selectedRows[script],
      ];
    }),
  );
  const mode = modeValues.has(settings.mode)
    ? settings.mode
    : defaultSettings.mode;

  return {
    mode:
      safeScripts.every((script) => script === scripts.kanji) &&
      mode === modes.words
        ? modes.learn
        : mode,
    selectedScripts: safeScripts,
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

export const getInitialList = (selectedRows, kanaScript = scripts.hiragana) => {
  const selected = new Set(
    selectedRows ?? defaultSettings.selectedRows[kanaScript],
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

export const getDeck = ({
  lists,
  mode,
  selectedScripts,
  shuffle: shouldShuffle,
}) => {
  const items = selectedScripts.flatMap((script) => {
    const list = lists[script];
    if (script === scripts.kanji) {
      return mode === modes.words ? [] : getKanjiItems(list);
    }
    return mode === modes.words
      ? getWordItems(list, script)
      : getKanaItems(list, script);
  });

  return mode === modes.words || shouldShuffle ? shuffle(items) : items;
};
