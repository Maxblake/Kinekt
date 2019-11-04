import React from "react";

const Message = ({
  body,
  time,
  user,
  isSelf,
  isServer,
  isCurrentUserAdmin,
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
        {isSelf ? "You" : isServer ? "HappenStack" : user.name}
        <span className="header-time">{time}</span>
      </div>
      <div className="body">
        {isServer || !isCurrentUserAdmin ? (
          <span>{body}</span>
        ) : (
          <span
            className="clickable-text"
            onClick={() =>
              setNewNotice({ authorName: user.name, authorId: user.id, body })
            }
          >
            <span>{body}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default Message;
