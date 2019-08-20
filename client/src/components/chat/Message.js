import React from "react";

const Message = ({ body, user, time }) => {
  const getClassList = user => {
    const messageClasses = ["content", "message"];

    if (user === "Beemo") {
      messageClasses.push("is-self");
    }

    return messageClasses.join(" ");
  };

  return (
    <div className={getClassList(user)}>
      <div className="header">
        {user === "Beemo" ? "You" : user}
        <span className="headerTime">{time}</span>
      </div>
      <div className="body">
        <span>{body}</span>
      </div>
    </div>
  );
};

export default Message;
