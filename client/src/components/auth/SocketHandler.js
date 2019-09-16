import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  openSocket,
  clearGroupAndGroupTypeStates
} from "../../actions/helpers/ioClient";
import { setTextAlert, setCustomAlert } from "../../actions/alert";

import IdleTimer from "react-idle-timer";

const SocketHandler = ({
  auth: { socket, user },
  openSocket,
  setTextAlert,
  setCustomAlert,
  clearGroupAndGroupTypeStates,
  group: { groups, group },
  groupType: { groupType, groupTypes }
}) => {
  const [interval, setIntervalState] = useState(undefined);

  useEffect(() => {
    if (!socket) {
      openSocket();
    }

    if (user) {
      socket.on("kickedFromGroupAlert", kickedFromGroupAlert);
      socket.on("entryRequestReceived", entryRequestReceived);
    }

    if (groups.length > 0 || groupType || groupTypes.length > 0) {
      onActive();
    }

    return () => {
      if (socket) {
        socket.off("kickedFromGroupAlert");
        socket.off("entryRequestReceived");
      }
    };
  }, [group, groups, groupType, groupTypes, user]);

  const kickedFromGroupAlert = payload => {
    const { isBanned, kickedUser } = payload;

    if (!kickedUser.allUsers && kickedUser.userId !== user._id) return;

    socket.emit("leaveCurrentGroup", { isKicked: true });

    clearGroupAndGroupTypeStates();
    setTextAlert(
      `You have been ${isBanned ? "banned" : "kicked"} from the group '${
        user.currentGroup.name
      }'`,
      `is-${isBanned ? "danger" : "warning"}`
    );
  };

  const entryRequestReceived = userInfo => {
    if (group.users) {
      const groupUser = group.users.find(
        groupUser => groupUser._id === user._id
      );

      if (groupUser && groupUser.memberType === "admin") {
        setCustomAlert(userInfo.id, "is-info", "entryRequestReceived", {
          userInfo
        });
      }
    }
  };

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
  group: PropTypes.object.isRequired,
  groupType: PropTypes.object.isRequired,
  openSocket: PropTypes.func.isRequired,
  setTextAlert: PropTypes.func.isRequired,
  setCustomAlert: PropTypes.func.isRequired,
  clearGroupAndGroupTypeStates: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  group: state.group,
  groupType: state.groupType
});

export default connect(
  mapStateToProps,
  { openSocket, setTextAlert, setCustomAlert, clearGroupAndGroupTypeStates }
)(SocketHandler);
