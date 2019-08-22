import React from "react";

const SubmitButton = ({ text }) => {
  return (
    <div class="field is-grouped is-grouped-right">
      <div class="control">
        <button class="button is-primary" type="submit">
          {text}
        </button>
      </div>
    </div>
  );
};

export default SubmitButton;
