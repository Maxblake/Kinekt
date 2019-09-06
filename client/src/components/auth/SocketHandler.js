import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { openSocket } from "../../actions/helpers/ioClient";
import { setAlert } from "../../actions/alert";

import IdleTimer from "react-idle-timer";

const SocketHandler = ({
  auth: { socket, user },
  openSocket,
  setAlert,
  groups,
  groupType: { groupType, groupTypes }
}) => {
  const [interval, setIntervalState] = useState(undefined);

  useEffect(() => {
    if (!socket) {
      openSocket();
    }

    if (user) {
      console.log("listennig for kick");
      socket.on("kickedFromGroupAlert", kickedUser => {
        if (!kickedUser.allUsers && kickedUser.id !== user._id) return;
        setAlert(
          `You have been kicked from the group '${user.currentGroup.name}'`,
          "is-warning"
        );
      });
    }

    if (groups.length > 0 || groupType || groupTypes.length > 0) {
      onActive();
    }

    return () => {
      if (socket) {
        console.log("stopped listnestgnwsdfg for kick");

        socket.off("kickedFromGroupAlert");
      }
    };
  }, [groups, groupType, groupTypes, user]);

  const onActive = () => {
    clearInterval(interval);
    getGroupAndUserNumbers();
    setIntervalState(setInterval(() => getGroupAndUserNumbers(), 8000));
  };

  const onIdle = () => {
    clearInterval(interval);
  };

  const getGroupAndUserNumbers = () => {
    const groupAndGroupTypeIds = {
      groups: groups.length > 0 ? groups.map(group => group._id) : undefined,
      groupTypes:
        groupTypes.length > 0
          ? groupTypes.map(groupType => groupType._id)
          : undefined,
      groupType: !!groupType ? groupType._id : undefined
    };

    socket.emit("getGroupAndUserNumbers", groupAndGroupTypeIds);
  };

  return (
    <IdleTimer
      element={document}
      onActive={() => onActive()}
      onIdle={() => onIdle()}
      timeout={1000 * 60 * 1}
    />
  );
};

SocketHandler.propTypes = {
  auth: PropTypes.object.isRequired,
  groups: PropTypes.array.isRequired,
  groupType: PropTypes.object.isRequired,
  openSocket: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  groups: state.group.groups,
  groupType: state.groupType
});

export default connect(
  mapStateToProps,
  { openSocket, setAlert }
)(SocketHandler);
