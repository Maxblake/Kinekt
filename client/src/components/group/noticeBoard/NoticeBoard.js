import React from "react";
import Notice from "./Notice";
import NewNotice from "./NewNotice";

const NoticeBoard = ({ user, noticeInfoArray }) => {
  return (
    <div className="noticeboard">
      <div className="header-tab">
        <div className="subtitle is-size-6 has-text-weight-bold">
          Notice Board
        </div>
      </div>
      <div className="notices is-vcentered">
        <NewNotice user={user} />
        {noticeInfoArray.length > 10 ? (
          noticeInfoArray.map((noticeInfo, index) => (
            <Notice noticeInfo={noticeInfo} key={index} />
          ))
        ) : (
          <div className="notice has-text-centered">
            There's nothing to see here
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;
