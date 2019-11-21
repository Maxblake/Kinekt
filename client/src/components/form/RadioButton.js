import React from "react";

export default function RadioButton({
  handleClick,
  valueKey,
  value,
  customLabel,
  selectedValue,
  isFullwidth
}) {
  const getClassName = (isSelected, isFullwidth) => {
    const classList = ["button", "is-primary"];

    if (isFullwidth) {
      classList.push("is-fullwidth");
    }

    if (!isSelected) {
      classList.push("is-outlined");
    }

    return classList.join(" ");
  };

  return (
    <button
      type="button"
      className={getClassName(selectedValue === value, isFullwidth)}
      onClick={() =>
        valueKey ? handleClick(value, valueKey) : handleClick(value)
      }
    >
      {customLabel ? customLabel : value}
    </button>
  );
}
