import React from "react";
import Modal from "../common/subcomponents/Modal";
import UserInfo from "../user/UserInfo";

const GroupMember = ({ user, adminOptions }) => {
  const getClassList = (status, memberType) => {
    const classList = ["button", "group-member"];

    switch (memberType) {
      case "admin":
        classList.push("is-rounded");
        break;
      case "user":
      default:
        classList.push("is-user");
        break;
    }

    switch (status) {
      case "online":
        classList.push("is-online");
        break;
      case "away":
      default:
        classList.push("is-away");
        break;
    }

    return classList.join(" ");
  };

  return (
    <Modal
      trigger={
        <div className={getClassList(user.status, user.memberType)}>
          {user.name}
        </div>
      }
    >
      <UserInfo user={user} adminOptions={adminOptions} />
    </Modal>
  );
};

export default GroupMember;
