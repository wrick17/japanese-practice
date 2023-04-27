import { japanese } from "../constants/constantsV2";

const synth = window.speechSynthesis;
const lang = "ja-JP";
const voices = synth.getVoices().filter((voice) => voice.lang === lang);

export const speak = (input) => {
  if (!input) return;
  let utterance = new SpeechSynthesisUtterance(input);
  utterance.voice = voices[0];
  utterance.lang = "ja-JP";
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

export const getInitialList = () =>
  japanese.reduce(
    (list, group) => [
      ...list,
      {
        title: group.group,
        rows: group.rows.map((row) => ({
          value: `${row[0].roumaji[0]}${group.group === "youon" ? "+" : ""}`,
          checked: false,
        })),
      },
    ],
    []
  );

const getWhiteList = (list) =>
  list.reduce((whiteList, group) => {
    return [
      ...whiteList,
      ...group.rows.reduce((rows, row) => {
        if (row.checked) {
          return [...rows, row.value];
        }
        return rows;
      }, []),
    ];
  }, []);

export const getItemsToShow = (list) => {
  const whitelist = getWhiteList(list);
  return shuffle(
    japanese.reduce((items, group) => {
      const filteredRows = group.rows.reduce((items, row) => {
        const rowValue = `${row[0].roumaji[0]}${
          group.group === "youon" ? "+" : ""
        }`;
        if (!whitelist.length) {
          return [...items, ...row.filter((item) => item.roumaji)];
        }
        if (whitelist.includes(rowValue)) {
          return [...items, ...row.filter((item) => item.roumaji)];
        }
        return items;
      }, []);
      return [...items, ...filteredRows];
    }, [])
  );
};

