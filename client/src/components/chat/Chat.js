import React from "react";

import Message from "./Message";

const Chat = () => {
  return (
    <div className="chat">
      <div className="messages kScroll">
        <Message
          body="Lorem ipsum dolor sit amet"
          user="Beemo"
          time="2:30 PM"
        />
        <Message body="consectetur" user="Choyobin" time="2:43 PM" />
        <Message
          body="adipisicing elit. Quidem cum nulla soluta. Ipsa necessitatibus ullam, asperiores"
          user="Otto"
          time="3:38 PM"
        />
        <Message body="eveniet vero aut enim" user="Beemo" time="5:10 PM" />
        <Message body="consectetur" user="Choyobin" time="2:43 PM" />
        <Message
          body="consectetur weep woop blop"
          user="Choyobin"
          time="2:43 PM"
        />
        <Message body="consectetur bleep" user="Choyobin" time="2:43 PM" />
      </div>
      <div className="message-input-container">
        <textarea
          className="textarea has-fixed-size"
          placeholder="Enter a message"
          rows="2"
        />
      </div>
    </div>
  );
};

export default Chat;
