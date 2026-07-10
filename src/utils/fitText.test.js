import { expect, test } from "bun:test";

import { fitText } from "./fitText";

test("uses the largest font size that fits both dimensions", () => {
  const container = { clientHeight: 40, clientWidth: 100 };
  let fontSize = 0;
  const text = {
    style: {
      set fontSize(value) {
        fontSize = Number.parseInt(value, 10);
      },
    },
    get scrollHeight() {
      return fontSize;
    },
    get scrollWidth() {
      return fontSize * 3;
    },
  };

  expect(fitText(container, text)).toBe(33);
  expect(fontSize).toBe(33);
  expect(fitText(container, text, 24)).toBe(24);
});
