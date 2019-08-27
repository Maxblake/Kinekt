import React from "react";

import Carousel from "./carousel/Carousel";

const NoticeBoard = ({ items }) => {
  return (
    <div className="noticeboard">
      <div className="header-tab">
        <div className="subtitle is-size-6 has-text-weight-bold">
          Notice Board
        </div>
      </div>
      {items.length ? (
        <Carousel items={items} active={0} />
      ) : (
        <div className="notices">
          <div className="notice">- Nothing to see here -</div>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;
