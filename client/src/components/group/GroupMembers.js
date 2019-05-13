import React, { Component } from "react";
import GroupMember from "./GroupMember";

class GroupMembers extends Component {
  render() {
    return (
      <div className="box" id="groupMembersContainer">
        <div className="onlineStatusTab">
          <div className="subtitle is-size-6 onlineStatusContainer">
            <div className="onlineStatusDot" />
            <h4 className="onlineStatusText">14/20 users</h4>
          </div>
        </div>
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
    );
  }
}

export default GroupMembers;
