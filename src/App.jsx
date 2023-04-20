import { useEffect, useState } from "react";
import "./App.css";
import { getList, masterList, shuffle } from "./utils";
import { Selector } from "./Selector";
import { ShowCase } from "./ShowCase";
import { CheatSheet } from "./CheatSheet";
import { Info } from './Info';

const initialValue = [
  { value: "v", label: "v", checked: true },
  ...masterList.map((item) => ({
    value: item,
    label: item,
    checked: false,
  })),
];

const initialItemsToShow = getList(
  initialValue.filter((item) => item.checked).map((item) => item.value)
);

const getItemsToShow = (list) => {
  return shuffle(
    getList(
      (list || initialValue)
        .filter((item) => item.checked)
        .map((item) => item.value)
    )
  );
};

function App() {
  const [list, setList] = useState(initialValue);
  const [currentItem, setCurrentItem] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(initialItemsToShow);

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
    setCurrentItem(0);
  }, [list]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === " ") {
        next();
      }
    };
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [itemsToShow]);

  return (
    <div className="select">
      <h2>Remember Hiragana?</h2>
      <Selector list={list} setList={setList} />
      <button className="switch" onClick={next}>
        Surprise Me
      </button>
      <ShowCase item={itemsToShow[currentItem]} />
      <CheatSheet />
      <Info />
    </div>
  );
}

export default App;

