import React, { Fragment } from "react";

import GroupMember from "./GroupMember";
import OnlineStatus from "../common/subcomponents/OnlineStatus";

const GroupMembers = ({ users, maxSize, adminOptions }) => {
  return (
    <div className="hs-box" id="group-members-container">
      {users && (
        <Fragment>
          <div className="header-tab">
            <OnlineStatus
              users={`${users.length}${maxSize ? `/${maxSize}` : ""} users`}
            />
          </div>
          <div id="group-members" className="kScroll">
            {users.map((user, index) => {
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
