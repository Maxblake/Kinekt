import React from "react";

const SubmitButton = ({ text }) => {
  return (
    <div className="field is-grouped is-grouped-right">
      <div className="control">
        <button className="button is-primary" type="submit">
          {text}
        </button>
      </div>
    </div>
  );
};

export default SubmitButton;
