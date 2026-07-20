import { expect, test } from "bun:test";

import { japanese } from "../constants/constantsV2";
import { kanji, kanjiSource } from "../constants/kanjiV1";
import {
  clearSettings,
  defaultSettings,
  getDeck,
  getInitialList,
  getKanjiAudio,
  getKanaRomajiDisplay,
  needsNativeSpeechAudio,
  loadSettings,
  modes,
  normalizeSettings,
  saveSettings,
  scripts,
  shuffle,
  speak,
  STORAGE_KEY,
  wordPrompts,
} from "./utilsV2";

const expectedCoreKana = new Map([
  ["あ", { kanaK: "ア", roumaji: "a" }],
  ["い", { kanaK: "イ", roumaji: "i" }],
  ["う", { kanaK: "ウ", roumaji: "u" }],
  ["え", { kanaK: "エ", roumaji: "e" }],
  ["お", { kanaK: "オ", roumaji: "o" }],
  ["か", { kanaK: "カ", roumaji: "ka" }],
  ["き", { kanaK: "キ", roumaji: "ki" }],
  ["く", { kanaK: "ク", roumaji: "ku" }],
  ["け", { kanaK: "ケ", roumaji: "ke" }],
  ["こ", { kanaK: "コ", roumaji: "ko" }],
  ["さ", { kanaK: "サ", roumaji: "sa" }],
  ["し", { kanaK: "シ", roumaji: "shi" }],
  ["す", { kanaK: "ス", roumaji: "su" }],
  ["せ", { kanaK: "セ", roumaji: "se" }],
  ["そ", { kanaK: "ソ", roumaji: "so" }],
  ["た", { kanaK: "タ", roumaji: "ta" }],
  ["ち", { kanaK: "チ", roumaji: "chi" }],
  ["つ", { kanaK: "ツ", roumaji: "tsu" }],
  ["て", { kanaK: "テ", roumaji: "te" }],
  ["と", { kanaK: "ト", roumaji: "to" }],
  ["な", { kanaK: "ナ", roumaji: "na" }],
  ["に", { kanaK: "ニ", roumaji: "ni" }],
  ["ぬ", { kanaK: "ヌ", roumaji: "nu" }],
  ["ね", { kanaK: "ネ", roumaji: "ne" }],
  ["の", { kanaK: "ノ", roumaji: "no" }],
  ["は", { kanaK: "ハ", roumaji: "ha" }],
  ["ひ", { kanaK: "ヒ", roumaji: "hi" }],
  ["ふ", { kanaK: "フ", roumaji: "fu" }],
  ["へ", { kanaK: "ヘ", roumaji: "he" }],
  ["ほ", { kanaK: "ホ", roumaji: "ho" }],
  ["ま", { kanaK: "マ", roumaji: "ma" }],
  ["み", { kanaK: "ミ", roumaji: "mi" }],
  ["む", { kanaK: "ム", roumaji: "mu" }],
  ["め", { kanaK: "メ", roumaji: "me" }],
  ["も", { kanaK: "モ", roumaji: "mo" }],
  ["や", { kanaK: "ヤ", roumaji: "ya" }],
  ["ゆ", { kanaK: "ユ", roumaji: "yu" }],
  ["よ", { kanaK: "ヨ", roumaji: "yo" }],
  ["ら", { kanaK: "ラ", roumaji: "ra" }],
  ["り", { kanaK: "リ", roumaji: "ri" }],
  ["る", { kanaK: "ル", roumaji: "ru" }],
  ["れ", { kanaK: "レ", roumaji: "re" }],
  ["ろ", { kanaK: "ロ", roumaji: "ro" }],
  ["わ", { kanaK: "ワ", roumaji: "wa" }],
  ["を", { kanaK: "ヲ", roumaji: "wo" }],
  ["ん", { kanaK: "ン", roumaji: "n" }],
  ["が", { kanaK: "ガ", roumaji: "ga" }],
  ["ぎ", { kanaK: "ギ", roumaji: "gi" }],
  ["ぐ", { kanaK: "グ", roumaji: "gu" }],
  ["げ", { kanaK: "ゲ", roumaji: "ge" }],
  ["ご", { kanaK: "ゴ", roumaji: "go" }],
  ["ざ", { kanaK: "ザ", roumaji: "za" }],
  ["じ", { kanaK: "ジ", roumaji: "ji" }],
  ["ず", { kanaK: "ズ", roumaji: "zu" }],
  ["ぜ", { kanaK: "ゼ", roumaji: "ze" }],
  ["ぞ", { kanaK: "ゾ", roumaji: "zo" }],
  ["だ", { kanaK: "ダ", roumaji: "da" }],
  ["ぢ", { kanaK: "ヂ", roumaji: "ji" }],
  ["づ", { kanaK: "ヅ", roumaji: "zu" }],
  ["で", { kanaK: "デ", roumaji: "de" }],
  ["ど", { kanaK: "ド", roumaji: "do" }],
  ["ば", { kanaK: "バ", roumaji: "ba" }],
  ["び", { kanaK: "ビ", roumaji: "bi" }],
  ["ぶ", { kanaK: "ブ", roumaji: "bu" }],
  ["べ", { kanaK: "ベ", roumaji: "be" }],
  ["ぼ", { kanaK: "ボ", roumaji: "bo" }],
  ["ぱ", { kanaK: "パ", roumaji: "pa" }],
  ["ぴ", { kanaK: "ピ", roumaji: "pi" }],
  ["ぷ", { kanaK: "プ", roumaji: "pu" }],
  ["ぺ", { kanaK: "ペ", roumaji: "pe" }],
  ["ぽ", { kanaK: "ポ", roumaji: "po" }],
  ["きゃ", { kanaK: "キャ", roumaji: "kya" }],
  ["きゅ", { kanaK: "キュ", roumaji: "kyu" }],
  ["きょ", { kanaK: "キョ", roumaji: "kyo" }],
  ["しゃ", { kanaK: "シャ", roumaji: "sha" }],
  ["しゅ", { kanaK: "シュ", roumaji: "shu" }],
  ["しょ", { kanaK: "ショ", roumaji: "sho" }],
  ["ちゃ", { kanaK: "チャ", roumaji: "cha" }],
  ["ちゅ", { kanaK: "チュ", roumaji: "chu" }],
  ["ちょ", { kanaK: "チョ", roumaji: "cho" }],
  ["にゃ", { kanaK: "ニャ", roumaji: "nya" }],
  ["にゅ", { kanaK: "ニュ", roumaji: "nyu" }],
  ["にょ", { kanaK: "ニョ", roumaji: "nyo" }],
  ["ひゃ", { kanaK: "ヒャ", roumaji: "hya" }],
  ["ひゅ", { kanaK: "ヒュ", roumaji: "hyu" }],
  ["ひょ", { kanaK: "ヒョ", roumaji: "hyo" }],
  ["みゃ", { kanaK: "ミャ", roumaji: "mya" }],
  ["みゅ", { kanaK: "ミュ", roumaji: "myu" }],
  ["みょ", { kanaK: "ミョ", roumaji: "myo" }],
  ["りゃ", { kanaK: "リャ", roumaji: "rya" }],
  ["りゅ", { kanaK: "リュ", roumaji: "ryu" }],
  ["りょ", { kanaK: "リョ", roumaji: "ryo" }],
  ["ぎゃ", { kanaK: "ギャ", roumaji: "gya" }],
  ["ぎゅ", { kanaK: "ギュ", roumaji: "gyu" }],
  ["ぎょ", { kanaK: "ギョ", roumaji: "gyo" }],
  ["じゃ", { kanaK: "ジャ", roumaji: "ja" }],
  ["じゅ", { kanaK: "ジュ", roumaji: "ju" }],
  ["じょ", { kanaK: "ジョ", roumaji: "jo" }],
  ["びゃ", { kanaK: "ビャ", roumaji: "bya" }],
  ["びゅ", { kanaK: "ビュ", roumaji: "byu" }],
  ["びょ", { kanaK: "ビョ", roumaji: "byo" }],
  ["ぴゃ", { kanaK: "ピャ", roumaji: "pya" }],
  ["ぴゅ", { kanaK: "ピュ", roumaji: "pyu" }],
  ["ぴょ", { kanaK: "ピョ", roumaji: "pyo" }],
]);

