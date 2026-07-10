import { expect, test } from "bun:test";

import { getStudyFields } from "./ShowCase";
import { modes } from "../utils/utilsV2";

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
