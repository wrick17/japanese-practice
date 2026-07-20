import { expect, test } from "bun:test";

import { getJapaneseScriptLabel, getStudyFields } from "./ShowCase";
import { modes, wordPrompts } from "../utils/utilsV2";

test("builds the revealed Kana fields used by cards and reference popups", () => {
  expect(
    getStudyFields({ kind: "kana", japanese: "あ", roumaji: "a" }, modes.learn)
      .fields,
  ).toEqual([
    { label: "Romaji", value: "a(aa)", japanese: false },
    { label: "Japanese", value: "あ", japanese: true },
  ]);
});

test("builds the revealed Kanji fields used by cards and reference popups", () => {
  expect(
    getStudyFields(
      {
        kind: "kanji",
        japanese: "日",
        on: ["ニチ", "ジツ"],
        kun: ["ひ"],
        meanings: ["day", "sun"],
      },
      modes.learn,
    ).fields,
  ).toEqual([
    { label: "Kanji", value: "日", japanese: true },
    {
      label: "On-yomi",
      value: "ニチ・ジツ",
      japanese: true,
      multiline: true,
    },
    {
      label: "Kun-yomi",
      value: "ひ",
      japanese: true,
      multiline: true,
    },
    {
      label: "Meaning",
      value: "day, sun",
      japanese: false,
      multiline: true,
    },
  ]);
});

test("labels the answer script for non-Japanese prompts in mixed practice", () => {
  expect(getJapaneseScriptLabel("あア日")).toBe("Hiragana + Katakana + Kanji");
  expect(getJapaneseScriptLabel("アイスクリーム")).toBe("Katakana");
  expect(
    getStudyFields(
      { kind: "kana", japanese: "ア", roumaji: "a" },
      modes.romajiToKana,
      undefined,
      true,
    ).prompt.label,
  ).toBe("Romaji · Answer: Katakana");
  expect(
    getStudyFields(
      {
        kind: "word",
        japanese: "お茶",
        romaji: "ocha",
        english: "tea",
      },
      modes.words,
      wordPrompts.romaji,
      true,
    ).prompt.label,
  ).toBe("Romaji · Answer: Hiragana + Kanji");
});
