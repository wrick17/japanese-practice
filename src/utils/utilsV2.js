import { japanese } from "../constants/constantsV2";
import { shuffle } from "./utils";

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

