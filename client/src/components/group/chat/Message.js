import React from "react";

const Message = ({
  body,
  time,
  user,
  isSelf,
  isServer,
  headerHidden,
  setNewNotice
}) => {
  return (
    <div
      className={`content message ${isSelf ? "is-self" : ""}${
        isServer ? "is-server" : ""
      }`}
    >
      <div className={`header ${headerHidden ? "is-hidden" : ""}`}>
        {isSelf ? "You" : isServer ? "Kinekt" : user.name}
        <span className="header-time">{time}</span>
      </div>
      <div className="body">
        <a onClick={() => setNewNotice({ authorId: user.id, body })}>
          <span>{body}</span>
        </a>
      </div>
    </div>
  );
};

export default Message;
