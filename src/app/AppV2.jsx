import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Keyboard,
  RotateCcw,
  X,
} from "lucide-react";
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
import { modes, scripts, wordPrompts } from "../utils/utilsV2";

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
          <ChevronDown aria-hidden="true" className="dropdown-chevron" />
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

const MultiSelectDropdown = ({ label, values, options, onChange }) => {
  const selectedLabels = options
    .filter((option) => values.includes(option.value))
    .map((option) => option.label);
  const toggleOption = (value) => {
    const nextValues = values.includes(value)
      ? values.filter((selected) => selected !== value)
      : options
          .map((option) => option.value)
          .filter((option) => [...values, value].includes(option));
    if (nextValues.length) onChange(nextValues);
  };

  return (
    <div className="select-control">
      <span>{label}</span>
      <details className="dropdown-control">
        <summary aria-label={`${label}: ${selectedLabels.join(", ")}`}>
          {values.length === 1 ? selectedLabels[0] : `${values.length} scripts`}
          <ChevronDown aria-hidden="true" className="dropdown-chevron" />
        </summary>
        <div className="dropdown-menu">
          {options.map((option) => (
            <button
              aria-pressed={values.includes(option.value)}
              className={values.includes(option.value) ? "active" : ""}
              key={option.value}
              onClick={() => toggleOption(option.value)}
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
          <button aria-label="Close" className="modal-close" type="submit">
            <X aria-hidden="true" className="button-icon" />
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
    lists,
    setList,
    deck,
    next,
    previous,
    currentItem,
    settings,
    updateSettings,
    reset,
  } = useJapanese();
  const [showAnswer, setShowAnswer] = useState(false);
  const shortcutsDialogRef = useRef(null);
  const item = deck[currentItem];
  const isLearnMode = settings.mode === modes.learn;
  const isWordsMode = settings.mode === modes.words;
  const hasKanji = settings.selectedScripts.includes(scripts.kanji);
  const onlyKanji =
    settings.selectedScripts.length === 1 &&
    settings.selectedScripts[0] === scripts.kanji;
  const answerIsVisible = isLearnMode || showAnswer;

  const openShortcuts = useCallback(() => {
    const dialog = shortcutsDialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const toggleAnswer = useCallback(() => {
    if (!isLearnMode) setShowAnswer((current) => !current);
  }, [isLearnMode]);

  useEffect(() => {
    setShowAnswer(false);
  }, [item, settings.mode, settings.wordPrompt]);

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
      } else if (action === shortcutActions.previousCard) {
        previous();
      } else if (action === shortcutActions.nextCard) {
        next();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [item, next, openShortcuts, previous, toggleAnswer]);

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
          <MultiSelectDropdown
            label="Script"
            values={settings.selectedScripts}
            options={Object.values(scripts).map((script) => ({
              label: scriptLabels[script],
              value: script,
            }))}
            onChange={(selectedScripts) => updateSettings({ selectedScripts })}
          />
          <div className="mode-control">
            <Dropdown
              label="Mode"
              value={settings.mode}
              options={Object.values(modes)
                .filter((mode) => !onlyKanji || mode !== modes.words)
                .map((mode) => ({
                  label:
                    onlyKanji && mode === modes.kanaToRomaji
                      ? "Kanji to Reading"
                      : onlyKanji && mode === modes.romajiToKana
                        ? "Reading to Kanji"
                        : hasKanji && mode === modes.kanaToRomaji
                          ? "Japanese to Reading"
                          : hasKanji && mode === modes.romajiToKana
                            ? "Reading to Japanese"
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
              <button
                className="reset-button with-icon"
                onClick={reset}
                type="button"
              >
                <RotateCcw aria-hidden="true" className="button-icon" />
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
            onToggleAnswer={toggleAnswer}
            show={answerIsVisible}
            showScriptHint={settings.selectedScripts.length > 1}
            wordPrompt={settings.wordPrompt}
          />

          <div className="button-group">
            <button
              className="switch with-icon"
              onClick={previous}
              disabled={!item}
              type="button"
            >
              <ArrowLeft aria-hidden="true" className="button-icon" />
              Previous
              <kbd aria-hidden="true" className="shortcut-hint">
                ←
              </kbd>
            </button>
            <button
              className="switch highlight with-icon"
              onClick={next}
              disabled={!item}
              type="button"
            >
              <ArrowRight aria-hidden="true" className="button-icon" />
              Next
              <kbd aria-hidden="true" className="shortcut-hint">
                →
              </kbd>
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
              <Keyboard aria-hidden="true" className="button-icon" />
            </button>
          </div>
        </section>

        <section className="study-column" aria-label="Study controls">
          {settings.selectedScripts.map((script) => (
            <div className="script-selector" key={script}>
              <h2>{scriptLabels[script]} rows</h2>
              <SelectorV2
                list={lists[script]}
                setList={(list) => setList(script, list)}
                stacked={script === scripts.kanji}
              />
            </div>
          ))}
        </section>
      </div>

      {settings.selectedScripts.map((script) => (
        <CheatSheetV2 kanaScript={script} key={script} />
      ))}
      <Info />
      <ShortcutDialog dialogRef={shortcutsDialogRef} />
    </main>
  );
};

export default AppV2;
