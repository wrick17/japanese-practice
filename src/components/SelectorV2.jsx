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

  const toggleAll = (group, checked) => {
    const newList = list.map((listItem) => {
      if (listItem.title === group.title) {
        return {
          ...listItem,
          rows: listItem.rows.map((row) => ({
            ...row,
            checked: !checked,
          })),
        };
      }
      return listItem;
    });
    setList(newList);
  }

  return (
    <div className="selector-group">
      {list.map((group) => {
        const allChecked = group.rows.every((row) => row.checked);
        return (
          <div className="selector-group-item" key={group.title}>
            <button
              className={classNames("button batch", { selected: allChecked })}
              onClick={() => toggleAll(group, allChecked)}
            >
              All
            </button>
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
        );
      })}
    </div>
  );
};



