import React, { Component } from "react";

class NoticeBoard extends Component {
  render() {
    return (
      <div className="noticeBoard">
        <div className="headerTab">
          <div className="subtitle is-size-5">
            <h4 className="headerText">Notice Board</h4>
          </div>
        </div>
        <div className="notices">
          <div className="notice">- Nothing is here yet -</div>
        </div>
      </div>
    );
  }
}

export default NoticeBoard;
