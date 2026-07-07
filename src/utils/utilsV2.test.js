import { expect, test } from "bun:test";

import { japanese } from "../constants/constantsV2";
import { getInitialList, getItemsToShow } from "./utilsV2";

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
