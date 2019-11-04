import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import debounce from "lodash.debounce";

import moment from "moment";

import Message from "./Message";

const Chat = ({
  auth: { user, socket },
  setNewNotice,
  isCurrentUserAdmin,
  chat
}) => {
  const [messageData, setMessageData] = useState({
    messageField: "",
    messages: chat
      ? chat.map(message => ({
          ...message,
          time: moment(message.time)
            .local()
            .format("h:mm A")
        }))
      : [],
    showChat: false
  });

  const { messageField, messages, showChat } = messageData;
  let messagesDiv = React.useRef(null);
  let showNewMsgTab = React.useRef(false);

  useEffect(() => {
    socket.on("receiveMessage", receiveMessage);

    return () => {
      socket.off("receiveMessage");
    };
  }, [messageData]);

  const receiveMessage = message => {
    checkShouldShowNewMsgTab(true);

    console.log(message.time);

    setMessageData({
      ...messageData,
      messages: messages.concat({
        ...message,
        time: moment(message.time)
          .local()
          .format("h:mm A")
      })
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

  const scrollToBottom = () => {
    messagesDiv.current.scrollTop =
      messagesDiv.current.scrollHeight - messagesDiv.current.offsetHeight + 4;
  };

  const isScrollMostlyAtBottom = () => {
    if (messagesDiv.current) {
      return (
        messagesDiv.current.scrollHeight -
          (messagesDiv.current.offsetHeight + messagesDiv.current.scrollTop) <
        5
      );
    }
    return false;
  };

  const checkShouldShowNewMsgTab = newMsgReceived => {
    if (!isScrollMostlyAtBottom()) {
      showNewMsgTab.current = newMsgReceived
        ? newMsgReceived
        : showNewMsgTab.current;
    } else {
      showNewMsgTab.current = false;
    }

    setMessageData({ ...messageData });
  };

  return (
    <Fragment>
      <div className="chat">
        <div className="show-chat-btn" onClick={() => toggleChat()}>
          Chat
        </div>
        <div
          className={`messages-scroll-container kScroll ${
            showChat ? "" : "is-hidden-touch"
          }`}
          ref={messagesDiv}
          onScroll={debounce(() => checkShouldShowNewMsgTab(), 50)}
        >
          <div className="messages">
            {messages.map((message, index) => {
              return (
                <Message
                  key={index}
                  isSelf={message.user.id === user._id}
                  isServer={message.user.id === 0}
                  isCurrentUserAdmin={isCurrentUserAdmin}
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
        </div>

        <div
          className={`message-input-container ${
            showChat ? "" : "is-hidden-touch"
          }`}
        >
          {showNewMsgTab.current && (
            <div
              className="footer-tab clickable-text"
              onClick={() => scrollToBottom()}
            >
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
