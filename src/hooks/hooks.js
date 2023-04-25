import { useEffect, useState } from "react";
import { getInitialList, getItemsToShow } from "../utils/utilsV2";

export const useHiragana = () => {
  const [list, setList] = useState(getInitialList());
  const [itemsToShow, setItemsToShow] = useState(getItemsToShow(list));
  const [currentItem, setCurrentItem] = useState(0);

  const next = () => {
    if (currentItem < itemsToShow.length - 1) {
      setCurrentItem(currentItem + 1);
    } else {
      setItemsToShow(getItemsToShow(list));
      setCurrentItem(0);
    }
  };

  useEffect(() => {
    setItemsToShow(getItemsToShow(list));
  }, [list]);

  return {
    list,
    setList,
    itemsToShow,
    next,
    currentItem,
  };
};









