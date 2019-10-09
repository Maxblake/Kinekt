import React from "react";

const Tooltip = ({ body, isVisible, setIsVisible }) => {
  if (!!isVisible) {
    setTimeout(() => {
      setIsVisible(false);
    }, 1500);
  }

  return (
    <div className={`hs-tooltip ${isVisible ? "is-visible" : ""}`}>{body}</div>
  );
};

export default Tooltip;
