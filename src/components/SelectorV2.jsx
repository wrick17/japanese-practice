import classNames from "classnames";
import { CheckCheck } from "lucide-react";

export const SelectorV2 = ({ list, setList, stacked = false }) => {
  const onSelect = (item) => {
    const newList = list.map((listItem) => ({
      ...listItem,
      rows: listItem.rows.map((row) => {
        if (row.id === item.id) {
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
  };

  return (
    <div className="selector-group">
      {list.map((group) => {
        const allChecked = group.rows.every((row) => row.checked);
        return (
          <div
            className={classNames("selector-group-item", { stacked })}
            key={group.title}
          >
            {group.label && (
              <span className="selector-label">{group.label}</span>
            )}
            <button
              className={classNames("button batch with-icon", {
                selected: allChecked,
              })}
              onClick={() => toggleAll(group, allChecked)}
              type="button"
            >
              <CheckCheck aria-hidden="true" className="button-icon" />
              All
            </button>
            <ul>
              {group.rows.map((item) => (
                <li key={item.value}>
                  <button
                    className={classNames("button", { selected: item.checked })}
                    onClick={() => onSelect(item)}
                    type="button"
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
