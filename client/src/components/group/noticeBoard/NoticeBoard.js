import React, { useState, Fragment } from "react";
import Notice from "./Notice";
import NewNotice from "./NewNotice";

const NoticeBoard = ({
  user,
  isCurrentUserAdmin,
  notices,
  newNotice,
  setNewNotice,
  groupId
}) => {
  const [noticeBoardState, setNoticeBoardState] = useState({
    newNoticeHidden: newNotice ? false : true
  });
  const { newNoticeHidden } = noticeBoardState;

  const showNotice = () => {
    setNoticeBoardState({ ...noticeBoardState, newNoticeHidden: false });
  };
  const hideNotice = () => {
    setNoticeBoardState({ ...noticeBoardState, newNoticeHidden: true });
  };

  if (newNotice && newNoticeHidden) showNotice();

  return (
    <div className="noticeboard">
      <div
        className={`notices is-vcentered ${
          notices.length > 0 ? "has-notices" : ""
        }`}
      >
        {newNoticeHidden && (
          <button
            className="button is-dark new-notice-button"
            onClick={() => showNotice()}
          >
            <span className="icon">
              <i className="fas fa-plus"></i>
            </span>
            <span>Add a Notice</span>
          </button>
        )}
        <NewNotice
          user={user}
          newNotice={newNotice}
          setNewNotice={setNewNotice}
          isHidden={newNoticeHidden}
          hideNotice={hideNotice}
          groupId={groupId}
        />
        {notices &&
          notices.length > 0 &&
          notices
            .slice(0)
            .reverse()
            .map(notice => (
              <Notice
                notice={notice}
                key={notice._id}
                groupId={groupId}
                canUserDelete={
                  isCurrentUserAdmin || notice.authorId === user._id
                }
                isLiked={notice.likes.includes(user._id)}
                numLikes={notice.likes.length}
              />
            ))}
      </div>
    </div>
  );
};

export default NoticeBoard;
