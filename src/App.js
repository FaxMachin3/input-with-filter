import { useState } from "react";
import "./styles.css";

const columns = [
  { id: "c1", text: "gst" },
  { id: "c2", text: "cgst" },
  { id: "c3", text: "sgst" },
  { id: "c4", text: "date" },
  { id: "c5", text: "cost_price" },
  { id: "c6", text: "selling_price" }
];

const operatorSet = new Set(["-", "+", "*", "/"]);

const isOperator = (letter) => {
  return operatorSet.has(letter);
};

export default function App() {
  const [showList, setShowList] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [list, setList] = useState([]);
  const [dropdownList, setDropdownList] = useState(columns);
  const [value, setValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const findAtPosition = (value, position) => {
    for (let i = position; i >= 0; i--) {
      if (value.at(i) === "@") return i;
    }
    return -1;
  };

  const filterDropdown = (filterWord) => {
    setDropdownList(
      columns.filter(({ text }) => text.toLowerCase().includes(filterWord))
    );
  };

  const onInputChange = (e) => {
    const caretPosition = e.target.selectionStart;
    const letter = e.target.value.at(caretPosition - 1);
    if (showDropdown && !isOperator(letter)) {
      const atPosition = findAtPosition(e.target.value, caretPosition);
      const searchValue = e.target.value.substring(
        atPosition + 1,
        caretPosition
      );
      filterDropdown(searchValue);
    }
    if (letter === "@") setShowDropdown(true);
    if (isOperator(letter)) setShowDropdown(false);

    setValue(e.target.value);
  };

  const onInputKeyDown = (e) => {
    console.log(e.key);
    if (e.key === "ArrowDown") {
      setActiveIndex((prev) =>
        prev === dropdownList.length - 1 ? prev : prev + 1
      );
    }

    if (e.key === "ArrowUp") {
      setActiveIndex((prev) => (prev === 0 ? prev : prev - 1));
    }

    if (e.key === "Enter") {
      console.log(dropdownList[activeIndex]);
      setShowDropdown(false);
      setActiveIndex(0);
    }
  };

  const onInputClick = (e) => {
    console.log(e.target.value, e.target.selectionStart);
  };

  const onDropdownItemClick = (e) => {
    if (!e.target.dataset.index) return;

    console.log(dropdownList[e.target.dataset.index]);
    setShowDropdown(false);
    setActiveIndex(0);
  };

  const onContainerBlur = (e) => {
    setShowDropdown(false);
    setActiveIndex(0);
    // TODO: validate input
    console.log(e.target.value, e.target.selectionStart);
  };

  console.log({ showDropdown });

  return (
    <div className="app" onBlur={onContainerBlur}>
      <div className="input-container">
        {showList ? (
          <div>
            {list.map(({ id, text, isColumn }) => (
              <span className={`${isColumn ? "column" : ""}`} key={id}>
                {text}
              </span>
            ))}
          </div>
        ) : (
          <div>
            <input
              onKeyDown={onInputKeyDown}
              onClick={onInputClick}
              onChange={onInputChange}
              value={value}
            />
          </div>
        )}
      </div>
      {showDropdown && (
        <div className="dropdown" onClick={onDropdownItemClick}>
          {dropdownList.map(({ id, text }, index) => (
            <div
              className={`item ${activeIndex === index ? "active" : ""}`}
              key={id}
              data-index={index}
            >
              {text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
