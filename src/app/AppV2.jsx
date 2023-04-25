import { CheatSheetV2 } from "../components/CheatSheetV2";
import { Info } from "../components/Info";
import { SelectorV2 } from "../components/SelectorV2";
import { ShowCase } from "../components/ShowCase";
import { useHiragana } from "../hooks/hooks";

import "./App.css";

const AppV2 = () => {
  const { list, setList, itemsToShow, next, currentItem } = useHiragana();

  return (
    <div className="select">
      <h2>What's the Hiragana for this?</h2>
      <ShowCase item={itemsToShow[currentItem]} />
      <button
        className="switch highlight"
        onClick={next}
        disabled={!itemsToShow[currentItem]}
      >
        Surprise Me
      </button>
      <SelectorV2 list={list} setList={setList} />
      <CheatSheetV2 />
      <Info />
    </div>
  );
};

export default AppV2;