const getKanaItems = () =>
  japanese.flatMap((group) =>
    group.rows.flatMap((row) =>
      row
        .filter((item) => item.roumaji)
        .map((item) => ({
          kana: item.kana,
          kanaK: item.kanaK,
          roumaji: item.roumaji,
          type: item.type,
          expectedType: group.group,
        })),
    ),
  );

const countBy = (items, key) =>
  items.filter((item) => item.kanaK === key).length;

const createStorage = (initial = {}) => {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, value),
    removeItem: (key) => store.delete(key),
  };
};

test("builds one selector row for each kana row", () => {
  const list = getInitialList();
  const expectedRows = japanese.reduce(
    (count, group) => count + group.rows.length,
    0,
  );

  expect(list[0].title).toBe("gojuuon");
  expect(list[0].rows[0]).toEqual({
    id: "gojuuon:a",
    value: "a",
    checked: true,
  });
  expect(list.flatMap((group) => group.rows)).toHaveLength(expectedRows);
});

test("builds JLPT-estimate Kanji selectors with N5 selected", () => {
  const list = getInitialList(undefined, scripts.kanji);

  expect(list).toHaveLength(1);
  expect(list[0].label).toBe("JLPT estimates");
  expect(
    list[0].rows.map(({ value, checked }) => ({ value, checked })),
  ).toEqual([
    { value: "N5", checked: true },
    { value: "N4", checked: false },
    { value: "N3", checked: false },
    { value: "N2", checked: false },
    { value: "N1", checked: false },
  ]);
});

