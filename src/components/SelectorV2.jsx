import classNames from "classnames";

export const SelectorV2 = ({ list, setList }) => {
  const onSelect = (item) => {
    const newList = list.map((listItem) => ({
      ...listItem,
      rows: listItem.rows.map((row) => {
        if (row.value === item.value) {
          return {
            ...row,
            checked: !row.checked,
          };
        }
        return row;
      }),
    }));
    setList(newList);
  };

  return (
    <div className="selector-group">
      {list.map((group) => (
        <div className="selector-group-item" key={group.title}>
          <ul>
            {group.rows.map((item) => (
              <li key={item.value}>
                <button
                  className={classNames("button", { selected: item.checked })}
                  onClick={() => onSelect(item)}
                >
                  {item.value}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

