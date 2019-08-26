import React from "react";

import Chat from "../chat/Chat";
import NoticeBoard from "../noticeBoard/NoticeBoard";
import GroupDetails from "../common/subcomponents/GroupDetails";
import Image from "../common/subcomponents/Image";

const GroupConsole = ({ group, imgSrc }) => {
  return (
    <div className="box flex-row-wrap" id="groupConsole">
      <div className="groupChat">
        <Chat />
      </div>
      <div className="flex-row-wrap">
        <GroupDetails group={group} />

        <div className="group-image">
          <Image figureClass="is-2by1" src={imgSrc} alt="Placeholder image" />
        </div>
        <NoticeBoard items={[1, 2, 3]} />
      </div>
    </div>
  );
};

export default GroupConsole;
