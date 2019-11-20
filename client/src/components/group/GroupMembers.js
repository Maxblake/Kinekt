import React, { Fragment } from "react";

import GroupMember from "./GroupMember";
import OnlineStatus from "../common/subcomponents/OnlineStatus";

const GroupMembers = ({ users, creatorId, maxSize, adminOptions }) => {
  const sortedUsers = [];

  if (!!users) {
    let creator = null;
    users.forEach(user => {
      if (user._id === creatorId) {
        creator = user;
      } else if (user.memberType === "admin") {
        sortedUsers.unshift(user);
      } else {
        sortedUsers.push(user);
      }
    });

    if (!!creator) sortedUsers.unshift(creator);
  }

  return (
    <div className="hs-box" id="group-members-container">
      {sortedUsers.length > 0 && (
        <Fragment>
          <div className="header-tab">
            <OnlineStatus
              users={users ? users.length : ""}
              maxSize={maxSize ? maxSize : ""}
            />
          </div>
          <div id="group-members" className="k-scroll">
            {sortedUsers.map((user, index) => {
              return (
                <GroupMember
                  key={index}
                  user={user}
                  adminOptions={adminOptions}
                />
              );
            })}
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default GroupMembers;
