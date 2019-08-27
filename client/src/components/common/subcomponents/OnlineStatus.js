import React, { Fragment } from "react";

const OnlineStatus = ({ users, groups }) => {
  return (
    <div className="online-status-container">
      {groups && (
        <Fragment>
          <div className="online-status-dot" />
          <h4 className="online-status-text">{groups}</h4>
        </Fragment>
      )}
      {users && (
        <Fragment>
          <div className="online-status-dot" />
          <h4 className="online-status-text">{users}</h4>
        </Fragment>
      )}
    </div>
  );
};

export default OnlineStatus;
