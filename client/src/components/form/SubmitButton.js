import React from "react";

const SubmitButton = ({ text, isFullwidth, isDisabled, buttonClasses }) => {
  return (
    <div className="field is-grouped is-grouped-right">
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
          &nbsp;&nbsp;{text}&nbsp;&nbsp;
        </button>
      </div>
    </div>
  );
};

export default SubmitButton;
