import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { removeAlert } from "../../actions/alert";

const Alert = ({ alerts, errors, removeAlert }) => {
  let alertsAndErrors = [];

  alerts.forEach(alert => {
    alertsAndErrors.push({
      id: alert.id,
      alertType: alert.alertType,
      msg: alert.msg
    });
  });

  errors.forEach(error => {
    if (error.param === "alert") {
      alertsAndErrors.push({
        id: errors.length,
        alertType: "is-danger",
        msg: error.msg
      });
    }
  });

  if (alertsAndErrors !== null && alertsAndErrors.length > 0) {
    return alertsAndErrors.map(alert => (
      <div key={alert.id} className={`notification ${alert.alertType}`}>
        <button className="delete" onClick={() => removeAlert(alert.id)} />
        {alert.msg}
      </div>
    ));
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
