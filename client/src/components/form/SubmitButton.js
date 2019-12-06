import React, { Fragment } from "react";

const SubmitButton = ({
  isAddon,
  text,
  isFullwidth,
  isDisabled,
  buttonClasses
}) => {
  const submitButton = (
    <button
      disabled={isDisabled}
      className={`button has-text-centered is-primary ${isFullwidth ? "is-fullwidth" : ""} ${
        buttonClasses !== undefined ? buttonClasses.join(" ") : ""
      }`}
      type="submit"
    >
      {isAddon ? text : <Fragment>&nbsp;&nbsp;{text}&nbsp;&nbsp;</Fragment>}
    </button>
  );

  if (isAddon) return submitButton;

  return (
    <div className="field is-grouped is-grouped-right">
      <div
        className={`control submit-control ${isFullwidth ? "is-expanded" : ""}`}
      >
        {submitButton}
      </div>
    </div>
  );
};

export default SubmitButton;