test("keeps the standalone n selector distinct from the na row", () => {
  const gojuuonRows = getInitialList()[0].rows.map((row) => row.value);

  expect(gojuuonRows).toContain("n");
  expect(gojuuonRows).toContain("N");
  expect(new Set(gojuuonRows).size).toBe(gojuuonRows.length);
});

test("filters practice items by checked row", () => {
  const list = getInitialList([]);
  for (const group of list) {
    for (const row of group.rows) {
      row.checked = group.title === "gojuuon" && row.value === "a";
    }
  }

  const roumaji = getDeck({
    list,
    mode: modes.romajiToKana,
    kanaScript: scripts.hiragana,
    shuffle: false,
  })
    .map((item) => item.roumaji)
    .toSorted();

  expect(roumaji).toEqual(["a", "e", "i", "o", "u"]);
});

test("uses sequential kana order when shuffle is off", () => {
  const deck = getDeck({
    list: getInitialList(["gojuuon:a"]),
    mode: modes.romajiToKana,
    kanaScript: scripts.hiragana,
    shuffle: false,
  });

  expect(deck.map((item) => item.roumaji)).toEqual(["a", "i", "u", "e", "o"]);
});

test("learn mode supports multiple selected rows", () => {
  const deck = getDeck({
    list: getInitialList(["gojuuon:a", "gojuuon:k"]),
    mode: modes.learn,
    kanaScript: scripts.hiragana,
    shuffle: false,
  });

  expect(deck.map((item) => item.roumaji)).toEqual([
    "a",
    "i",
    "u",
    "e",
    "o",
    "ka",
    "ki",
    "ku",
    "ke",
    "ko",
  ]);
});

test("builds a complete Kanji deck from selected JLPT estimates", () => {
  const selectedKanji = ["kanji:n5", "kanji:n4"];
  const deck = getDeck({
    list: getInitialList(selectedKanji, scripts.kanji),
    mode: modes.learn,
    kanaScript: scripts.kanji,
    shuffle: false,
  });

  expect(deck).toHaveLength(80 + 166);
  expect(new Set(deck.map((item) => item.level))).toEqual(
    new Set(["N5", "N4"]),
  );
  expect(deck.find((item) => item.japanese === "一")).toMatchObject({
    on: ["イチ", "イツ"],
    kun: ["ひと-", "ひと.つ"],
    meanings: ["one", "one radical (no.1)"],
    kind: "kanji",
    level: "N5",
    audio: "イチ",
  });
});

