import { useLayoutEffect, useRef } from "react";
import classNames from "classnames";
import {
  CircleCheck,
  Eye,
  EyeOff,
  Megaphone,
  MegaphoneOff,
  Volume2,
} from "lucide-react";
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

const getKanjiReadings = (item) =>
  [
    item.on.length ? `音 ${item.on.join("・")}` : "",
    item.kun.length ? `訓 ${item.kun.join("・")}` : "",
  ]
    .filter(Boolean)
    .join(" / ");

const getKanjiMeaning = (item) => item.meanings.join(", ");

const getKanjiPrompt = (item, mode) => {
  if (mode === modes.romajiToKana) {
    return {
      label: "Readings · Meaning",
      value: `${getKanjiReadings(item)} · ${getKanjiMeaning(item)}`,
      japanese: false,
      multiline: true,
    };
  }
  return { label: "Kanji", value: item.japanese, japanese: true };
};

const getKanjiAnswers = (item, mode) => {
  const meaning = {
    label: "Meaning",
    value: getKanjiMeaning(item),
    japanese: false,
    multiline: true,
  };
  if (mode === modes.romajiToKana) {
    return [{ label: "Kanji", value: item.japanese, japanese: true }];
  }
  return [
    item.on.length && {
      label: "On-yomi",
      value: item.on.join("・"),
      japanese: true,
      multiline: true,
    },
    item.kun.length && {
      label: "Kun-yomi",
      value: item.kun.join("・"),
      japanese: true,
      multiline: true,
    },
    meaning,
  ].filter(Boolean);
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

const FittedAnswer = ({ field, fieldCount, prompt = false }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const maxFontSize = prompt
    ? field.japanese
      ? 180
      : 120
    : field.japanese
      ? 160
      : fieldCount === 2
        ? 80
        : 56;

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
        "prompt-value": prompt,
      })}
      ref={containerRef}
    >
      <span
        className={classNames("answer-text", { multiline: field.multiline })}
        ref={textRef}
      >
        {field.value}
      </span>
    </span>
  );
};

export const getStudyFields = (item, mode, wordPrompt) => {
  if (!item) return { prompt: null, fields: [] };

  const prompt =
    item.kind === "word"
      ? getWordPrompt(item, wordPrompt)
      : item.kind === "kanji"
        ? getKanjiPrompt(item, mode)
        : getKanaPrompt(item, mode);
  const answers =
    item.kind === "word"
      ? getWordAnswers(item, wordPrompt)
      : item.kind === "kanji"
        ? getKanjiAnswers(item, mode)
        : getKanaAnswers(item, mode);

  return { prompt, fields: [prompt, ...answers] };
};

export const RevealedCard = ({ fields }) => (
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
);

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
  const { prompt, fields } = getStudyFields(item, mode, wordPrompt);
  const AnswerIcon = answerLocked ? CircleCheck : show ? EyeOff : Eye;
  const AnnounceIcon = announce ? MegaphoneOff : Megaphone;

  return (
    <div className="practice-stage">
      <button
        className="showcase"
        disabled={!item}
        onClick={onSpeak}
        type="button"
      >
        {item && (
          <>
            <span className="sr-only">
              {item.kind === "kanji"
                ? "Play first listed reading. "
                : "Play Japanese sound. "}
            </span>
            <span aria-hidden="true" className="card-audio-control">
              <Volume2 className="button-icon" />
              <kbd className="shortcut-hint">P</kbd>
            </span>
          </>
        )}
        {!item ? (
          <span className="block empty-state">Pick a study group to start</span>
        ) : show ? (
          <RevealedCard fields={fields} />
        ) : (
          <span
            className={classNames("block", {
              kana: prompt.japanese,
              roumaji: !prompt.japanese,
              english: prompt.label === "English",
            })}
          >
            <FittedAnswer field={prompt} fieldCount={1} prompt />
            <span className="small-subtext">{prompt.label}</span>
          </span>
        )}
      </button>
      <div className="card-actions">
        <button
          className="show help with-icon"
          onClick={onToggleAnswer}
          disabled={!item || answerLocked}
          type="button"
        >
          <AnswerIcon aria-hidden="true" className="button-icon" />
          {answerLocked
            ? "Answer Revealed"
            : show
              ? "Hide Answer"
              : "Reveal Answer"}
          <kbd aria-hidden="true" className="shortcut-hint">
            Space
          </kbd>
        </button>
        <button
          className="show speak with-icon"
          onClick={onToggleAnnounce}
          disabled={!item}
          type="button"
        >
          <AnnounceIcon aria-hidden="true" className="button-icon" />
          {announce ? "Stop Announce" : "Announce"}
          <kbd aria-hidden="true" className="shortcut-hint">
            A
          </kbd>
        </button>
      </div>
    </div>
  );
};
