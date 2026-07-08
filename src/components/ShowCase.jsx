import { useEffect, useState } from "react";
import classNames from "classnames";
import { modes, speak, wordPrompts } from "../utils/utilsV2";

const wordLabels = {
  [wordPrompts.japanese]: "Japanese",
  [wordPrompts.romaji]: "Romaji",
  [wordPrompts.english]: "English",
};

const getKanaPrompt = (item, mode) => {
  if (mode === modes.kanaToRomaji) {
    return { label: "Japanese", value: item.japanese, japanese: true };
  }
  return { label: "Romaji", value: item.roumaji, japanese: false };
};

const getKanaAnswers = (item, mode) => {
  if (mode === modes.kanaToRomaji) {
    return [{ label: "Romaji", value: item.roumaji, japanese: false }];
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

export const ShowCase = ({ item, mode, wordPrompt }) => {
  const [show, setShow] = useState(false);
  const [announce, setAnnounce] = useState(false);
  const speechText = item?.japanese;
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

  useEffect(() => {
    setShow(false);
  }, [item, mode, wordPrompt]);

  useEffect(() => {
    if (announce) speak(speechText);
  }, [item, announce, speechText]);

  return (
    <div className="practice-stage">
      <button
        aria-label="Play Japanese sound"
        className="showcase"
        onClick={() => speak(speechText)}
        type="button"
      >
        {!item ? (
          <span className="block empty-state">Pick rows to start</span>
        ) : show ? (
          <span className="block answer-card">
            {fields.map((field) => (
              <span className="answer-line" key={field.label}>
                <span className="answer-label">{field.label}</span>
                <span
                  className={classNames("answer-value", {
                    japanese: field.japanese,
                  })}
                >
                  {field.value}
                </span>
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
          onClick={() => setShow(!show)}
          disabled={!item}
          type="button"
        >
          {show ? "Hide Answer" : "Reveal Answer"}
        </button>
        <button
          className="show speak"
          onClick={() => setAnnounce(!announce)}
          disabled={!item}
          type="button"
        >
          {announce ? "Stop Announce" : "Announce"}
        </button>
      </div>
    </div>
  );
};
