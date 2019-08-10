import React from "react";

const getClassList = isSelected => {
  const classList = ["button"];

  if (isSelected) {
    classList.push("is-primary");
  }

  return classList.join(" ");
};

export default function RadioButton(props) {
  return (
    <button
      type="button"
      className={getClassList(props.selectedValue === props.value)}
      onClick={() =>
        props.valueKey
          ? props.handleClick(props.value, props.valueKey)
          : props.handleClick(props.value)
      }
    >
      {props.value}
    </button>
  );
}
