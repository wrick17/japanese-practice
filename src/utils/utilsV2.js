import { japanese } from "../constants/constantsV2";

const lang = "ja-JP";

export const speak = (input) => {
  if (!input) return;
  const synth = globalThis.speechSynthesis;
  const Utterance = globalThis.SpeechSynthesisUtterance;
  if (!synth || typeof Utterance !== "function") return;

  const utterance = new Utterance(input);
  utterance.voice = synth.getVoices().find((voice) => voice.lang === lang);
  utterance.lang = lang;
  utterance.rate = 0.3;
  utterance.volume = 1;
  synth.speak(utterance);
};

export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getRowValue = (group, row) => {
  const firstItem = row[0];
  if (firstItem.kana === "ん") return "N";
  return `${firstItem.roumaji[0]}${group.group === "youon" ? "+" : ""}`;
};

export const getInitialList = () =>
  japanese.map((group) => ({
    title: group.group,
    rows: group.rows.map((row) => ({
      value: getRowValue(group, row),
      checked: false,
    })),
  }));

const getWhiteList = (list) =>
  list.flatMap((group) =>
    group.rows.filter((row) => row.checked).map((row) => row.value),
  );

export const getItemsToShow = (list) => {
  const whitelist = getWhiteList(list);
  return shuffle(
    japanese.flatMap((group) =>
      group.rows.flatMap((row) => {
        const rowValue = getRowValue(group, row);
        if (!whitelist.length) {
          return row.filter((item) => item.roumaji);
        }
        if (whitelist.includes(rowValue)) {
          return row.filter((item) => item.roumaji);
        }
        return [];
      }),
    ),
  );
};
