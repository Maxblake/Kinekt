import React, { useState } from "react";
import Notice from "./Notice";
import NewNotice from "./NewNotice";

const NoticeBoard = ({ user, isCurrentUserAdmin, notices, groupId }) => {
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
        {isCurrentUserAdmin && (
          <div
            className="header-tab new-notice-tab"
            onClick={() => showNotice()}
          >
            <i className="fas fa-plus"></i>
          </div>
        )}
        <div className="subtitle is-size-6 has-text-weight-bold">
          Notice Board
        </div>
      </div>
      <div className="notices is-vcentered">
        {isCurrentUserAdmin && (
          <NewNotice
            user={user}
            newNoticeBody={"false"}
            isHidden={newNoticeHidden}
            hideNotice={hideNotice}
            groupId={groupId}
          />
        )}
        {notices.length > 0
          ? notices.map(notice => (
              <Notice
                notice={notice}
                key={notice._id}
                groupId={groupId}
                isCurrentUserAdmin={isCurrentUserAdmin}
              />
            ))
          : newNoticeHidden && (
              <div className="notice has-text-centered">
                There's nothing to see here
              </div>
            )}
      </div>
    </div>
  );
};

export default NoticeBoard;
