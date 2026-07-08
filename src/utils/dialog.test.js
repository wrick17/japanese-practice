import { expect, test } from "bun:test";

import { isOutsideDialog } from "./dialog";

const dialogClick = (clientX, clientY) => ({
  clientX,
  clientY,
  currentTarget: {
    getBoundingClientRect: () => ({
      bottom: 300,
      left: 100,
      right: 400,
      top: 100,
    }),
  },
});

test("detects clicks outside a dialog rectangle", () => {
  expect(isOutsideDialog(dialogClick(99, 150))).toBe(true);
  expect(isOutsideDialog(dialogClick(150, 99))).toBe(true);
  expect(isOutsideDialog(dialogClick(401, 150))).toBe(true);
  expect(isOutsideDialog(dialogClick(150, 301))).toBe(true);
  expect(isOutsideDialog(dialogClick(150, 150))).toBe(false);
});
