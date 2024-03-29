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
          body: message.body,
          user: message.user,
          time: moment(message.creationTimestamp)
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
    const newMessages = [];
    let numNewMessages = chat.length - messages.length;

    if (numNewMessages > 0) {
      checkShouldShowNewMsgTab(true);

      for (; numNewMessages > 0; numNewMessages--) {
        const newMessage = {
          ...chat[chat.length - numNewMessages],
          time: moment(chat[chat.length - numNewMessages].time)
            .local()
            .format("h:mm A")
        };
        newMessages.push(newMessage);
      }

      setMessageData({
        ...messageData,
        messages: messages.concat(newMessages)
      });
    }
  }, [chat]);

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
          className={`messages-scroll-container k-scroll ${
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
                  isServer={message.user.id.toString() === "0"}
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
