import React from "react";
import Notice from "./Notice";

const NoticeBoard = ({ noticeInfoArray }) => {
  return (
    <div className="noticeboard">
      <div className="header-tab">
        <div className="subtitle is-size-6 has-text-weight-bold">
          Notice Board
        </div>
      </div>
      {noticeInfoArray.length > 0 ? (
        noticeInfoArray.map((noticeInfo, index) => <Notice key={index} />)
      ) : (
        <div className="notices">
          <div className="notice">- Nothing to see here -</div>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;
