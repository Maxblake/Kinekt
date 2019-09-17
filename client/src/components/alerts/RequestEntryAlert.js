import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { getGroup } from "../../actions/group";

import Countdown from "../common/subcomponents/Countdown";

const RequestEntryAlert = ({
  getGroup,
  groupName,
  HRID,
  socket,
  closeAlert,
  showCloseButton
}) => {
  const [isActive, setIsActive] = useState(true);
  const [entryRequestAnswer, setEntryRequestAnswer] = useState("");

  useEffect(() => {
    socket.on("entryRequestAnswered", ({ answer, joinKey, HRID }) =>
      onRequestAnswered(answer, joinKey, HRID)
    );

    return () => {
      socket.off("entryRequestAnswered");
    };
  }, []);

  const onTimeout = () => {
    setIsActive(false);
    showCloseButton();
  };

  const onRequestAnswered = (answer, joinKey, answeredHRID) => {
    if (answeredHRID !== HRID) return;

    setEntryRequestAnswer(answer);

    if (answer === "Accepted") {
      getGroup({ HRID, joinKey });
    }

    showCloseButton();
  };

  return (
    <div className="custom-action-alert">
      {entryRequestAnswer === "Rejected" ? (
        <span className="icon is-large">
          <i className="fas fa-2x fa-times-circle"></i>
        </span>
      ) : entryRequestAnswer === "Accepted" ? (
        <span className="icon is-large">
          <i className="fas fa-2x fa-check-circle"></i>
        </span>
      ) : (
        <Countdown totalTime={45} onTimeout={() => onTimeout()} />
      )}
      <div className="alert-items">
        <h3>
          {!isActive
            ? `Request to join '${groupName}'has timed out`
            : entryRequestAnswer === "Accepted"
            ? `Request to join '${groupName}' is approved`
            : entryRequestAnswer === "Rejected"
            ? `Request to join '${groupName}' is denied`
            : `Request to join '${groupName}' is pending`}
        </h3>
        {entryRequestAnswer === "Accepted" && (
          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <Link
                onClick={() => closeAlert()}
                className="button is-light is-outlined"
                to={`/k/k/group/${HRID}`}
              >
                <span>{groupName}</span>
                <span className="icon is-small">
                  <i className="fas fa-chalkboard-teacher" />
                </span>
              </Link>
            </div>
          </div>
        )}
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
