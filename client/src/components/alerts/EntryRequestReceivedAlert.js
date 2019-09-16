import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Countdown from "../common/subcomponents/Countdown";
import Modal from "../common/subcomponents/Modal";
import UserInfo from "../user/UserInfo";

const EntryRequestReceivedAlert = ({ userInfo, socket }) => {
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="entry-request-alert">
      <Countdown totalTime={30} onTimeout={() => setIsActive(false)} />
      <div className="alert-items">
        <h3>
          <Modal trigger={userInfo.name}>
            <UserInfo user={userInfo} />
          </Modal>{" "}
          would like to join your group
        </h3>
        <div className="field is-grouped is-grouped-right">
          <div className="control">
            <button
              onClick={() => socket.emit("acceptEntryRequest", userInfo.id)}
              disabled={!isActive}
              className="button is-light is-outlined"
              type="button"
            >
              Accept
            </button>
          </div>
          <div className="control">
            <button
              onClick={() => socket.emit("rejectEntryRequest", userInfo.id)}
              disabled={!isActive}
              className="button is-light is-outlined"
              type="button"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

EntryRequestReceivedAlert.propTypes = {
  socket: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  socket: state.auth.socket
});

export default connect(
  mapStateToProps,
  null
)(EntryRequestReceivedAlert);
