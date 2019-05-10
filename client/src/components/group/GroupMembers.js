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
        <GroupMember memberName="Beemo" />
        <GroupMember memberName="Choyobin" />
        <GroupMember memberName="Vegeta" />
        <GroupMember memberName="Ralph Lauren" />
        <GroupMember memberName="This is a very long name" />
        <GroupMember memberName="Shorty Pippin" />
        <GroupMember memberName="Otto" />
      </div>
    );
  }
}

export default GroupMembers;
