import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Countdown from "../common/subcomponents/Countdown";
import Modal from "../common/subcomponents/Modal";
import UserInfo from "../user/UserInfo";

const EntryRequestReceivedAlert = ({
  userInfo,
  socket,
  closeAlert,
  showCloseButton
}) => {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    socket.on("entryRequestAnswered", userId => {
      if (userId === userInfo.id) {
        closeAlert();
      }
    });

    return () => {
      socket.off("entryRequestAnswered");
    };
  }, []);

  const onTimeout = () => {
    setIsActive(false);
    showCloseButton();
  };

  const answerEntryRequest = answer => {
    socket.emit("answerEntryRequest", {
      answer,
      userId: userInfo.id
    });
    closeAlert();
  };

  //<Countdown totalTime={60 * 15} onTimeout={() => onTimeout()} />

  return (
    <div className="custom-action-alert">
      <span className="icon">
        <i className="fas fa-paper-plane"></i>
      </span>
      <div className="alert-items">
        <h3>
          <Modal
            trigger={<span className="is-underlined">{userInfo.name}</span>}
          >
            <UserInfo user={userInfo} />
          </Modal>
          {` would like to join your group ${
            isActive ? "" : "(Request timed out)"
          }`}
        </h3>
        <div className="field is-grouped is-grouped-right">
          <div className="control">
            <button
              onClick={() => answerEntryRequest("Accepted")}
              disabled={!isActive}
              className="button is-light is-outlined"
              type="button"
            >
              Accept
            </button>
          </div>
          <div className="control">
            <button
              onClick={() => answerEntryRequest("Rejected")}
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
