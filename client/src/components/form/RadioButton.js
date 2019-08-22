import React from "react";

export default function RadioButton({
  handleClick,
  valueKey,
  value,
  selectedValue
}) {
  const getClassList = isSelected => {
    const classList = ["button"];

    if (isSelected) {
      classList.push("is-primary");
    }

    return classList.join(" ");
  };

  return (
    <button
      type="button"
      className={getClassList(selectedValue === value)}
      onClick={() =>
        valueKey ? handleClick(value, valueKey) : handleClick(value)
      }
    >
      {value}
    </button>
  );
}
