import React, { useState } from "react";

import Chat from "./chat/Chat";
import NoticeBoard from "./noticeBoard/NoticeBoard";
import GroupDetails from "../common/subcomponents/GroupDetails";
import Image from "../common/subcomponents/Image";

const GroupConsole = ({ user, isCurrentUserAdmin, group, imgSrc }) => {
  const [groupConsoleState, setGroupConsoleState] = useState({
    newNotice: null
  });
  const { newNotice } = groupConsoleState;

  const setNewNotice = passedNewNotice => {
    setGroupConsoleState({ ...groupConsoleState, newNotice: passedNewNotice });
  };

  return (
    <div className="is-flex" id="group-console">
      <div className="console-card-and-nb">
        <div className="flex-row-wrap console-card">
          <GroupDetails group={group} />
          <div className="group-image">
            {group.accessLevel === "Protected" ? (
              <div className="tag card-tag">
                <span className="icon">
                  <i className="fas fa-lock" />
                </span>
                <span>Protected</span>
              </div>
            ) : group.accessLevel === "Private" ? (
              <div className="tag card-tag">
                <span className="icon">
                  <i className="fas fa-lock" />
                </span>
                <span>Private</span>
              </div>
            ) : (
              <div className="tag card-tag">
                <span className="icon">
                  <i className="fas fa-door-open" />
                </span>
                <span>Public</span>
              </div>
            )}
            <Image figureClass="is-2by1" src={imgSrc} alt="Placeholder image" />
          </div>
        </div>
        <NoticeBoard
          user={user}
          isCurrentUserAdmin={isCurrentUserAdmin}
          groupId={group._id}
          notices={group.notices}
          newNotice={newNotice}
          setNewNotice={setNewNotice}
        />
      </div>
      <div className="group-chat">
        <Chat
          setNewNotice={setNewNotice}
          isCurrentUserAdmin={isCurrentUserAdmin}
          chat={group.chat}
        />
        <div className="corner-fill"></div>
      </div>
    </div>
  );
};

export default GroupConsole;
