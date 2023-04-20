import classNames from "classnames";

export const Selector = ({ list, setList }) => {
  const onSelect = (item) => {
    setList(
      list.map((listItem) => {
        if (listItem.value === item.value) {
          return {
            ...listItem,
            checked: !listItem.checked,
          };
        }
        return listItem;
      })
    );
  };

  return (
    <ul>
      {list.map((item) => (
        <li key={item.value}>
          <button
            className={classNames("button", { selected: item.checked })}
            onClick={() => onSelect(item)}
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  );
};




