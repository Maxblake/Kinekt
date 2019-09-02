import React from "react";

const Message = ({ body, time, user, isSelf }) => {
  return (
    <div className={`content message ${isSelf ? "is-self" : ""}`}>
      <div className="header">
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
