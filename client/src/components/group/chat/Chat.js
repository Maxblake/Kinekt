import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Message from "./Message";

const Chat = ({ auth: { user, socket } }) => {
  const [messageData, setMessageData] = useState({
    messageField: "",
    messages: []
  });

  const { messageField, messages } = messageData;

  useEffect(() => {
    socket.on("receiveMessage", receiveMessage);

    return () => {
      socket.off("receiveMessage");
    };
  }, [messages]);

  const receiveMessage = message => {
    setMessageData({
      ...messageData,
      messages: messages.concat(message)
    });
  };

  const submitMessage = async e => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();

      if (messageField.trim() === "") return;

      const message = {
        user: user._id,
        body: messageField
      };

      socket.emit("sendMessage", message);
      setMessageData({ ...messageData, messageField: "" });
    }
  };

  const onChange = e => {
    setMessageData({ ...messageData, [e.target.name]: e.target.value });
  };

  return (
    <div className="chat">
      <div className="messages kScroll">
        {messages.map((message, index) => {
          return (
            <Message
              key={index}
              isSelf={message.user.id === user._id}
              isServer={message.user.id === 0}
              headerHidden={
                index > 0 && messages[index - 1].user.id === message.user.id
                  ? true
                  : false
              }
              user={message.user.name}
              body={message.body}
              time={message.time}
            />
          );
        })}
      </div>

      <div className="message-input-container">
        <textarea
          className="textarea has-fixed-size"
          placeholder="Enter a message"
          rows="2"
          name="messageField"
          value={messageField}
          onChange={e => onChange(e)}
          onKeyDown={e => submitMessage(e)}
        />
      </div>
    </div>
  );
};

Chat.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(Chat);
