import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import EntryRequestReceivedAlert from "./EntryRequestReceivedAlert";
import RequestEntryAlert from "./RequestEntryAlert";

import { removeAlert, setAlertReset } from "../../actions/alert";

const Alert = ({ alerts, errors, removeAlert, setAlertReset }) => {
  const [alertState, setAlertState] = useState([]);

  let alertsAndErrors = [];

  alerts.forEach(alert => {
    alertsAndErrors.push({
      shouldResetAlert: alert.shouldResetAlert,
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

  const closeAlertAndClearSettings = alertId => {
    setAlertState(
      alertState.filter(alertSettings => alertSettings.id !== alertId)
    );
    removeAlert(alertId);
  };

  const showCloseButton = alertId => {
    const currentAlertSettings = alertState.find(
      alertSettings => alertSettings.id === alertId
    );

    setAlertState([
      ...alertState,
      { ...currentAlertSettings, id: alertId, showCloseButton: true }
    ]);
  };

  if (alertsAndErrors.length > 0) {
    return (
      <div className="notification-container k-scroll-desktop">
        {alertsAndErrors.map(alert => {
          let alertBody = null;

          switch (alert.alertType) {
            case "entryRequestReceived": {
              alertBody = (
                <EntryRequestReceivedAlert
                  {...alert.props}
                  closeAlert={() => closeAlertAndClearSettings(alert.id)}
                  showCloseButton={() => showCloseButton(alert.id)}
                />
              );
              break;
            }
            case "requestEntry": {
              alertBody = (
                <RequestEntryAlert
                  {...alert.props}
                  shouldResetAlert={alert.shouldResetAlert}
                  setAlertReset={() => setAlertReset(alert.id)}
                  closeAlert={() => closeAlertAndClearSettings(alert.id)}
                  showCloseButton={() => showCloseButton(alert.id)}
                />
              );
              break;
            }
            case "text":
            default: {
              alertBody = alert.msg;
            }
          }

          const currentAlertSettings =
            alertState.find(alertSettings => alertSettings.id === alert.id) ||
            {};

          return (
            <div
              key={alert.id}
              className={`notification has-text-centered ${
                alert.alertStatus ? alert.alertStatus : ""
              }`}
            >
              {(alert.alertType === "text" ||
                currentAlertSettings.showCloseButton) && (
                <button
                  className="delete"
                  onClick={() => closeAlertAndClearSettings(alert.id)}
                />
              )}
              {alertBody}
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
  errors: PropTypes.array.isRequired,
  removeAlert: PropTypes.func.isRequired,
  setAlertReset: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  alerts: state.alert,
  errors: state.error
});

export default connect(mapStateToProps, { removeAlert, setAlertReset })(Alert);
