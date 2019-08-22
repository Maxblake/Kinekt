import React, { Fragment } from "react";

const OnlineStatus = ({ users, groups }) => {
  return (
    <div className="onlineStatusContainer">
      {groups && (
        <Fragment>
          <div className="onlineStatusDot" />
          <h4 className="onlineStatusText">{groups}</h4>
        </Fragment>
      )}
      {users && (
        <Fragment>
          <div className="onlineStatusDot" />
          <h4 className="onlineStatusText">{users}</h4>
        </Fragment>
      )}
    </div>
  );
};

export default OnlineStatus;
