import { hiragana } from "./constants";

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

export const getVowels = (list) => list.slice(0, 5);

export const getConestants = (list) => list.slice(5);

export const getWhitelisted = (list, whitelist) =>
  list.filter((item) => whitelist.includes(item.roumaji[0]));

export const getMasterList = (consonants) => {
  const masterList = new Set();
  consonants.forEach((consonant) => {
    masterList.add(consonant.roumaji[0]);
  });
  return Array.from(masterList);
};

export const getItemsToShow = (whitelist = []) => {
  const vowels = getVowels(gojuuon);
  const consonants = getConestants(gojuuon);
  return [
    ...vowels,
    ...consonants.filter((item) => whitelist.includes(item.roumaji[0])),
  ];
};

export const getList = (whitelist) => {
  const itemsToShow = getItemsToShow(whitelist);

  return itemsToShow;
};

const gojuuon = divideList(hiragana).gojuuon;

export const masterList = getMasterList(getConestants(gojuuon));

export const selectRandom = (list) => {
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

