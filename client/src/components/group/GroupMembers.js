import React from "react";

import GroupMember from "./GroupMember";
import OnlineStatus from "../common/subcomponents/OnlineStatus";

const GroupMembers = () => {
  return (
    <div className="box" id="group-members-container">
      <div className="header-tab">
        <OnlineStatus users="14/20 users" />
      </div>
      <div id="group-members" className="kScroll">
        <GroupMember memberName="Beemo" status="online" memberType="admin" />
        <GroupMember memberName="Choyobin" status="away" memberType="admin" />
        <GroupMember memberName="Vegeta" status="online" memberType="user" />
        <GroupMember
          memberName="Ralph Lauren"
          status="online"
          memberType="user"
        />
        <GroupMember
          memberName="This is a very long name"
          status="away"
          memberType="user"
        />
        <GroupMember
          memberName="Shorty Pippin"
          status="online"
          memberType="user"
        />
        <GroupMember memberName="Otto" status="away" memberType="user" />
      </div>
    </div>
  );
};

export default GroupMembers;
