import React, { Fragment } from "react";

const OnlineStatus = ({ users, maxSize, groups }) => {
  const usersInt = parseInt(users);
  const groupsInt = parseInt(groups);

  return (
    <div className="online-status-container">
      {groups !== undefined && (
        <Fragment>
          <div
            className={`online-status-dot ${
              Number.isNaN(groupsInt) ? "" : groupsInt < 1 ? "status-away" : ""
            }`}
          />
          <h4 className="online-status-text">{`${
            Number.isNaN(groupsInt) ? "~" : groupsInt
          } group${groupsInt !== 1 ? "s" : ""}`}</h4>
        </Fragment>
      )}
      {users !== undefined && (
        <Fragment>
          <div
            className={`online-status-dot ${
              Number.isNaN(usersInt) ? "" : usersInt < 1 ? "status-away" : ""
            }`}
          />
          <h4 className="online-status-text">{`${
            Number.isNaN(usersInt) ? "~" : usersInt
          }${maxSize ? `/${maxSize}` : ""} member${
            maxSize > 1 || usersInt !== 1 ? "s" : ""
          }`}</h4>
        </Fragment>
      )}
    </div>
  );
};

export default OnlineStatus;
