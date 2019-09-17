import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import EntryRequestReceivedAlert from "./EntryRequestReceivedAlert";
import RequestEntryAlert from "./RequestEntryAlert";

import { removeAlert } from "../../actions/alert";

const Alert = ({ socket, alerts, errors, removeAlert }) => {
  const [alertState, setAlertState] = useState({ showCloseButton: false });

  const { showCloseButton } = alertState;

  let alertsAndErrors = [];

  alerts.forEach(alert => {
    alertsAndErrors.push({
      id: alert.id,
      alertStatus: alert.alertStatus,
      msg: alert.msg,
      alertType: alert.alertType,
      props: alert.props
    });
  });

  errors.forEach(error => {
    if (error.param === "alert") {
      alertsAndErrors.push({
        id: errors.length,
        alertStatus: "is-danger",
        msg: error.msg,
        alertType: "text"
      });
    }
  });

  if (!!alertsAndErrors.length) {
    return alertsAndErrors.map(alert => {
      let alertBody = null;

      switch (alert.alertType) {
        case "entryRequestReceived": {
          alertBody = (
            <EntryRequestReceivedAlert
              {...alert.props}
              showCloseButton={() =>
                setAlertState({ ...alertState, showCloseButton: true })
              }
            />
          );
          break;
        }
        case "requestEntry": {
          socket.emit("requestEntry", alert.props.groupId);
          alertBody = (
            <RequestEntryAlert
              {...alert.props}
              showCloseButton={() =>
                setAlertState({ ...alertState, showCloseButton: true })
              }
            />
          );
          break;
        }
        case "text":
        default: {
          alertBody = alert.msg;
        }
      }

      return (
        <div
          key={alert.id}
          className={`notification has-text-centered ${
            alert.alertStatus ? alert.alertStatus : ""
          }`}
        >
          {(alert.alertType === "text" || showCloseButton) && (
            <button className="delete" onClick={() => removeAlert(alert.id)} />
          )}
          {alertBody}
        </div>
      );
    });
  }
  return null;
};

Alert.propTypes = {
  socket: PropTypes.object,
  alerts: PropTypes.array.isRequired,
  errors: PropTypes.array.isRequired,
  removeAlert: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  alerts: state.alert,
  errors: state.error,
  socket: state.auth.socket
});

export default connect(
  mapStateToProps,
  { removeAlert }
)(Alert);
