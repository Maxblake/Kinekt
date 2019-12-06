import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { getGroup, setBannedState } from "../../actions/group";

//import Countdown from "../common/subcomponents/Countdown";

const RequestEntryAlert = ({
  getGroup,
  setBannedState,
  groupName,
  HRID,
  auth: { socket, user },
  closeAlert,
  showCloseButton,
  shouldResetAlert,
  setAlertReset
}) => {
  const [isActive, setIsActive] = useState(true);
  const [entryRequestAnswer, setEntryRequestAnswer] = useState("");

  useEffect(() => {
    socket.on("entryRequestAnswered", ({ answer, joinKey, HRID }) =>
      onRequestAnswered(answer, joinKey, HRID)
    );

    return () => {
      socket.emit("cancelEntryRequest", { HRID, userId: user._id });
      socket.off("entryRequestAnswered");
    };
  }, []);

  useEffect(() => {
    if (shouldResetAlert) {
      setIsActive(true);
      setEntryRequestAnswer("");
      setAlertReset();
    }
  }, [shouldResetAlert]);

  /*   const onTimeout = () => {
    setIsActive(false);
    showCloseButton();
  }; */

  const onRequestAnswered = (answer, joinKey, answeredHRID) => {
    if (answeredHRID !== HRID) return;

    setEntryRequestAnswer(answer);

    if (answer === "Accepted") {
      getGroup({ HRID, joinKey });
    } else if (answer === "Banned") {
      setBannedState(HRID, user._id);
    }

    showCloseButton();
  };

  const cancelRequest = () => {
    socket.emit("cancelEntryRequest", { HRID, userId: user._id });
    closeAlert();
  };

  //<Countdown totalTime={60 * 15} onTimeout={() => onTimeout()} />

  return (
    <div className="custom-action-alert">
      {entryRequestAnswer === "Rejected" ? (
        <span className="icon is-large">
          <i className="fas fa-2x fa-times-circle"></i>
        </span>
      ) : entryRequestAnswer === "Banned" ? (
        <span className="icon is-large">
          <i className="fas fa-2x fa-ban"></i>
        </span>
      ) : entryRequestAnswer === "Accepted" ? (
        <span className="icon is-large">
          <i className="fas fa-2x fa-check-circle"></i>
        </span>
      ) : (
        <span className="icon">
          <i className="fas fa-paper-plane"></i>
        </span>
      )}
      <div className="alert-items">
        <h3>
          {!isActive
            ? `Request to join '${groupName}'has timed out`
            : entryRequestAnswer === "Accepted"
            ? `Request to join '${groupName}' is approved`
            : entryRequestAnswer === "Rejected" ||
              entryRequestAnswer === "Banned"
            ? `Request to join '${groupName}' is denied`
            : `Request to join '${groupName}' is pending`}
        </h3>
        {entryRequestAnswer !== "Rejected" && entryRequestAnswer !== "Banned" && (
          <div className="field is-grouped is-grouped-right">
            {entryRequestAnswer === "Accepted" ? (
              <div className="control">
                <Link
                  onClick={() => closeAlert()}
                  className="button is-light is-outlined"
                  to={`/k/k/group/${HRID}`}
                >
                  <span className="max-text-length-3">{groupName}</span>
                  <span className="icon is-small">
                    <i className="fas fa-chalkboard-teacher" />
                  </span>
                </Link>
              </div>
            ) : (
              <div className="control">
                <div
                  onClick={() => cancelRequest()}
                  className="button is-light is-outlined"
                >
                  Cancel
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

RequestEntryAlert.propTypes = {
  auth: PropTypes.object.isRequired,
  getGroup: PropTypes.func.isRequired,
  setBannedState: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { getGroup, setBannedState })(
  RequestEntryAlert
);
