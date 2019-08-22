import React from "react";

import Carousel from "./carousel/Carousel";

const NoticeBoard = () => {
  return (
    <div className="noticeBoard">
      <div className="headerTab">
        <div className="subtitle is-size-6 has-text-weight-bold">
          Notice Board
        </div>
      </div>
      <Carousel items={[1, 2, 3, 4, 5]} active={0} />
      {/*<div className="notices">
          <div className="notice">- Nothing is here yet -</div>
    </div>*/}
    </div>
  );
};

export default NoticeBoard;
