import React from "react";

const SubmitButton = ({ text, isFullwidth }) => {
  return (
    <div className="field is-grouped is-grouped-right">
      <div className={`control ${isFullwidth ? "is-expanded" : ""}`}>
        <button
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
