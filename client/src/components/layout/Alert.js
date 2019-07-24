import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { removeAlert } from "../../actions/alert";

const Alert = ({ alerts, removeAlert }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
    <div key={alert.id} className={`notification ${alert.alertType}`}>
      <button className="delete" onClick={() => removeAlert(alert.id)} />
      {alert.msg}
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
  removeAlert: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(
  mapStateToProps,
  { removeAlert }
)(Alert);
