import { expect, test } from "bun:test";

import { japanese } from "../constants/constantsV2";
import { getInitialList, getItemsToShow } from "./utilsV2";

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

test("builds one selector row for each kana row", () => {
  const list = getInitialList();
  const expectedRows = japanese.reduce(
    (count, group) => count + group.rows.length,
    0,
  );

  expect(list[0].title).toBe("gojuuon");
  expect(list[0].rows[0]).toEqual({ value: "a", checked: false });
  expect(list.flatMap((group) => group.rows)).toHaveLength(expectedRows);
});

test("keeps the standalone n selector distinct from the na row", () => {
  const gojuuonRows = getInitialList()[0].rows.map((row) => row.value);

  expect(gojuuonRows).toContain("n");
  expect(gojuuonRows).toContain("N");
  expect(new Set(gojuuonRows).size).toBe(gojuuonRows.length);
});

test("filters practice items by checked row", () => {
  const list = getInitialList();
  for (const group of list) {
    for (const row of group.rows) {
      row.checked = group.title === "gojuuon" && row.value === "a";
    }
  }

  const roumaji = getItemsToShow(list)
    .map((item) => item.roumaji)
    .toSorted();

  expect(roumaji).toEqual(["a", "e", "i", "o", "u"]);
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
