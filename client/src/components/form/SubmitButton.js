import React from "react";

const SubmitButton = ({ text, isFullwidth, isDisabled }) => {
  return (
    <div className="field is-grouped is-grouped-right">
      <div className={`control ${isFullwidth ? "is-expanded" : ""}`}>
        <button
          disabled={isDisabled}
          className={`button is-primary ${isFullwidth ? "is-fullwidth" : ""}`}
          type="submit"
        >
          {text}
        </button>
      </div>
    </div>
  );
};

export default SubmitButton;