test("speaks single characters immediately at a slower rate", () => {
  const originalSpeechSynthesis = globalThis.speechSynthesis;
  const OriginalUtterance = globalThis.SpeechSynthesisUtterance;
  const events = [];

  globalThis.speechSynthesis = {
    getVoices: () => [{ lang: "ja-JP" }],
    speak: (utterance) =>
      events.push(
        `speak:${utterance.text}:${utterance.rate}:${utterance.voice.lang}`,
      ),
  };
  globalThis.SpeechSynthesisUtterance = function (text) {
    this.text = text;
  };

  try {
    speak("な");
    expect(events).toEqual(["speak:な:0.1:ja-JP"]);
  } finally {
    if (originalSpeechSynthesis === undefined) {
      delete globalThis.speechSynthesis;
    } else {
      globalThis.speechSynthesis = originalSpeechSynthesis;
    }
    if (OriginalUtterance === undefined) {
      delete globalThis.SpeechSynthesisUtterance;
    } else {
      globalThis.SpeechSynthesisUtterance = OriginalUtterance;
    }
  }
});

test("uses native media audio for Safari 27 on iPhone", () => {
  const originalAudio = globalThis.Audio;
  const originalNavigator = globalThis.navigator;
  const events = [];

  globalThis.navigator = {
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/27.0 Mobile/15E148 Safari/604.1",
  };
  globalThis.Audio = function (source) {
    this.source = source;
    this.pause = () => events.push("pause");
    this.play = () => {
      events.push(`play:${this.source}:${this.playbackRate}`);
      return Promise.resolve();
    };
  };

  try {
    expect(needsNativeSpeechAudio(globalThis.navigator.userAgent)).toBe(true);
    speak("な");
    expect(events).toEqual(["play:/api/tts?v=5&text=%E3%81%AA:0.75"]);
  } finally {
    globalThis.Audio = originalAudio;
    globalThis.navigator = originalNavigator;
  }
});

test("does not use the native media fallback on earlier Safari versions", () => {
  expect(
    needsNativeSpeechAudio(
      "Mozilla/5.0 (iPhone) Version/26.0 Mobile/15E148 Safari/604.1",
    ),
  ).toBe(false);
});

test("keeps longer readings at the normal reduced speech rate", () => {
  const originalSpeechSynthesis = globalThis.speechSynthesis;
  const OriginalUtterance = globalThis.SpeechSynthesisUtterance;
  const originalSetTimeout = globalThis.setTimeout;
  let utterance;

  globalThis.speechSynthesis = {
    cancel: () => {},
    getVoices: () => [],
    speak: (value) => {
      utterance = value;
    },
  };
  globalThis.SpeechSynthesisUtterance = function (text) {
    this.text = text;
  };
  globalThis.setTimeout = (callback) => callback();

  try {
    speak("かな");
    expect(utterance.rate).toBe(0.25);
  } finally {
    globalThis.speechSynthesis = originalSpeechSynthesis;
    globalThis.SpeechSynthesisUtterance = OriginalUtterance;
    globalThis.setTimeout = originalSetTimeout;
  }
});

test("uses one clean primary Kanji reading for speech", () => {
  expect(getKanjiAudio({ on: ["-ノウ"], kun: [] })).toBe("ノウ");
  expect(getKanjiAudio({ on: [], kun: ["こ.む"] })).toBe("こむ");
});

test("keeps kana romaji beside its pronunciation cue", () => {
  expect(
    ["a", "i", "u", "e", "o", "ka", "shi", "tsu", "kya", "wo", "n"].map(
      getKanaRomajiDisplay,
    ),
  ).toEqual([
    "a(aa)",
    "i(ee)",
    "u(oo)",
    "e(eh)",
    "o(oh)",
    "ka(kaa)",
    "shi(shee)",
    "tsu(tsoo)",
    "kya(kyaa)",
    "wo(oh)",
    "n",
  ]);
});

test("leaves input untouched when shuffling", () => {
  const input = ["a", "i", "u", "e", "o"];
  const output = shuffle(input);

  expect(input).toEqual(["a", "i", "u", "e", "o"]);
  expect(output.toSorted()).toEqual(input.toSorted());
});

test("always shuffles word decks", () => {
  const originalRandom = Math.random;
  Math.random = () => 0;

  try {
    const args = {
      list: getInitialList(["gojuuon:a"]),
      mode: modes.words,
      kanaScript: scripts.hiragana,
    };
    const forcedShuffle = getDeck({ ...args, shuffle: false }).map(
      (item) => item.japanese,
    );
    const explicitShuffle = getDeck({ ...args, shuffle: true }).map(
      (item) => item.japanese,
    );

    expect(forcedShuffle.length).toBeGreaterThan(1);
    expect(forcedShuffle).toEqual(explicitShuffle);
  } finally {
    Math.random = originalRandom;
  }
});

