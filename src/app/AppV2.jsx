import { useCallback, useEffect, useRef, useState } from "react";
import { CheatSheetV2 } from "../components/CheatSheetV2";
import { Info } from "../components/Info";
import { SelectorV2 } from "../components/SelectorV2";
import { ShowCase } from "../components/ShowCase";
import { useJapanese } from "../hooks/hooks";
import {
  blurPointerActivatedControl,
  getKeyboardShortcutAction,
  keyboardShortcutLegend,
  shortcutActions,
} from "../utils/keyboardShortcuts";
import { isOutsideDialog } from "../utils/dialog";
import { modes, scripts, speak, wordPrompts } from "../utils/utilsV2";

import "./App.css";

const modeLabels = {
  [modes.romajiToKana]: "Romaji to Japanese",
  [modes.kanaToRomaji]: "Japanese to Romaji",
  [modes.learn]: "Learn",
  [modes.words]: "Words",
};

const scriptLabels = {
  [scripts.hiragana]: "Hiragana",
  [scripts.katakana]: "Katakana",
  [scripts.kanji]: "Kanji",
};

const wordPromptLabels = {
  [wordPrompts.japanese]: "Japanese",
  [wordPrompts.romaji]: "Romaji",
  [wordPrompts.english]: "English",
};

const orderOptions = [
  { label: "Sequential", value: "sequential" },
  { label: "Shuffle", value: "shuffle" },
];

