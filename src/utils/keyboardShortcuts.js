export const shortcutActions = Object.freeze({
  toggleAnswer: "toggle-answer",
  previousCard: "previous-card",
  nextCard: "next-card",
  openLegend: "open-legend",
});

export const keyboardShortcutLegend = Object.freeze([
  {
    key: "Space",
    action: shortcutActions.toggleAnswer,
    description: "Reveal or hide the answer outside Learn mode.",
  },
  {
    key: "\u2190",
    action: shortcutActions.previousCard,
    description: "Move to the previous card.",
  },
  {
    key: "\u2192",
    action: shortcutActions.nextCard,
    description: "Move to the next card.",
  },
  {
    key: "Enter",
    action: shortcutActions.nextCard,
    description: "Move to the next card.",
  },
  {
    key: "?",
    action: shortcutActions.openLegend,
    description: "Open this shortcut legend.",
  },
  {
    key: "Esc",
    action: "close-popup",
    description: "Close the popup.",
  },
]);

const editableTags = new Set(["INPUT", "TEXTAREA", "SELECT"]);
const interactiveSelector =
  "button, summary, a, input, textarea, select, [role='button']";

const isEditableShortcutTarget = (target) => {
  if (!target) return false;
  if (target.isContentEditable) return true;
  return editableTags.has(target.tagName?.toUpperCase());
};

export const blurPointerActivatedControl = (event) => {
  if (event.detail <= 0) return;
  event.target.closest?.(interactiveSelector)?.blur();
};

export const shouldIgnoreShortcutTarget = (target) => {
  if (!target) return false;
  if (isEditableShortcutTarget(target)) return true;

  return Boolean(target.closest?.(interactiveSelector));
};

export const getKeyboardShortcutAction = (event) => {
  if (
    event.defaultPrevented ||
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    isEditableShortcutTarget(event.target)
  ) {
    return null;
  }

  const key = event.key.toLowerCase();
  if (!event.shiftKey && key === "arrowright") {
    return shortcutActions.nextCard;
  }
  if (!event.shiftKey && key === "arrowleft") {
    return shortcutActions.previousCard;
  }

  if (shouldIgnoreShortcutTarget(event.target)) return null;

  if (event.key === "?" || (event.key === "/" && event.shiftKey)) {
    return shortcutActions.openLegend;
  }

  if (event.shiftKey) return null;

  switch (key) {
    case " ":
    case "spacebar":
      return shortcutActions.toggleAnswer;
    case "enter":
      return shortcutActions.nextCard;
    default:
      return null;
  }
};
