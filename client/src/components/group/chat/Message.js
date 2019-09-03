import React from "react";

const Message = ({ body, time, user, isSelf, isServer, headerHidden }) => {
  return (
    <div
      className={`content message ${isSelf ? "is-self" : ""}${
        isServer ? "is-server" : ""
      }`}
    >
      <div className={`header ${headerHidden ? "is-hidden" : ""}`}>
        {isSelf ? "You" : isServer ? "Kinekt" : user}
        <span className="header-time">{time}</span>
      </div>
      <div className="body">
        <span>{body}</span>
      </div>
    </div>
  );
};

export default Message;
