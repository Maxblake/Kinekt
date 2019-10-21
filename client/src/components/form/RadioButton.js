import React from "react";

export default function RadioButton({
  handleClick,
  valueKey,
  value,
  customLabel,
  selectedValue
}) {
  const getClassName = isSelected => {
    const classList = ["button"];

    if (isSelected) {
      classList.push("is-primary");
    }

    return classList.join(" ");
  };

  return (
    <button
      type="button"
      className={getClassName(selectedValue === value)}
      onClick={() =>
        valueKey ? handleClick(value, valueKey) : handleClick(value)
      }
    >
      {customLabel ? customLabel : value}
    </button>
  );
}
