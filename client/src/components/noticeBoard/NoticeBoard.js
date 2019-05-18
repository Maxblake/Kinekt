import React, { Component } from "react";
import Carousel from "./carousel/Carousel";
class NoticeBoard extends Component {
  render() {
    const items = [1, 2, 3];
    return (
      <div className="noticeBoard">
        <div className="headerTab">
          <div className="subtitle is-size-6">
            <h4 className="headerText">Notice Board</h4>
          </div>
        </div>
        <Carousel items={items} active={0} />
        {/*<div className="notices">
          <div className="notice">- Nothing is here yet -</div>
    </div>*/}
      </div>
    );
  }
}

export default NoticeBoard;
