import React from "react";

import Countdown from "../common/subcomponents/Countdown";
import Modal from "../common/subcomponents/Modal";
import UserInfo from "../user/UserInfo";

const EntryRequestReceivedAlert = ({ userInfo }) => {
  return (
    <div className="entry-request-alert">
      <Countdown totalTime={10} />
      <div className="alert-items">
        <h3>
          <Modal trigger={userInfo.name}>
            <UserInfo user={userInfo} />
          </Modal>{" "}
          would like to join your group
        </h3>
        <div className="field is-grouped is-grouped-right">
          <div className="control">
            <button className="button is-light is-outlined" type="button">
              Accept
            </button>
          </div>
          <div className="control">
            <button className="button is-light is-outlined" type="button">
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryRequestReceivedAlert;
