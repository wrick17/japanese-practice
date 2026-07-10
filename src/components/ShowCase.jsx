import { useLayoutEffect, useRef } from "react";
import classNames from "classnames";
import { fitText } from "../utils/fitText";
import { getKanaRomajiDisplay, modes, wordPrompts } from "../utils/utilsV2";

const wordLabels = {
  [wordPrompts.japanese]: "Japanese",
  [wordPrompts.romaji]: "Romaji",
  [wordPrompts.english]: "English",
};

const getKanaPrompt = (item, mode) => {
  if (mode === modes.kanaToRomaji) {
    return { label: "Japanese", value: item.japanese, japanese: true };
  }
  return {
    label: "Romaji",
    value: getKanaRomajiDisplay(item.roumaji),
    japanese: false,
  };
};

const getKanaAnswers = (item, mode) => {
  if (mode === modes.kanaToRomaji) {
    return [
      {
        label: "Romaji",
        value: getKanaRomajiDisplay(item.roumaji),
        japanese: false,
      },
    ];
  }
  return [{ label: "Japanese", value: item.japanese, japanese: true }];
};

const getWordPrompt = (item, wordPrompt) => ({
  label: wordLabels[wordPrompt],
  value: item[wordPrompt],
  japanese: wordPrompt === wordPrompts.japanese,
});

const getWordAnswers = (item, wordPrompt) =>
  Object.values(wordPrompts)
    .filter((key) => key !== wordPrompt)
    .map((key) => ({
      label: wordLabels[key],
      value: item[key],
      japanese: key === wordPrompts.japanese,
    }));

const FittedAnswer = ({ field, fieldCount }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const maxFontSize = field.japanese ? 160 : fieldCount === 2 ? 80 : 56;

  useLayoutEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const fit = () => fitText(container, text, maxFontSize);
    fit();

    const observer = new ResizeObserver(fit);
    observer.observe(container);
    return () => observer.disconnect();
  }, [field.value, maxFontSize]);

  return (
    <span
      className={classNames("answer-value", {
        japanese: field.japanese,
      })}
      ref={containerRef}
    >
      <span className="answer-text" ref={textRef}>
        {field.value}
      </span>
    </span>
  );
};

export const ShowCase = ({
  answerLocked,
  item,
  mode,
  wordPrompt,
  show,
  announce,
  onSpeak,
  onToggleAnswer,
  onToggleAnnounce,
}) => {
  const prompt = item
    ? item.kind === "word"
      ? getWordPrompt(item, wordPrompt)
      : getKanaPrompt(item, mode)
    : null;
  const answers = item
    ? item.kind === "word"
      ? getWordAnswers(item, wordPrompt)
      : getKanaAnswers(item, mode)
    : [];
  const fields = prompt ? [prompt, ...answers] : [];

  return (
    <div className="practice-stage">
      <button
        aria-label="Play Japanese sound"
        className="showcase"
        onClick={onSpeak}
        type="button"
      >
        {!item ? (
          <span className="block empty-state">Pick rows to start</span>
        ) : show ? (
          <span className="block answer-card">
            {fields.map((field) => (
              <span
                className={classNames("answer-line", {
                  japanese: field.japanese,
                })}
                key={field.label}
              >
                <span className="answer-label">{field.label}</span>
                <FittedAnswer field={field} fieldCount={fields.length} />
              </span>
            ))}
          </span>
        ) : (
          <span
            className={classNames("block", {
              kana: prompt.japanese,
              roumaji: !prompt.japanese,
              english: prompt.label === "English",
            })}
          >
            <span>{prompt.value}</span>
            <span className="small-subtext">{prompt.label}</span>
          </span>
        )}
      </button>
      <div className="card-actions">
        <button
          className="show help"
          onClick={onToggleAnswer}
          disabled={!item || answerLocked}
          type="button"
        >
          {answerLocked
            ? "Answer Revealed"
            : show
              ? "Hide Answer"
              : "Reveal Answer"}
        </button>
        <button
          className="show speak"
          onClick={onToggleAnnounce}
          disabled={!item}
          type="button"
        >
          {announce ? "Stop Announce" : "Announce"}
        </button>
      </div>
    </div>
  );
};
