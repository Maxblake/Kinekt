import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import EntryRequestReceivedAlert from "./EntryRequestReceivedAlert";

import { removeAlert } from "../../actions/alert";

const Alert = ({ alerts, errors, removeAlert }) => {
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

      console.log(alert);

      switch (alert.alertType) {
        case "entryRequestReceived": {
          alertBody = <EntryRequestReceivedAlert {...alert.props} />;
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
          <button className="delete" onClick={() => removeAlert(alert.id)} />
          {alertBody}
        </div>
      );
    });
  }
  return null;
};

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
  errors: PropTypes.array.isRequired,
  removeAlert: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  alerts: state.alert,
  errors: state.error
});

export default connect(
  mapStateToProps,
  { removeAlert }
)(Alert);
