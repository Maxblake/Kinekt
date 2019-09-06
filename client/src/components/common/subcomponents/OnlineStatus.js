import React, { Fragment } from "react";

const OnlineStatus = ({ users, maxSize, groups }) => {
  return (
    <div className="online-status-container">
      {groups !== undefined && (
        <Fragment>
          <div className="online-status-dot" />
          <h4 className="online-status-text">{`${groups} groups`}</h4>
        </Fragment>
      )}
      {users !== undefined && (
        <Fragment>
          <div className="online-status-dot" />
          <h4 className="online-status-text">{`${users}${
            maxSize ? `/${maxSize}` : ""
          } users`}</h4>
        </Fragment>
      )}
    </div>
  );
};

export default OnlineStatus;
