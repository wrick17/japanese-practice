export const shortcutActions = Object.freeze({
  toggleAnswer: "toggle-answer",
  nextCard: "next-card",
  playSound: "play-sound",
  toggleAnnounce: "toggle-announce",
  openLegend: "open-legend",
});

export const keyboardShortcutLegend = Object.freeze([
  {
    key: "Space",
    action: shortcutActions.toggleAnswer,
    description: "Reveal or hide the answer outside Learn mode.",
  },
  {
    key: "Enter",
    action: shortcutActions.nextCard,
    description: "Move to the next card.",
  },
  {
    key: "P",
    action: shortcutActions.playSound,
    description: "Play the Japanese audio.",
  },
  {
    key: "A",
    action: shortcutActions.toggleAnnounce,
    description: "Start or stop announce mode.",
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

export const shouldIgnoreShortcutTarget = (target) => {
  if (!target) return false;
  if (target.isContentEditable) return true;

  const tagName = target.tagName?.toUpperCase();
  if (editableTags.has(tagName)) return true;

  return Boolean(
    target.closest?.(
      "button, summary, a, input, textarea, select, [role='button']",
    ),
  );
};

export const getKeyboardShortcutAction = (event) => {
  if (
    event.defaultPrevented ||
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    shouldIgnoreShortcutTarget(event.target)
  ) {
    return null;
  }

  if (event.key === "?" || (event.key === "/" && event.shiftKey)) {
    return shortcutActions.openLegend;
  }

  if (event.shiftKey) return null;

  switch (event.key.toLowerCase()) {
    case " ":
    case "spacebar":
      return shortcutActions.toggleAnswer;
    case "enter":
      return shortcutActions.nextCard;
    case "p":
      return shortcutActions.playSound;
    case "a":
      return shortcutActions.toggleAnnounce;
    default:
      return null;
  }
};
