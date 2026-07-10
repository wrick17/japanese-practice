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
  expect(getKeyboardShortcutAction(eventFor("p"))).toBe(
    shortcutActions.playSound,
  );
  expect(getKeyboardShortcutAction(eventFor("A"))).toBe(
    shortcutActions.toggleAnnounce,
  );
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
    shouldIgnoreShortcutTarget({
      closest: () => null,
      isContentEditable: false,
      tagName: "input",
    }),
  ).toBe(true);
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
    "Enter",
    "P",
    "A",
    "?",
    "Esc",
  ]);
});