const Dropdown = ({ label, value, options, onChange }) => {
  const current = options.find((option) => option.value === value);

  const selectOption = (nextValue, event) => {
    onChange(nextValue);
    event.currentTarget.closest("details")?.removeAttribute("open");
  };

  return (
    <div className="select-control">
      <span>{label}</span>
      <details className="dropdown-control">
        <summary aria-label={`${label}: ${current?.label}`}>
          {current?.label}
          <span aria-hidden="true" className="dropdown-chevron">
            ▾
          </span>
        </summary>
        <div className="dropdown-menu">
          {options.map((option) => (
            <button
              className={option.value === value ? "active" : ""}
              key={option.value}
              onClick={(event) => selectOption(option.value, event)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </details>
    </div>
  );
};

const Logo = () => (
  <div aria-hidden="true" className="app-logo">
    <span className="logo-kana">あ</span>
    <span className="logo-word">Learning</span>
  </div>
);

const ShortcutDialog = ({ dialogRef }) => (
  <dialog
    aria-labelledby="shortcut-dialog-title"
    className="shortcut-dialog"
    ref={dialogRef}
  >
    <div className="shortcut-panel">
      <div className="shortcut-header">
        <h2 id="shortcut-dialog-title">Keyboard shortcuts</h2>
        <form method="dialog">
          <button className="shortcut-close" type="submit">
            Close
          </button>
        </form>
      </div>
      <dl className="shortcut-list">
        {keyboardShortcutLegend.map((shortcut) => (
          <div className="shortcut-row" key={shortcut.key}>
            <dt>
              <kbd>{shortcut.key}</kbd>
            </dt>
            <dd>{shortcut.description}</dd>
          </div>
        ))}
      </dl>
    </div>
  </dialog>
);

const AppV2 = () => {
  const {
    list,
    setList,
    deck,
    next,
    currentItem,
    settings,
    updateSettings,
    reset,
  } = useJapanese();
  const [showAnswer, setShowAnswer] = useState(false);
  const [announce, setAnnounce] = useState(false);
  const shortcutsDialogRef = useRef(null);
  const item = deck[currentItem];
  const isLearnMode = settings.mode === modes.learn;
  const isWordsMode = settings.mode === modes.words;
  const isKanji = settings.kanaScript === scripts.kanji;
  const answerIsVisible = isLearnMode || showAnswer;
  const speechText = item?.kind === "kanji" ? item.audio : item?.japanese;

  const openShortcuts = useCallback(() => {
    const dialog = shortcutsDialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const playSound = useCallback(() => speak(speechText), [speechText]);

  const toggleAnswer = useCallback(() => {
    if (!isLearnMode) setShowAnswer((current) => !current);
  }, [isLearnMode]);

  useEffect(() => {
    setShowAnswer(false);
  }, [item, settings.mode, settings.wordPrompt]);

  useEffect(() => {
    if (announce) speak(speechText);
  }, [item, announce, speechText]);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      blurPointerActivatedControl(event);
      document
        .querySelectorAll(".dropdown-control[open]")
        .forEach((details) => {
          if (!details.contains(event.target)) details.removeAttribute("open");
        });
    };

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  useEffect(() => {
    const dialog = shortcutsDialogRef.current;
    if (!dialog) return;

    const closeOnBackdropClick = (event) => {
      if (isOutsideDialog(event)) dialog.close();
    };

    dialog.addEventListener("click", closeOnBackdropClick);
    return () => dialog.removeEventListener("click", closeOnBackdropClick);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const action = getKeyboardShortcutAction(event);
      if (!action) return;

      if (action === shortcutActions.openLegend) {
        event.preventDefault();
        openShortcuts();
        return;
      }

      if (!item || shortcutsDialogRef.current?.open) return;

      event.preventDefault();

      if (action === shortcutActions.toggleAnswer) {
        toggleAnswer();
      } else if (action === shortcutActions.nextCard) {
        next();
      } else if (action === shortcutActions.playSound) {
        playSound();
      } else if (action === shortcutActions.toggleAnnounce) {
        setAnnounce((current) => !current);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [item, next, openShortcuts, playSound, toggleAnswer]);

  return (
    <main className="select">
      <header className="app-header">
        <h1 className="sr-only">Japanese Practice</h1>
        <Logo />
        <div
          className={`settings-panel ${
            settings.mode === modes.words ? "has-prompt" : ""
          }`}
        >
          <Dropdown
            label="Script"
            value={settings.kanaScript}
            options={Object.values(scripts).map((script) => ({
              label: scriptLabels[script],
              value: script,
            }))}
            onChange={(kanaScript) =>
              updateSettings({
                kanaScript,
                ...(kanaScript === scripts.kanji && isWordsMode
                  ? { mode: modes.learn }
                  : {}),
              })
            }
          />
          <div className="mode-control">
            <Dropdown
              label="Mode"
              value={settings.mode}
              options={Object.values(modes)
                .filter((mode) => !isKanji || mode !== modes.words)
                .map((mode) => ({
                  label:
                    isKanji && mode === modes.kanaToRomaji
                      ? "Kanji to Reading"
                      : isKanji && mode === modes.romajiToKana
                        ? "Reading to Kanji"
                        : modeLabels[mode],
                  value: mode,
                }))}
              onChange={(mode) =>
                updateSettings({
                  mode,
                  ...(mode === modes.words
                    ? { wordPrompt: wordPrompts.romaji }
                    : {}),
                })
              }
            />
          </div>
          <div className="secondary-controls">
            {settings.mode === modes.words && (
              <Dropdown
                label="Prompt"
                value={settings.wordPrompt}
                options={Object.values(wordPrompts).map((wordPrompt) => ({
                  label: wordPromptLabels[wordPrompt],
                  value: wordPrompt,
                }))}
                onChange={(wordPrompt) => updateSettings({ wordPrompt })}
              />
            )}
            <div className="utility-control">
              <Dropdown
                label="Order"
                value={
                  isWordsMode || settings.shuffle ? "shuffle" : "sequential"
                }
                options={isWordsMode ? orderOptions.slice(1) : orderOptions}
                onChange={(order) =>
                  updateSettings({ shuffle: order === "shuffle" })
                }
              />
              <button className="reset-button" onClick={reset} type="button">
                Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="learning-layout">
        <section className="practice-column" aria-label="Practice card">
          <ShowCase
            answerLocked={isLearnMode}
            item={item}
            mode={settings.mode}
            announce={announce}
            onSpeak={playSound}
            onToggleAnnounce={() => setAnnounce((current) => !current)}
            onToggleAnswer={toggleAnswer}
            show={answerIsVisible}
            wordPrompt={settings.wordPrompt}
          />

          <div className="button-group">
            <button
              className="switch highlight"
              onClick={next}
              disabled={!item}
              type="button"
            >
              Next
            </button>
            <span className="deck-count">
              {deck.length ? `${currentItem + 1} / ${deck.length}` : "0 cards"}
            </span>
            <button
              aria-haspopup="dialog"
              aria-label="Keyboard shortcuts"
              className="shortcut-button"
              onClick={openShortcuts}
              type="button"
            >
              ?
            </button>
          </div>
        </section>

        <section className="study-column" aria-label="Study controls">
          <SelectorV2 list={list} setList={setList} stacked={isKanji} />
        </section>
      </div>

      <CheatSheetV2 kanaScript={settings.kanaScript} />
      <Info />
      <ShortcutDialog dialogRef={shortcutsDialogRef} />
    </main>
  );
};

export default AppV2;
