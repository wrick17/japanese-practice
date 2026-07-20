import { expect, test } from "bun:test";

import {
  blurPointerActivatedControl,
  getKeyboardShortcutAction,
  keyboardShortcutLegend,
  shortcutActions,
  shouldIgnoreShortcutTarget,
} from "./keyboardShortcuts";

const eventFor = (key, overrides = {}) => ({
  altKey: false,
  ctrlKey: false,
  defaultPrevented: false,
  key,
  metaKey: false,
  shiftKey: false,
  target: null,
  ...overrides,
});

test("maps keyboard shortcuts to practice actions", () => {
  expect(getKeyboardShortcutAction(eventFor(" "))).toBe(
    shortcutActions.toggleAnswer,
  );
  expect(getKeyboardShortcutAction(eventFor("Enter"))).toBe(
    shortcutActions.nextCard,
  );
  expect(getKeyboardShortcutAction(eventFor("ArrowLeft"))).toBe(
    shortcutActions.previousCard,
  );
  expect(getKeyboardShortcutAction(eventFor("ArrowRight"))).toBe(
    shortcutActions.nextCard,
  );
  expect(getKeyboardShortcutAction(eventFor("p"))).toBeNull();
  expect(getKeyboardShortcutAction(eventFor("A"))).toBeNull();
  expect(getKeyboardShortcutAction(eventFor("?"))).toBe(
    shortcutActions.openLegend,
  );
});

test("allows shift slash to open the shortcut legend", () => {
  expect(getKeyboardShortcutAction(eventFor("/", { shiftKey: true }))).toBe(
    shortcutActions.openLegend,
  );
});

test("ignores shortcuts from modified and interactive events", () => {
  const buttonChild = {
    closest: () => ({}),
    isContentEditable: false,
    tagName: "SPAN",
  };

  expect(
    getKeyboardShortcutAction(eventFor("p", { ctrlKey: true })),
  ).toBeNull();
  expect(
    getKeyboardShortcutAction(eventFor("p", { target: buttonChild })),
  ).toBeNull();
  expect(
    getKeyboardShortcutAction(eventFor("ArrowRight", { target: buttonChild })),
  ).toBe(shortcutActions.nextCard);
  expect(
    shouldIgnoreShortcutTarget({
      closest: () => null,
      isContentEditable: false,
      tagName: "input",
    }),
  ).toBe(true);
  expect(
    getKeyboardShortcutAction(
      eventFor("ArrowLeft", {
        target: {
          closest: () => null,
          isContentEditable: false,
          tagName: "input",
        },
      }),
    ),
  ).toBeNull();
});

test("releases pointer focus but preserves keyboard-focused controls", () => {
  let blurCount = 0;
  const target = {
    closest: () => ({ blur: () => blurCount++ }),
  };

  blurPointerActivatedControl({ detail: 1, target });
  expect(blurCount).toBe(1);

  blurPointerActivatedControl({ detail: 0, target });
  expect(blurCount).toBe(1);
});

test("documents each handled shortcut in the legend", () => {
  expect(keyboardShortcutLegend.map((shortcut) => shortcut.key)).toEqual([
    "Space",
    "\u2190",
    "\u2192",
    "Enter",
    "?",
    "Esc",
  ]);
});
