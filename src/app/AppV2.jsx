import { useEffect } from "react";
import { CheatSheetV2 } from "../components/CheatSheetV2";
import { Info } from "../components/Info";
import { SelectorV2 } from "../components/SelectorV2";
import { ShowCase } from "../components/ShowCase";
import { useJapanese } from "../hooks/hooks";
import { modes, scripts, wordPrompts } from "../utils/utilsV2";

import "./App.css";

const modeLabels = {
  [modes.romajiToKana]: "Romaji to Japanese",
  [modes.kanaToRomaji]: "Japanese to Romaji",
  [modes.words]: "Words",
};

const scriptLabels = {
  [scripts.hiragana]: "Hiragana",
  [scripts.katakana]: "Katakana",
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
    kana,
  } = useJapanese();
  const item = deck[currentItem];
  const isWordsMode = settings.mode === modes.words;

  useEffect(() => {
    const closeDropdowns = (event) => {
      document
        .querySelectorAll(".dropdown-control[open]")
        .forEach((details) => {
          if (!details.contains(event.target)) details.removeAttribute("open");
        });
    };

    document.addEventListener("click", closeDropdowns);
    return () => document.removeEventListener("click", closeDropdowns);
  }, []);

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
            onChange={(kanaScript) => updateSettings({ kanaScript })}
          />
          <div className="mode-control">
            <Dropdown
              label="Mode"
              value={settings.mode}
              options={Object.values(modes).map((mode) => ({
                label: modeLabels[mode],
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
              value={isWordsMode || settings.shuffle ? "shuffle" : "sequential"}
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
      </header>

      <div className="learning-layout">
        <section className="practice-column" aria-label="Practice card">
          <ShowCase
            item={item}
            mode={settings.mode}
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
          </div>
        </section>

        <section className="study-column" aria-label="Study controls">
          <SelectorV2 list={list} setList={setList} />
        </section>
      </div>

      <CheatSheetV2 kana={kana} />
      <Info />
    </main>
  );
};

export default AppV2;