test("defaults word prompts to romaji", () => {
  expect(defaultSettings.wordPrompt).toBe(wordPrompts.romaji);
  expect(loadSettings(createStorage()).wordPrompt).toBe(wordPrompts.romaji);
});

test("uses the beginner mode order and defaults to learn", () => {
  expect(Object.values(modes)).toEqual([
    modes.learn,
    modes.kanaToRomaji,
    modes.romajiToKana,
    modes.words,
  ]);
  expect(defaultSettings.mode).toBe(modes.learn);
  expect(loadSettings(createStorage()).mode).toBe(modes.learn);
});

test("returns no cards when no rows are selected", () => {
  const deck = getDeck({
    list: getInitialList([]),
    mode: modes.romajiToKana,
    kanaScript: scripts.hiragana,
    shuffle: false,
  });

  expect(deck).toEqual([]);
});

test("loads, saves, and clears local settings", () => {
  const storage = createStorage();
  const settings = {
    mode: modes.learn,
    kanaScript: scripts.katakana,
    shuffle: true,
    selectedRows: ["gojuuon:a", "missing"],
  };

  saveSettings(settings, storage);
  expect(loadSettings(storage)).toEqual({
    ...defaultSettings,
    mode: modes.learn,
    kanaScript: scripts.katakana,
    shuffle: true,
    selectedRows: ["gojuuon:a"],
  });

  clearSettings(storage);
  expect(storage.getItem(STORAGE_KEY)).toBeNull();
});

test("migrates saved kana settings and rejects Words mode for Kanji", () => {
  const savedKana = normalizeSettings({
    mode: modes.learn,
    kanaScript: scripts.hiragana,
    selectedRows: ["gojuuon:a"],
  });
  const savedKanji = normalizeSettings({
    ...savedKana,
    mode: modes.words,
    kanaScript: scripts.kanji,
  });

  expect(savedKana.selectedKanji).toEqual(defaultSettings.selectedKanji);
  expect(savedKanji.mode).toBe(modes.learn);
  expect(
    normalizeSettings({ selectedKanji: ["kanji:numbers:一"] }).selectedKanji,
  ).toEqual(defaultSettings.selectedKanji);
  expect(normalizeSettings({ selectedKanji: [] }).selectedKanji).toEqual([]);
});

test("JLPT-estimate Kanji data has unique, complete N5-N1 cards", () => {
  const items = kanji.flatMap((group) => group.items);

  expect(kanjiSource.levels.commit).toBe(
    "00fd7079c3890f430759536f91aa5e854ec0ca4f",
  );
  expect(kanjiSource.kanjidic).toMatchObject({
    name: "KANJIDIC2",
    url: "https://www.edrdg.org/kanjidic/kanjidic2.xml.gz",
    projectUrl: "https://www.edrdg.org/wiki/KANJIDIC_Project.html",
    licenseUrl: "https://www.edrdg.org/edrdg/licence.html",
  });
  expect(kanjiSource.kanjidic.databaseVersion).toMatch(/^\d{4}-\d+$/);
  expect(kanjiSource.kanjidic.dateOfCreation).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(kanjiSource.kanjidic.gzipSha256).toMatch(/^[\da-f]{64}$/);
  expect(kanji.map((group) => group.items.length)).toEqual([
    80, 166, 367, 373, 1244,
  ]);
  expect(kanjiSource.levels.nullFallback).toMatchObject({
    oldField: "jlpt_old",
    oldToNew: { 1: 1, 2: 2, 3: 4, 4: 5 },
  });
  expect(kanjiSource.levels.nullFallback.characters).toHaveLength(19);
  expect(items).toHaveLength(2230);
  expect(new Set(items.map((item) => item.japanese)).size).toBe(items.length);
  for (const item of items) {
    expect(item.japanese).toMatch(/^\p{Script=Han}$/u);
    expect(item.on.length + item.kun.length).toBeGreaterThan(0);
    expect(item.meanings.length).toBeGreaterThan(0);
    expect(getKanjiAudio(item)).toMatch(
      /^[\p{Script=Hiragana}\p{Script=Katakana}ー]+$/u,
    );
    expect(new Set(item.on).size).toBe(item.on.length);
    expect(new Set(item.kun).size).toBe(item.kun.length);
    expect(new Set(item.meanings).size).toBe(item.meanings.length);
    for (const value of [...item.on, ...item.kun, ...item.meanings]) {
      expect(value.length).toBeGreaterThan(0);
      expect(value).toBe(value.trim());
      expect(value).toBe(value.normalize("NFC"));
    }
  }
});

