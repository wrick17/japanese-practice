import { useEffect, useState } from "react";
import "./App.css";
import { getList, masterList, selectRandom } from "./utils";
import { Selector } from "./Selector";
import { ShowCase } from "./ShowCase";

const initialValue = masterList.map((item) => ({
  value: item,
  label: item,
  checked: false,
}));

function App() {
  const [list, setList] = useState(initialValue);
  const [randomItem, setRandomItem] = useState();

  const itemsToShow = getList(
    list.filter((item) => item.checked).map((item) => item.value)
  );
  const randomize = () => setRandomItem(selectRandom(itemsToShow));

  return (
    <div className="select">
      <h2>Remember Hiragana?</h2>
      <Selector list={list} setList={setList} />
      <button className="switch" onClick={randomize}>
        Surprise Me
      </button>
      {randomItem && <ShowCase randomItem={randomItem} />}
    </div>
  );
}

export default App;

