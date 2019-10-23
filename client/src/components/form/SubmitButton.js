import React, { Fragment } from "react";

const SubmitButton = ({
  isAddon,
  text,
  isFullwidth,
  isDisabled,
  buttonClasses
}) => {
  const btnControl = (
    <div
      className={`control submit-control ${isFullwidth ? "is-expanded" : ""}`}
    >
      <button
        disabled={isDisabled}
        className={`button is-primary ${isFullwidth ? "is-fullwidth" : ""} ${
          buttonClasses !== undefined ? buttonClasses.join(" ") : ""
        }`}
        type="submit"
      >
        {isAddon ? text : <Fragment>&nbsp;&nbsp;{text}&nbsp;&nbsp;</Fragment>}
      </button>
    </div>
  );

  if (isAddon) return btnControl;

  return <div className="field is-grouped is-grouped-right">{btnControl}</div>;
};

export default SubmitButton;
