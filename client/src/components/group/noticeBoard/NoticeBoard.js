import React, { useState } from "react";
import Notice from "./Notice";
import NewNotice from "./NewNotice";

const NoticeBoard = ({ user, notices, groupId }) => {
  const [noticeBoardState, setNoticeBoardState] = useState({
    newNoticeHidden: true
  });
  const { newNoticeHidden } = noticeBoardState;

  const showNotice = () => {
    setNoticeBoardState({ ...noticeBoardState, newNoticeHidden: false });
  };
  const hideNotice = () => {
    setNoticeBoardState({ ...noticeBoardState, newNoticeHidden: true });
  };

  return (
    <div className="noticeboard">
      <div className="header-tab">
        <div className="header-tab new-notice-tab" onClick={() => showNotice()}>
          <i className="fas fa-plus"></i>
        </div>
        <div className="subtitle is-size-6 has-text-weight-bold">
          Notice Board
        </div>
      </div>
      <div className="notices is-vcentered">
        <NewNotice
          user={user}
          isHidden={newNoticeHidden}
          hideNotice={hideNotice}
          groupId={groupId}
        />
        {notices.length > 10 ? (
          notices.map((noticeInfo, index) => (
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
