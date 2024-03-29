import React from "react";

import Image from "../common/subcomponents/Image";

import defaultUserImage from "../../resources/default_user_image.png";

const UserInfo = ({ user, adminOptions }) => {
  let adminOptionButtons = null;

  if (
    adminOptions &&
    adminOptions.currentUser._id !== user._id &&
    adminOptions.groupCreator !== user._id
  ) {
    adminOptionButtons = (
      <div className="buttons has-addons is-centered">
        {typeof adminOptions.kickFromGroup === "function" && (
          <div
            onClick={() => adminOptions.kickFromGroup(user._id)}
            className="button is-dark"
          >
            <span className="icon is-small">
              <i className="fas fa-sign-out-alt" />
            </span>
            <span>Kick</span>
          </div>
        )}
        {typeof adminOptions.banFromGroup === "function" && (
          <div
            onClick={() => {
              adminOptions.banFromGroup(user._id);
            }}
            className="button is-dark"
          >
            <span className="icon is-small">
              <i className="fas fa-user-slash" />
            </span>
            <span>Ban</span>
          </div>
        )}{" "}
        {typeof adminOptions.toggleGroupAdmin === "function" && (
          <div
            onClick={() => adminOptions.toggleGroupAdmin(user._id)}
            className="button is-dark"
          >
            <span className="icon is-small">
              <i className="fas fa-user-shield" />
            </span>
            <span>
              {user.memberType === "admin" ? "Unadminify" : "Adminify"}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="hs-box has-text-centered user-info has-rounded-corners">
      {user.memberType === "admin" && (
        <div className="header-tab">
          <div className="subtitle is-size-6 has-text-weight-bold">Admin</div>
        </div>
      )}
      <Image
        src={user.image && user.image.link ? user.image.link : defaultUserImage}
        figureClass="is-square"
        imageClass="is-rounded"
      />
      <div className="content">
        <h3 className="is-size-4">{user.name}</h3>
        {user.about && <h6 className="is-size-6">{user.about}</h6>}
      </div>
      {adminOptionButtons}
    </div>
  );
};

export default UserInfo;
