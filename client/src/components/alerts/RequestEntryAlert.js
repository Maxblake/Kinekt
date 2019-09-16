import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Countdown from "../common/subcomponents/Countdown";

const RequestEntryAlert = ({ groupName, socket }) => {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    socket.on("entryRequestAccepted", () => console.log("woop"));

    return () => {
      socket.off("entryRequestAccepted");
    };
  }, []);

  return (
    <div className="request-entry-alert">
      <Countdown totalTime={30} onTimeout={() => setIsActive(false)} />
      <div className="alert-items">
        <h3>{`Request to join ${groupName} pending`}</h3>
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
  socket: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  socket: state.auth.socket
});

export default connect(
  mapStateToProps,
  null
)(RequestEntryAlert);
