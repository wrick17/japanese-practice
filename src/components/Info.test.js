import { expect, test } from "bun:test";

import { getLearningGuide } from "./Info";

test("uses separate learning paths for Kana and Kanji", () => {
  expect(getLearningGuide(false).steps.map(({ label }) => label)).toEqual([
    "Learn",
    "Japanese to Romaji",
    "Romaji to Japanese",
    "Words",
  ]);
  expect(getLearningGuide(true).steps.map(({ label }) => label)).toEqual([
    "Learn",
    "Kanji to Reading",
    "Reading to Kanji",
  ]);
});
