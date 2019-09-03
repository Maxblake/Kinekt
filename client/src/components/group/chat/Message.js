import React from "react";

const Message = ({ body, time, user, isSelf, headerHidden }) => {
  return (
    <div className={`content message ${isSelf ? "is-self" : ""}`}>
      <div className={`header ${headerHidden ? "is-hidden" : ""}`}>
        {isSelf ? "You" : user}
        <span className="header-time">{time}</span>
      </div>
      <div className="body">
        <span>{body}</span>
      </div>
    </div>
  );
};

export default Message;
