import { hiragana } from "../constants/constants";

export const divideList = (list) => {
  const dividedList = {};
  list.forEach((item) => {
    if (!dividedList[item.type]) {
      dividedList[item.type] = [];
    }
    dividedList[item.type].push(item);
  });
  return dividedList;
};

const { gojuuon, dakuon, handakuon, ...rest } = divideList(hiragana);
const characters = [...gojuuon, ...dakuon, ...handakuon];

export const getVowels = (list) =>
  list.filter((item) => item.roumaji.length === 1);

export const getConestants = (list) =>
  list.filter((item) => item.roumaji.length > 1);

export const getWhitelisted = (list, whitelist) =>
  list.filter((item) => whitelist.includes(item.roumaji[0]));

export const getMasterList = (consonants) => {
  const masterList = new Set();
  consonants.forEach((consonant) => {
    masterList.add(consonant.roumaji[0]);
  });
  return Array.from(masterList).reduce((acc, item) => {
    if (item === "c") {
      return acc;
    }
    return [...acc, item];
  }, []);
};

export const getList = (whitelist = []) => {
  if (whitelist.length === 0) {
    return characters;
  }
  const vowels = getVowels(characters);
  const consonants = getConestants(characters);
  const finalList = [
    ...(whitelist.includes("v") ? vowels : []),
    ...consonants.filter((item) =>
      whitelist.includes(item.roumaji === "chi" ? "t" : item.roumaji[0])
    ),
  ];
  return finalList;
};

export const masterList = getMasterList(getConestants(characters));

const insertCharacter = (cheatSheetMap, item) => {
  if (item.roumaji === "chi") {
    cheatSheetMap["t"].push(item);
  }
  if (item.roumaji === "n") {
    return;
  }
  cheatSheetMap[item.roumaji[0]].push(item);
};

const cheatSheetMap = {};
characters.forEach((item, index) => {
  if (!cheatSheetMap[item.roumaji[0]]) {
    cheatSheetMap[item.roumaji[0]] = [];
  }
  insertCharacter(cheatSheetMap, item);
});
export const cheatSheet = masterList.map((item) => cheatSheetMap[item]);
cheatSheet.unshift(characters.slice(0, 5));
cheatSheet.push([characters[45]]);

export const speak = (input) => {
  if (!input) return;

  const lang = "ja-JP";
  const synth = window.speechSynthesis;
  const voices = synth.getVoices().filter((voice) => voice.lang === lang);
  let utterance = new SpeechSynthesisUtterance(input);
  utterance.voice = voices[0];
  utterance.lang = "ja-JP";
  utterance.rate = 0.3;
  utterance.volume = 1;
  speechSynthesis.speak(utterance);
};

export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
