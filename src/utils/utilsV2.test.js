import { expect, test } from "bun:test";

import { japanese } from "../constants/constantsV2";
import { kanji, kanjiSource } from "../constants/kanjiV1";
import {
  clearSettings,
  defaultSettings,
  getDeck,
  getInitialList,
  getKanaRomajiDisplay,
  loadSettings,
  modes,
  normalizeSettings,
  saveSettings,
  scripts,
  shuffle,
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

const getSingleScriptDeck = ({ list, kanaScript, ...settings }) =>
  getDeck({
    ...settings,
    lists: { [kanaScript]: list },
    selectedScripts: [kanaScript],
  });

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

  const roumaji = getSingleScriptDeck({
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
  const deck = getSingleScriptDeck({
    list: getInitialList(["gojuuon:a"]),
    mode: modes.romajiToKana,
    kanaScript: scripts.hiragana,
    shuffle: false,
  });

  expect(deck.map((item) => item.roumaji)).toEqual(["a", "i", "u", "e", "o"]);
});

test("learn mode supports multiple selected rows", () => {
  const deck = getSingleScriptDeck({
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
  const deck = getSingleScriptDeck({
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
  });
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
    const forcedShuffle = getSingleScriptDeck({ ...args, shuffle: false }).map(
      (item) => item.japanese,
    );
    const explicitShuffle = getSingleScriptDeck({
      ...args,
      shuffle: true,
    }).map((item) => item.japanese);

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
  const deck = getSingleScriptDeck({
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
    selectedScripts: [scripts.hiragana, scripts.katakana],
    shuffle: true,
    selectedRows: {
      ...defaultSettings.selectedRows,
      [scripts.katakana]: ["gojuuon:a", "missing"],
    },
  };

  saveSettings(settings, storage);
  expect(loadSettings(storage)).toEqual({
    ...defaultSettings,
    mode: modes.learn,
    selectedScripts: [scripts.hiragana, scripts.katakana],
    shuffle: true,
    selectedRows: {
      ...defaultSettings.selectedRows,
      [scripts.katakana]: ["gojuuon:a"],
    },
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
    mode: modes.words,
    kanaScript: scripts.kanji,
    selectedKanji: ["kanji:n5"],
  });

  expect(savedKana.selectedScripts).toEqual([scripts.hiragana]);
  expect(savedKana.selectedRows).toEqual(defaultSettings.selectedRows);
  expect(savedKanji.selectedScripts).toEqual([scripts.kanji]);
  expect(savedKanji.mode).toBe(modes.learn);
  expect(
    normalizeSettings({
      kanaScript: scripts.kanji,
      selectedKanji: ["kanji:numbers:一"],
    }).selectedRows.kanji,
  ).toEqual(defaultSettings.selectedRows.kanji);
  expect(
    normalizeSettings({ kanaScript: scripts.kanji, selectedKanji: [] })
      .selectedRows.kanji,
  ).toEqual([]);
});

test("combines independently selected rows across scripts", () => {
  const deck = getDeck({
    lists: {
      [scripts.hiragana]: getInitialList(["gojuuon:a"]),
      [scripts.katakana]: getInitialList(["gojuuon:k"], scripts.katakana),
      [scripts.kanji]: getInitialList(["kanji:n5"], scripts.kanji),
    },
    mode: modes.learn,
    selectedScripts: Object.values(scripts),
    shuffle: false,
  });

  expect(deck.slice(0, 10).map((item) => item.japanese)).toEqual([
    "あ",
    "い",
    "う",
    "え",
    "お",
    "カ",
    "キ",
    "ク",
    "ケ",
    "コ",
  ]);
  expect(deck).toHaveLength(5 + 5 + 80);
  expect(deck.at(-1).kind).toBe("kanji");
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
  const deck = getSingleScriptDeck({
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

  const deck = getSingleScriptDeck({
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

test("word mode combines selected kana scripts and skips Kanji", () => {
  const lists = Object.fromEntries(
    Object.values(scripts).map((script) => [
      script,
      getInitialList(undefined, script),
    ]),
  );
  for (const script of [scripts.hiragana, scripts.katakana]) {
    for (const group of lists[script]) {
      for (const row of group.rows) row.checked = true;
    }
  }

  const deck = getDeck({
    lists,
    mode: modes.words,
    selectedScripts: Object.values(scripts),
    shuffle: false,
  });

  expect(new Set(deck.map((word) => word.script))).toEqual(
    new Set([scripts.hiragana, scripts.katakana]),
  );
  expect(deck.every((word) => word.kind === "word")).toBe(true);
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
