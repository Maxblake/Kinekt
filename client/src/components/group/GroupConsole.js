import React from "react";

import Chat from "./chat/Chat";
import NoticeBoard from "./noticeBoard/NoticeBoard";
import GroupDetails from "../common/subcomponents/GroupDetails";
import Image from "../common/subcomponents/Image";

const GroupConsole = ({ user, group, imgSrc }) => {
  return (
    <div className="flex-row-wrap" id="group-console">
      <div className="group-chat">
        <Chat />
        <div className="corner-fill"></div>
      </div>
      <div className="group-details-and-nb flex-row-wrap">
        <GroupDetails group={group} />

        <div className="group-image">
          <Image figureClass="is-2by1" src={imgSrc} alt="Placeholder image" />
        </div>
        <NoticeBoard user={user} noticeInfoArray={[1, 2, 3]} />
      </div>
    </div>
  );
};

export default GroupConsole;
