import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  openSocket,
  adjustStateForKickedUser
} from "../../actions/helpers/ioClient";
import { setTextAlert, setCustomAlert } from "../../actions/alert";
import { deleteGroup } from "../../actions/group";

import IdleTimer from "react-idle-timer";

const SocketHandler = ({
  auth: { socket, user },
  openSocket,
  setTextAlert,
  setCustomAlert,
  adjustStateForKickedUser,
  deleteGroup,
  group: { groups, group },
  groupType: { groupType, groupTypes }
}) => {
  const [interval, setIntervalState] = useState(undefined);

  let stateRef = React.useRef(null);

  useEffect(() => {
    stateRef.current = { group, groups, groupType, groupTypes };

    if (!socket) {
      openSocket();
    } else {
      socket.on("preDeleteActionsComplete", () => deleteGroup(group._id));
      socket.on("groupExpired", groupExpired);

      if (user) {
        socket.on("kickedFromGroupAlert", kickedFromGroupAlert);
        socket.on("entryRequestReceived", entryRequestReceived);
      }
    }

    if ((groups && groups.length > 0) || groupType || groupTypes.length > 0) {
      onActive();
    }

    return () => {
      if (socket) {
        socket.off("kickedFromGroupAlert");
        socket.off("entryRequestReceived");
        socket.off("preDeleteActionsComplete");
        socket.off("groupExpired");
      }
    };
  }, [group, groups, groupType, groupTypes, user]);

  const kickedFromGroupAlert = payload => {
    const { isBanned, allUsers, userId } = payload;

    if (!allUsers && userId !== user._id) return;

    socket.emit("leaveSocket");

    adjustStateForKickedUser();
    setTextAlert(
      `You have been ${isBanned ? "banned" : "kicked"} from the group '${
        user.currentGroup.name
      }'`,
      `is-${isBanned ? "danger" : "warning"}`
    );
  };

  const entryRequestReceived = userInfo => {
    if (!!group && group.users) {
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

  const groupExpired = () => {
    setTextAlert(`'${group.name}' has expired`, "is-danger");

    socket.emit("leaveCurrentGroup");
    //adjustStateForKickedUser();
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
      groups:
        stateRef.current.groups && stateRef.current.groups.length > 0
          ? stateRef.current.groups.map(group => group._id)
          : undefined,
      groupTypes:
        stateRef.current.groupTypes.length > 0
          ? stateRef.current.groupTypes.map(groupType => groupType._id)
          : undefined,
      groupType: !!stateRef.current.groupType
        ? stateRef.current.groupType._id
        : undefined
    };

    console.log(groupAndGroupTypeIds);

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
  adjustStateForKickedUser: PropTypes.func.isRequired,
  deleteGroup: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  group: state.group,
  groupType: state.groupType
});

export default connect(
  mapStateToProps,
  {
    openSocket,
    setTextAlert,
    setCustomAlert,
    adjustStateForKickedUser,
    deleteGroup
  }
)(SocketHandler);
