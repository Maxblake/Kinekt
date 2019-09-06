import React from "react";

import Image from "../common/subcomponents/Image";

import defaultUserImage from "../../resources/default_user_image.png";

const UserInfo = ({ user, adminOptions }) => {
  return (
    <div className="box has-text-centered user-info">
      {user.memberType === "admin" && (
        <div className="header-tab">
          <div className="subtitle is-size-6 has-text-weight-bold">Admin</div>
        </div>
      )}
      <Image
        src={user.image ? user.image.link : defaultUserImage}
        figureClass="is-square"
        imageClass="is-rounded"
      />
      <div className="content">
        <h3 className="is-size-3">{user.name}</h3>
        <h6 className="is-size-6">{user.about}</h6>
      </div>
      <button
        onClick={() => adminOptions.kickFromGroup(user._id)}
        className="button is-fullwidth is-primary"
      >
        <span className="icon is-small">
          <i className="fas fa-sign-out-alt" />
        </span>
        <span>Kick user</span>
      </button>
    </div>
  );
};

export default UserInfo;
