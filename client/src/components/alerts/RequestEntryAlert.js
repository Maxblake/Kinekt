import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { getGroup } from "../../actions/group";

import Countdown from "../common/subcomponents/Countdown";

const RequestEntryAlert = ({
  getGroup,
  groupName,
  HRID,
  socket,
  showCloseButton
}) => {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    socket.on("entryRequestAccepted", joinKey => getGroup({ HRID, joinKey }));

    return () => {
      socket.off("entryRequestAccepted");
    };
  }, []);

  const onTimeout = () => {
    setIsActive(false);
    showCloseButton();
  };

  return (
    <div className="custom-action-alert">
      <Countdown totalTime={30} onTimeout={() => onTimeout()} />
      <div className="alert-items">
        <h3>{`Request to join '${groupName}' is pending`}</h3>
        <div className="field is-grouped is-grouped-right">
          <div className="control">
            <button
              disabled={!isActive}
              className="button is-light is-outlined"
              type="button"
            >
              <span>{groupName}</span>
              <span className="icon is-small">
                <i className="fas fa-chalkboard-teacher" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

RequestEntryAlert.propTypes = {
  socket: PropTypes.object.isRequired,
  getGroup: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  socket: state.auth.socket
});

export default connect(
  mapStateToProps,
  { getGroup }
)(RequestEntryAlert);