test("fills missing new-JLPT estimates from the legacy level mapping", () => {
  const levelByCharacter = new Map(
    kanji.flatMap((group) =>
      group.items.map((item) => [item.japanese, group.label]),
    ),
  );

  expect(levelByCharacter.get("分")).toBe("N5");
  expect(levelByCharacter.get("的")).toBe("N2");
  expect(levelByCharacter.get("里")).toBe("N1");
});

test("includes corrections from the recorded official KANJIDIC2 snapshot", () => {
  const items = new Map(
    kanji.flatMap((group) => group.items.map((item) => [item.japanese, item])),
  );

  expect(items.get("八").on).toContain("ハツ");
  expect(items.get("十").kun).toContain("そ");
  expect(items.get("実").meanings).toEqual(
    expect.arrayContaining(["seed", "fruit", "nut"]),
  );
  expect(items.get("乾").meanings).toContain("desiccate");
  expect(items.get("仰").meanings).toContain("revere");
  expect(items.get("檀").meanings).toContain("sandalwood");
  expect(items.get("打").on).toContain("ダース");
  expect(items.get("王").on).toContain("-ノウ");
});

test("falls back to defaults for corrupt settings", () => {
  const storage = createStorage({ [STORAGE_KEY]: "{" });

  expect(loadSettings(storage)).toEqual(defaultSettings);
});

test("filters hiragana words strictly by selected rows", () => {
  const deck = getDeck({
    list: getInitialList(["gojuuon:a"]),
    mode: modes.words,
    kanaScript: scripts.hiragana,
    shuffle: false,
  });

  expect(deck.length).toBeGreaterThan(0);
  expect(deck.some((word) => word.japanese === "あい")).toBe(true);
  for (const word of deck) {
    expect(/^[あいうえお]+$/.test(word.japanese)).toBe(true);
  }
});

test("katakana word mode uses real katakana words", () => {
  const list = getInitialList();
  for (const group of list) {
    for (const row of group.rows) {
      row.checked = true;
    }
  }

  const deck = getDeck({
    list,
    mode: modes.words,
    kanaScript: scripts.katakana,
    shuffle: false,
  });

  expect(deck.length).toBeGreaterThan(0);
  for (const word of deck) {
    expect(word.script).toBe(scripts.katakana);
    expect(/^[\u30A1-\u30FA\u30FD-\u30FF]+$/.test(word.japanese)).toBe(true);
  }
});

test("core kana table uses accurate katakana and romaji", () => {
  const items = getKanaItems();
  const seen = new Set();

  expect(items).toHaveLength(expectedCoreKana.size);

  for (const item of items) {
    const expected = expectedCoreKana.get(item.kana);
    if (!expected) {
      throw new Error(`Unexpected kana: ${item.kana}`);
    }

    expect(item.kanaK).toBe(expected.kanaK);
    expect(item.roumaji).toBe(expected.roumaji);
    seen.add(item.kana);
  }

  expect(seen.size).toBe(expectedCoreKana.size);
});

test("filled kana entries include required fields", () => {
  for (const item of getKanaItems()) {
    expect(typeof item.kana).toBe("string");
    expect(typeof item.kanaK).toBe("string");
    expect(typeof item.roumaji).toBe("string");
    expect(item.type).toBe(item.expectedType);
  }
});

test("distinguishes common ji and zu katakana from di and du kana", () => {
  const items = getKanaItems();

  expect(countBy(items, "ジ")).toBe(1);
  expect(countBy(items, "ズ")).toBe(1);
  expect(countBy(items, "ヂ")).toBe(1);
  expect(countBy(items, "ヅ")).toBe(1);
  expect(items.find((item) => item.kana === "じ").kanaK).toBe("ジ");
  expect(items.find((item) => item.kana === "ず").kanaK).toBe("ズ");
  expect(items.find((item) => item.kana === "ぢ").kanaK).toBe("ヂ");
  expect(items.find((item) => item.kana === "づ").kanaK).toBe("ヅ");
});
