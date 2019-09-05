import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { openSocket } from "../../actions/helpers/ioClient";

import IdleTimer from "react-idle-timer";

const SocketHandler = ({
  socket,
  openSocket,
  groups,
  groupType: { groupType, groupTypes }
}) => {
  const [interval, setIntervalState] = useState(undefined);

  useEffect(() => {
    if (!socket) {
      openSocket();
    }

    if (groups.length > 0 || groupType || groupTypes.length > 0) {
      onActive();
    }
  }, [groups, groupType, groupTypes]);

  const onActive = () => {
    clearInterval(interval);
    getGroupAndUserNumbers();
    setIntervalState(setInterval(() => getGroupAndUserNumbers(), 3000));
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
      timeout={1000 * 7 * 1}
    />
  );
};

SocketHandler.propTypes = {
  socket: PropTypes.object,
  groups: PropTypes.array.isRequired,
  groupType: PropTypes.object.isRequired,
  openSocket: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  socket: state.auth.socket,
  groups: state.group.groups,
  groupType: state.groupType
});

export default connect(
  mapStateToProps,
  { openSocket }
)(SocketHandler);
