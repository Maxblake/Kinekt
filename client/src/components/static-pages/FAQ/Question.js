import React, { useState } from "react";

const Question = ({ questionText, answerText }) => {
  const [answerHidden, setAnserHidden] = useState(true);

  return (
    <div
      className="FAQ-question hs-box clickable-text"
      onClick={() => setAnserHidden(!answerHidden)}
    >
      <div className="FAQ-question-header">
        <h3 className="sdfg">{questionText}</h3>
        <span className="icon">
          <i className={`fas fa-chevron-${answerHidden ? "down" : "up"}`}></i>
        </span>
      </div>
      <p className={answerHidden ? "is-hidden" : ""}>{answerText}</p>
    </div>
  );
};

export default Question;
