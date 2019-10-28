import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import debounce from "lodash.debounce";

import moment from "moment";

import Message from "./Message";

const Chat = ({ auth: { user, socket }, setNewNotice }) => {
  const [messageData, setMessageData] = useState({
    messageField: "",
    messages: [],
    showChat: false,
    showNewMsgTab: false
  });

  const { messageField, messages, showChat, showNewMsgTab } = messageData;
  let messagesDiv = React.useRef(null);

  useEffect(() => {
    socket.on("receiveMessage", receiveMessage);
    checkShouldShowNewMsgTab(true);

    if (isScrollMostlyAtBottom()) {
      if (messagesDiv.current) {
        messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight;
      }
    }

    return () => {
      socket.off("receiveMessage");
    };
  }, [messages]);

  const receiveMessage = message => {
    setMessageData({
      ...messageData,
      messages: messages.concat({ ...message, time: moment().format("h:mm A") })
    });
  };

  const submitMessage = async e => {
    if (e.keyCode === 13 && e.shiftKey === false) {
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

  const toggleChat = () => {
    setMessageData({
      ...messageData,
      showChat: !showChat
    });
  };

  const isScrollMostlyAtBottom = () => {
    if (messagesDiv.current) {
      return (
        messagesDiv.current.offsetHeight + messagesDiv.current.scrollTop + 41 >=
        messagesDiv.current.scrollHeight
      );
    }
    return false;
  };

  const checkShouldShowNewMsgTab = newMsgReceived => {
    if (!isScrollMostlyAtBottom()) {
      setMessageData({ ...messageData, showNewMsgTab: newMsgReceived });
    } else {
      setMessageData({ ...messageData, showNewMsgTab: false });
    }
  };

  return (
    <Fragment>
      <div className="chat">
        <div className="show-chat-btn" onClick={() => toggleChat()}>
          Chat
        </div>
        <div
          ref={messagesDiv}
          className={`messages kScroll ${showChat ? "" : "is-hidden-touch"}`}
          onScroll={debounce(() => checkShouldShowNewMsgTab(showNewMsgTab), 50)}
        >
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
                user={message.user}
                body={message.body}
                time={message.time}
                setNewNotice={setNewNotice}
              />
            );
          })}
        </div>

        <div
          className={`message-input-container ${
            showChat ? "" : "is-hidden-touch"
          }`}
        >
          {showNewMsgTab && (
            <div className="footer-tab clickable-text">
              <span>new messages</span>
              <span className="icon is-small">
                <i
                  className="fas fa-sm fa-long-arrow-alt-down"
                  aria-hidden="true"
                />
              </span>
            </div>
          )}
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
    </Fragment>
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
