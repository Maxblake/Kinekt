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
      <div className="group-chat">
        <Chat setNewNotice={setNewNotice} />
        <div className="corner-fill"></div>
      </div>
      <div className="group-details-and-nb flex-row-wrap">
        <GroupDetails group={group} />

        <div className="group-image">
          <Image figureClass="is-2by1" src={imgSrc} alt="Placeholder image" />
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
    </div>
  );
};

export default GroupConsole;
